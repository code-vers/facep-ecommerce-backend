import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2026-07-29.dahlia'
});

interface CheckoutItem {
  id: string;
  name: string;
  slug: string;
  cartItemId: string;
  quantity: number;
  price: number;
  image?: string;
  color?: string;
  size?: string;
  storage?: string;
  material?: string;
  sellerName?: string;
}

export const OrderService = {
  async createCheckoutSession(payload: Record<string, unknown>, userId?: string) {
    const items = payload.items as CheckoutItem[];
    const formData = payload.formData as Record<string, string>;
    const subtotal = payload.subtotal as number;
    const shippingCost = payload.shippingCost as number;
    const taxAmount = payload.taxAmount as number;
    const vatGst = payload.vatGst as number;
    const importCharges = payload.importCharges as number;
    const handlingFee = payload.handlingFee as number;
    const total = payload.total as number;

    const orderNumber = `FCP-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        address: formData.address,
        country: formData.country,
        city: formData.city,
        location: formData.location,
        note: formData.note,

        subtotal: subtotal,
        shippingCost: shippingCost,
        taxAmount: taxAmount,
        vatGst: vatGst,
        importCharges: importCharges,
        handlingFee: handlingFee,
        total: total,

        items: {
          create: items.map((item) => ({
            productId: item.id,
            productName: item.name,
            slug: item.slug,
            sku: item.cartItemId,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
            color: item.color,
            size: item.size,
            storage: item.storage,
            material: item.material,
            vendorName: item.sellerName
          }))
        }
      }
    });

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      // Stripe rejects localhost image URLs.
      const isValidStripeImage =
        item.image && item.image.startsWith('http') && !item.image.includes('localhost');

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: isValidStripeImage ? [item.image as string] : []
          },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
      };
    });

    // Add extra fees
    const extraFees =
      Number(shippingCost) +
      Number(taxAmount) +
      Number(vatGst) +
      Number(importCharges) +
      Number(handlingFee);

    if (extraFees > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping & Extra Fees'
          },
          unit_amount: Math.round(extraFees * 100)
        },
        quantity: 1
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${frontendUrl}/checkout/success?order=${order.orderNumber}`,
        cancel_url: `${frontendUrl}/checkout/cancel?order=${order.orderNumber}`,
        client_reference_id: order.id,
        customer_email: formData.email
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: session.id }
      });

      return { url: session.url, orderNumber };
    } catch (error: unknown) {
      console.log('Stripe Checkout Error:', error);
      throw error;
    }
  },

  async handleWebhook(body: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) return;

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Webhook Error: ${err.message}`, { cause: err });
      }
      throw new Error('Webhook Error', { cause: err });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.client_reference_id) {
        const orderId = session.client_reference_id as string;

        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'PAID' }
        });

        // Calculate and distribute earnings
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true }
        });

        if (order) {
          const productIds = order.items.map((i) => i.productId);
          const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, vendorId: true }
          });

          const vendorMap = new Map<string, string>();
          products.forEach((p) => {
            if (p.vendorId) vendorMap.set(p.id, p.vendorId);
          });

          const earningsByVendor: Record<string, number> = {};

          order.items.forEach((item) => {
            const vendorId = vendorMap.get(item.productId);
            if (vendorId) {
              const totalItemPrice = Number(item.price) * item.quantity;
              earningsByVendor[vendorId] = (earningsByVendor[vendorId] || 0) + totalItemPrice;
            }
          });

          // Create earnings and update pending balance
          for (const [vendorId, totalSales] of Object.entries(earningsByVendor)) {
            const adminCommission = totalSales * 0.1; // 10%
            const vendorAmount = totalSales * 0.9; // 90%

            await prisma.orderEarning.create({
              data: {
                orderId,
                vendorId,
                amount: vendorAmount,
                adminCommission,
                isCleared: false
              }
            });

            await prisma.vendorWallet.upsert({
              where: { vendorId },
              update: {
                pendingBalance: { increment: vendorAmount }
              },
              create: {
                vendorId,
                pendingBalance: vendorAmount,
                availableBalance: 0,
                totalWithdrawn: 0
              }
            });
          }
        }
      }
    }
  },

  async getMyOrders(
    userId: string,
    options: { page?: number; limit?: number; search?: string; status?: string }
  ) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (options.status && options.status !== 'All Orders') {
      const statusMap: Record<string, string[]> = {
        Ordered: ['PENDING_PAYMENT', 'PAID'],
        Packed: ['PROCESSING'],
        Shipped: ['SHIPPED'],
        Delivered: ['DELIVERED'],
        Returned: ['CANCELLED'] // Assuming cancelled/returned
      };

      const mappedStatuses = statusMap[options.status];
      if (mappedStatuses) {
        where.status = { in: mappedStatuses };
      }
    }

    if (options.search) {
      where.OR = [
        { orderNumber: { contains: options.search, mode: 'insensitive' } },
        { items: { some: { productName: { contains: options.search, mode: 'insensitive' } } } }
      ];
    }

    const [orders, total, allUserOrders] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({ where }),
      prisma.order.findMany({
        where: { userId },
        select: { status: true }
      })
    ]);

    const stats = {
      all: allUserOrders.length,
      ordered: allUserOrders.filter((o) => o.status === 'PENDING_PAYMENT' || o.status === 'PAID')
        .length,
      packed: allUserOrders.filter((o) => o.status === 'PROCESSING').length,
      shipped: allUserOrders.filter((o) => o.status === 'SHIPPED').length,
      delivered: allUserOrders.filter((o) => o.status === 'DELIVERED').length,
      returned: allUserOrders.filter((o) => o.status === 'CANCELLED').length
    };

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        stats
      },
      data: orders
    };
  },

  async getMyOrderById(userId: string, orderIdOrNumber: string) {
    const order = await prisma.order.findFirst({
      where: {
        userId,
        OR: [{ id: orderIdOrNumber }, { orderNumber: orderIdOrNumber }]
      },
      include: { items: true }
    });

    if (!order) {
      throw new AppError(404, 'Order not found');
    }

    return order;
  },

  async cancelUserOrder(userId: string, orderIdOrNumber: string, reason?: string) {
    const order = await prisma.order.findFirst({
      where: {
        userId,
        OR: [{ id: orderIdOrNumber }, { orderNumber: orderIdOrNumber }]
      }
    });

    if (!order) {
      throw new AppError(404, 'Order not found');
    }

    if (order.status === 'DELIVERED') {
      throw new AppError(400, 'Cannot cancel an order that has already been delivered');
    }

    if (order.status === 'CANCELLED') {
      throw new AppError(400, 'Order is already cancelled');
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'CANCELLED',
        ...(reason
          ? {
              note: order.note
                ? `${order.note} | Cancellation reason: ${reason}`
                : `Cancellation reason: ${reason}`
            }
          : {})
      },
      include: { items: true }
    });

    return updated;
  },

  async getVendorOrders(
    userId: string,
    role: string,
    options: { page?: number; limit?: number; search?: string; status?: string }
  ) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    let productIds: string[] = [];

    if (role !== 'ADMIN') {
      const products = await prisma.product.findMany({
        where: { vendorId: userId },
        select: { id: true }
      });
      productIds = products.map((p) => p.id);
      where.items = { some: { productId: { in: productIds } } };
    }

    if (options.status && options.status !== 'All Orders') {
      const statusMap: Record<string, string[]> = {
        Ordered: ['PENDING_PAYMENT', 'PAID'],
        Packed: ['PROCESSING'],
        Shipped: ['SHIPPED'],
        Delivered: ['DELIVERED'],
        Returned: ['CANCELLED']
      };
      const mappedStatuses = statusMap[options.status];
      if (mappedStatuses) {
        where.status = { in: mappedStatuses };
      }
    }

    if (options.search) {
      where.OR = [
        { orderNumber: { contains: options.search, mode: 'insensitive' } },
        { items: { some: { productName: { contains: options.search, mode: 'insensitive' } } } }
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ]);

    const filteredOrders =
      role === 'ADMIN'
        ? orders
        : orders.map((order) => ({
            ...order,
            items: order.items.filter((item) => productIds.includes(item.productId))
          }));

    // Calculate stats
    const allWhere = role === 'ADMIN' ? {} : { items: { some: { productId: { in: productIds } } } };
    const allOrders = await prisma.order.findMany({
      where: allWhere,
      select: { status: true }
    });

    const stats = {
      totalOrders: allOrders.length,
      completedOrders: allOrders.filter((o) => o.status === 'DELIVERED').length,
      pendingOrders: allOrders.filter(
        (o) => o.status === 'PENDING_PAYMENT' || o.status === 'PROCESSING'
      ).length,
      cancelledOrders: allOrders.filter((o) => o.status === 'CANCELLED').length
    };

    return {
      meta: { page, limit, total, totalPages: Math.ceil(total / limit), stats },
      data: filteredOrders
    };
  },

  async updateOrderStatus(orderId: string, status: string, vendorId: string) {
    if (vendorId !== 'ADMIN_BYPASS') {
      const products = await prisma.product.findMany({ where: { vendorId }, select: { id: true } });
      const productIds = products.map((p) => p.id);
      const order = await prisma.order.findFirst({
        where: { id: orderId, items: { some: { productId: { in: productIds } } } }
      });
      if (!order) {
        throw new Error('Order not found or unauthorized');
      }
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any }
    });

    if (status === 'DELIVERED') {
      // Clear earnings for all vendors in this order
      const earnings = await prisma.orderEarning.findMany({
        where: { orderId, isCleared: false }
      });

      for (const earning of earnings) {
        await prisma.orderEarning.update({
          where: { id: earning.id },
          data: { isCleared: true }
        });

        await prisma.vendorWallet.update({
          where: { vendorId: earning.vendorId },
          data: {
            pendingBalance: { decrement: earning.amount },
            availableBalance: { increment: earning.amount }
          }
        });
      }
    }

    return updated;
  },

  async deleteOrder(orderId: string, vendorId: string) {
    if (vendorId !== 'ADMIN_BYPASS') {
      const products = await prisma.product.findMany({ where: { vendorId }, select: { id: true } });
      const productIds = products.map((p) => p.id);
      const order = await prisma.order.findFirst({
        where: { id: orderId, items: { some: { productId: { in: productIds } } } }
      });
      if (!order) {
        throw new Error('Order not found or unauthorized');
      }
    }

    return await prisma.order.delete({
      where: { id: orderId }
    });
  }
};
