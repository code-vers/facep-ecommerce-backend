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
        await prisma.order.update({
          where: { id: session.client_reference_id as string },
          data: { status: 'PAID' }
        });
      }
    }
  }
};
