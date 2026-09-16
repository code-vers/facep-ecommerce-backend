import { Condition, DiscountType, ShippingFeeType, StockStatus } from '@prisma/client';
import { logger } from '../src/app/utils/logger';
import prisma from '../src/app/utils/prisma';

interface SeedProductDefinition {
  categoryName: string;
  subcategoryName: string;
  name: string;
  sku: string;
  brand: string;
  productType: string;
  shortDescription: string;
  detailedDescription: string;
  keyFeatures: string;
  tags: string[];
  condition?: Condition;
  availableColors: string[];
  thumbnail: string;
  previewImages: string[];
  basePrice: number;
  oldPrice?: number;
  discountType?: DiscountType;
  discountValue?: number;
  dealBadgeText?: string;
  shipsFrom: string;
  minDeliveryDays: number;
  maxDeliveryDays: number;
  shippingFeeType?: ShippingFeeType;
  shippingCost?: number;
  deliveryStandard: boolean;
  deliveryCod: boolean;
  deliveryExpress: boolean;
  stockQuantity: number;
  stockStatus?: StockStatus;
  lowStockAlertQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  inventoryManagedBy: string;
  warehouseLocation: string;
  returnPolicy: string;
  returnTerms: string;
  specifications: { name: string; value: string }[];
  hasVariants: boolean;
  variants?: {
    sku: string;
    price: number;
    stock: number;
    color?: string;
    size?: string;
    storage?: string;
    image?: string;
  }[];
}

const PRODUCTS_DATA: SeedProductDefinition[] = [
  // ── 1. Lighting Solutions ──
  {
    categoryName: 'Lighting Solutions',
    subcategoryName: 'Chandeliers',
    name: 'Nordic Minimalist Branch Chandelier',
    sku: 'FACEP-LIGHT-CHAND-01',
    brand: 'Lumière Living',
    productType: 'Ceiling Chandelier',
    shortDescription: 'Sleek architectural modern branch chandelier with dimmable warm LED globes.',
    detailedDescription:
      '<p>Transform your dining or living room with the Nordic Minimalist Branch Chandelier. Crafted with aerospace-grade brushed aluminum and frosted white glass globes, it delivers balanced, soft ambient illumination while serving as an eye-catching focal piece.</p>',
    keyFeatures:
      '<ul><li>Adjustable suspension rod for high or standard ceilings</li><li>Energy-efficient warm white 3000K LED modules</li><li>Compatible with standard wall dimmers</li><li>Premium matte brass finish</li></ul>',
    tags: ['lighting', 'chandelier', 'modern', 'home decor', 'living room'],
    condition: Condition.NEW,
    availableColors: ['Matte Gold', 'Obsidian Black'],
    thumbnail: '/uploads/categories/product-2.jpg',
    previewImages: ['/uploads/categories/product-2.jpg', '/uploads/categories/banner.png'],
    basePrice: 189.99,
    oldPrice: 249.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 24,
    dealBadgeText: '24% OFF',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 45,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 5,
    minOrderQuantity: 1,
    maxOrderQuantity: 4,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone B, Rack 12',
    returnPolicy: '30-Day Money Back Guarantee',
    returnTerms: 'Must be returned in original packaging with all mounting hardware included.',
    specifications: [
      { name: 'Dimensions', value: '38" W x 18" H x 24" D' },
      { name: 'Wattage', value: '45W LED equivalent to 300W incandescent' },
      { name: 'Voltage', value: '110-240V AC' },
      { name: 'Certification', value: 'UL Listed / CE Certified' }
    ],
    hasVariants: false
  },
  {
    categoryName: 'Lighting Solutions',
    subcategoryName: 'String Lights',
    name: 'Outdoor Commercial Weatherproof String Lights 48ft',
    sku: 'FACEP-LIGHT-STRING-02',
    brand: 'AuraGlow',
    productType: 'String Lights',
    shortDescription:
      'Heavy-duty commercial patio string lights with shatterproof vintage Edison filament bulbs.',
    detailedDescription:
      '<p>Designed for year-round outdoor elegance, these weatherproof string lights withstand extreme rain, snow, and wind. The included shatterproof LED vintage bulbs create a warm, inviting atmosphere for patios, gardens, and cafes.</p>',
    keyFeatures:
      '<ul><li>IP65 commercial waterproof rubberized cord</li><li>15 shatterproof S14 LED Edison bulbs included</li><li>End-to-end connectable up to 20 strands</li><li>Low energy consumption of only 1W per bulb</li></ul>',
    tags: ['outdoor', 'patio', 'string lights', 'weatherproof', 'garden'],
    condition: Condition.NEW,
    availableColors: ['Matte Black'],
    thumbnail: '/uploads/categories/product-2.jpg',
    previewImages: ['/uploads/categories/product-2.jpg'],
    basePrice: 39.99,
    oldPrice: 54.99,
    discountType: DiscountType.FIXED,
    discountValue: 15,
    dealBadgeText: 'Best Seller',
    shipsFrom: 'East Coast Warehouse, PA',
    minDeliveryDays: 1,
    maxDeliveryDays: 3,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 120,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 15,
    minOrderQuantity: 1,
    maxOrderQuantity: 10,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone A, Rack 04',
    returnPolicy: '30-Day Free Returns',
    returnTerms: 'Return within 30 days for a replacement or full refund.',
    specifications: [
      { name: 'Length', value: '48 Feet' },
      { name: 'Bulb Count', value: '15 Sockets + 15 LED Bulbs' },
      { name: 'Waterproof Rating', value: 'IP65 Commercial Grade' }
    ],
    hasVariants: false
  },
  {
    categoryName: 'Lighting Solutions',
    subcategoryName: 'Lamps & Shades',
    name: 'Architectural Touch Dimmable Desk Lamp with Qi Charger',
    sku: 'FACEP-LIGHT-DESKLAMP-03',
    brand: 'Lumière Living',
    productType: 'Desk Lamp',
    shortDescription:
      'Eye-caring flexible LED study lamp with 5 color temperatures and 15W wireless phone charger.',
    detailedDescription:
      '<p>Engineered for productivity and eye comfort, this multi-angle architect lamp eliminates flicker and glare. It features an integrated fast wireless charging pad at the base and sensitive touch controls for brightness and color modes.</p>',
    keyFeatures:
      '<ul><li>Built-in 15W Qi wireless phone charger</li><li>5 color modes (2700K - 6500K) with 10 brightness levels</li><li>Auto-off 45-minute sleep timer</li><li>Multi-angle rotating arm and head</li></ul>',
    tags: ['desk lamp', 'office', 'study', 'wireless charging', 'led lamp'],
    condition: Condition.NEW,
    availableColors: ['Space Gray', 'White'],
    thumbnail: '/uploads/categories/product-2.jpg',
    previewImages: ['/uploads/categories/product-2.jpg'],
    basePrice: 49.99,
    oldPrice: 69.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 28,
    dealBadgeText: 'Save 28%',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 80,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 10,
    minOrderQuantity: 1,
    maxOrderQuantity: 5,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone B, Rack 08',
    returnPolicy: '30-Day Satisfaction Guarantee',
    returnTerms: 'Must include power adapter and original box.',
    specifications: [
      { name: 'Brightness', value: '800 Lumens' },
      { name: 'Color Temp', value: '2700K - 6500K' },
      { name: 'Wireless Output', value: '15W Fast Charge' }
    ],
    hasVariants: false
  },

  // ── 2. Home Decor ──
  {
    categoryName: 'Home Decor',
    subcategoryName: 'Vases & Vessels',
    name: 'Artisan Matte Fluted Ceramic Vase',
    sku: 'FACEP-DECOR-VASE-01',
    brand: 'Artisan Living',
    productType: 'Ceramic Vase',
    shortDescription:
      'Nordic minimalist textured fluted earthenware vase for dried botanicals and fresh blossoms.',
    detailedDescription:
      '<p>Handcrafted by master potters, the Artisan Fluted Vase brings organic Scandinavian warmth to coffee tables, mantels, and shelves. Features a durable waterproof glazed interior and a sophisticated matte exterior finish.</p>',
    keyFeatures:
      '<ul><li>100% natural clay stoneware</li><li>Water-tight interior for fresh florals</li><li>Unique fluted architectural silhouette</li><li>Non-scratch foam base pads</li></ul>',
    tags: ['decor', 'ceramic', 'vase', 'home aesthetic', 'scandinavian'],
    condition: Condition.NEW,
    availableColors: ['Cream White', 'Terracotta', 'Sage'],
    thumbnail: '/uploads/categories/banner.png',
    previewImages: ['/uploads/categories/banner.png'],
    basePrice: 32.5,
    oldPrice: 45.0,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 27,
    dealBadgeText: 'Trending',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 2,
    maxDeliveryDays: 5,
    shippingFeeType: ShippingFeeType.STANDARD,
    shippingCost: 4.99,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: false,
    stockQuantity: 65,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 8,
    minOrderQuantity: 1,
    maxOrderQuantity: 6,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone C, Shelf 14',
    returnPolicy: '30-Day Return Policy',
    returnTerms: 'Fragile item - return with protective bubble wrapping.',
    specifications: [
      { name: 'Height', value: '10.5 inches' },
      { name: 'Diameter', value: '5.2 inches' },
      { name: 'Material', value: 'Handmade Stoneware Ceramic' }
    ],
    hasVariants: false
  },
  {
    categoryName: 'Home Decor',
    subcategoryName: 'Wall Art & Paintings',
    name: 'Abstract Textured Canvas Wall Art Set of 2',
    sku: 'FACEP-DECOR-WALLART-02',
    brand: 'Artisan Living',
    productType: 'Wall Art',
    shortDescription:
      'Gallery-wrapped textured oil canvas wall prints with natural oak wood floating frames.',
    detailedDescription:
      '<p>Elevate your interior walls with this curated duo of abstract textured prints. Each piece features layered brushwork in neutral tones, finished inside solid oak floater frames ready for effortless hanging.</p>',
    keyFeatures:
      '<ul><li>Heavy-duty linen cotton canvas with textured relief</li><li>Solid oak floating frame</li><li>D-ring hanging hardware pre-installed</li><li>Fade-resistant archival inks</li></ul>',
    tags: ['wall art', 'canvas', 'paintings', 'living room decor', 'framed art'],
    condition: Condition.NEW,
    availableColors: ['Neutral Warm', 'Moody Charcoal'],
    thumbnail: '/uploads/categories/banner.png',
    previewImages: ['/uploads/categories/banner.png'],
    basePrice: 89.99,
    oldPrice: 120.0,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 25,
    dealBadgeText: 'Staff Pick',
    shipsFrom: 'East Coast Warehouse, PA',
    minDeliveryDays: 3,
    maxDeliveryDays: 6,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: false,
    deliveryExpress: true,
    stockQuantity: 40,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 5,
    minOrderQuantity: 1,
    maxOrderQuantity: 3,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone C, Shelf 22',
    returnPolicy: '30-Day Hassle-Free Returns',
    returnTerms: 'Artwork must not be punctured or soiled.',
    specifications: [
      { name: 'Size', value: '24" x 36" per panel' },
      { name: 'Frame', value: 'Solid Natural Oak Wood' }
    ],
    hasVariants: false
  },
  {
    categoryName: 'Home Decor',
    subcategoryName: 'Photo Frames',
    name: 'Solid Hardwood Gallery Wall Frame Pack (7 Pieces)',
    sku: 'FACEP-DECOR-FRAME-03',
    brand: 'Artisan Living',
    productType: 'Photo Frames',
    shortDescription:
      'Multi-size contemporary picture frame gallery bundle with acid-free white mats.',
    detailedDescription:
      '<p>Create an impeccably balanced family gallery wall in minutes. This set includes 7 real hardwood frames with HD tempered glass fronts, removable acid-free matboards, and hanging templates.</p>',
    keyFeatures:
      '<ul><li>100% solid pinewood construction</li><li>High-definition distortion-free tempered glass</li><li>Includes 1x 11x14", 2x 8x10", and 4x 5x7" frames</li><li>Hanging template & bubble level included</li></ul>',
    tags: ['frames', 'photo frames', 'gallery wall', 'memories', 'hardwood'],
    condition: Condition.NEW,
    availableColors: ['Natural Walnut', 'Matte Black', 'Warm White'],
    thumbnail: '/uploads/categories/banner.png',
    previewImages: ['/uploads/categories/banner.png'],
    basePrice: 42.99,
    oldPrice: 59.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 28,
    dealBadgeText: 'Value Bundle',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 95,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 12,
    minOrderQuantity: 1,
    maxOrderQuantity: 5,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone C, Shelf 08',
    returnPolicy: '30-Day Satisfaction Policy',
    returnTerms: 'All 7 frames must be returned together.',
    specifications: [
      { name: 'Frame Count', value: '7 Pieces Set' },
      { name: 'Glass Type', value: 'Tempered Ultra-Clear Glass' }
    ],
    hasVariants: false
  },

  // ── 3. Smart Home & Lighting ──
  {
    categoryName: 'Smart Home & Lighting',
    subcategoryName: 'Smart Bulbs',
    name: 'Smart WiFi LED RGB & Tunable White Bulbs (4-Pack)',
    sku: 'FACEP-SMART-BULB-01',
    brand: 'AuraTech',
    productType: 'Smart Bulb',
    shortDescription:
      'App-controlled 16M color smart bulbs with Alexa, Google Home, and music sync support.',
    detailedDescription:
      '<p>Upgrade your entire room with 16 million colors and tunable whites from cozy warm 2200K to crisp daylight 6500K. No expensive hub required—connects directly to 2.4GHz WiFi with easy scheduling and voice automation.</p>',
    keyFeatures:
      '<ul><li>Direct 2.4GHz WiFi connection — no hub required</li><li>Works seamlessly with Alexa & Google Assistant</li><li>16 million colors plus circadian rhythm scheduling</li><li>800 Lumens (60W equivalent) while consuming only 9W</li></ul>',
    tags: ['smart home', 'smart bulb', 'rgb lighting', 'alexa', 'google assistant'],
    condition: Condition.NEW,
    availableColors: ['RGB Multicolor'],
    thumbnail: '/uploads/categories/product-2.jpg',
    previewImages: ['/uploads/categories/product-2.jpg'],
    basePrice: 34.99,
    oldPrice: 49.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 30,
    dealBadgeText: 'Hot Deal',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 1,
    maxDeliveryDays: 3,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 150,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 20,
    minOrderQuantity: 1,
    maxOrderQuantity: 8,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone D, Shelf 02',
    returnPolicy: '30-Day Free Returns',
    returnTerms: 'Full refund within 30 days.',
    specifications: [
      { name: 'Base Type', value: 'Standard E26' },
      { name: 'Wattage', value: '9W (800 Lumens)' },
      { name: 'Wireless Standard', value: '2.4GHz 802.11 b/g/n' }
    ],
    hasVariants: false
  },
  {
    categoryName: 'Smart Home & Lighting',
    subcategoryName: 'Smart Plugs',
    name: 'Mini Smart WiFi Plug with Real-Time Energy Monitoring',
    sku: 'FACEP-SMART-PLUG-02',
    brand: 'AuraTech',
    productType: 'Smart Plug',
    shortDescription:
      'Compact 15A smart plug with real-time power tracking, automated timers, and voice control.',
    detailedDescription:
      '<p>Track real-time energy usage and automate your household appliances from anywhere. Its ultra-compact slim design keeps the second wall outlet completely free.</p>',
    keyFeatures:
      '<ul><li>Live electric consumption and historical cost charts</li><li>Slim form factor leaves adjacent socket accessible</li><li>15A 1800W max high-load rating for heavy appliances</li><li>Voice control with Alexa, Google, and Apple Siri Shortcuts</li></ul>',
    tags: ['smart plug', 'energy saver', 'home automation', 'smart socket'],
    condition: Condition.NEW,
    availableColors: ['White'],
    thumbnail: '/uploads/categories/product-2.jpg',
    previewImages: ['/uploads/categories/product-2.jpg'],
    basePrice: 18.99,
    oldPrice: 24.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 24,
    dealBadgeText: 'Eco Friendly',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 1,
    maxDeliveryDays: 3,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 200,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 25,
    minOrderQuantity: 1,
    maxOrderQuantity: 10,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone D, Shelf 05',
    returnPolicy: '30-Day Money Back Guarantee',
    returnTerms: 'Standard return conditions apply.',
    specifications: [
      { name: 'Max Load', value: '15A, 1800W' },
      { name: 'Input Voltage', value: '100-240V AC' }
    ],
    hasVariants: false
  },
  {
    categoryName: 'Smart Home & Lighting',
    subcategoryName: 'Home Security Cameras',
    name: '2K Wireless Outdoor Security Camera with Spotlight',
    sku: 'FACEP-SMART-CAM-03',
    brand: 'AuraTech',
    productType: 'Security Camera',
    shortDescription:
      'Rechargeable battery outdoor security camera with color night vision and two-way audio.',
    detailedDescription:
      '<p>Keep your home secure 24/7 with crystal-clear 2K HDR video, intelligent AI human detection, and an active motion-activated spotlight. Up to 180 days of battery life per single USB-C charge.</p>',
    keyFeatures:
      '<ul><li>2K Quad HD video resolution with 130° wide field of view</li><li>Full color night vision powered by integrated spotlight</li><li>Built-in siren and two-way talk audio</li><li>IP66 all-weather waterproof rating</li></ul>',
    tags: ['security camera', 'cctv', 'smart home', 'outdoor security', '2k camera'],
    condition: Condition.NEW,
    availableColors: ['White'],
    thumbnail: '/uploads/categories/product-8.jpg',
    previewImages: ['/uploads/categories/product-8.jpg'],
    basePrice: 69.99,
    oldPrice: 99.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 30,
    dealBadgeText: 'Top Rated',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: false,
    deliveryExpress: true,
    stockQuantity: 75,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 10,
    minOrderQuantity: 1,
    maxOrderQuantity: 4,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone D, Shelf 18',
    returnPolicy: '30-Day Trial Period',
    returnTerms: 'Return camera and mounting bracket in original packaging.',
    specifications: [
      { name: 'Resolution', value: '2K QHD (2560 x 1440)' },
      { name: 'Battery Life', value: 'Up to 180 Days on a Single Charge' },
      { name: 'Storage', value: 'MicroSD up to 256GB / Cloud Support' }
    ],
    hasVariants: false
  },

  // ── 4. Kitchen Appliances ──
  {
    categoryName: 'Kitchen Appliances',
    subcategoryName: 'Cookware Sets',
    name: 'Hard-Anodized Non-Stick Cookware Set (10-Piece)',
    sku: 'FACEP-KITCH-COOKWARE-01',
    brand: 'CuisineMaster',
    productType: 'Cookware Set',
    shortDescription:
      'Professional grade scratch-resistant nonstick pots and pans with stay-cool stainless handles.',
    detailedDescription:
      '<p>Engineered for even heat distribution and effortless food release. This 10-piece kitchen essential set is oven-safe up to 500°F and compatible with gas, electric, ceramic, and induction cooktops.</p>',
    keyFeatures:
      '<ul><li>Triple-layer PFOA-free reinforced non-stick coating</li><li>Heavy-gauge hard-anodized aluminum core</li><li>Ergonomic riveted stay-cool stainless steel handles</li><li>Tempered glass lids with steam vent</li></ul>',
    tags: ['cookware', 'pots and pans', 'kitchen', 'nonstick', 'chef'],
    condition: Condition.NEW,
    availableColors: ['Matte Charcoal', 'Navy Blue'],
    thumbnail: '/uploads/categories/banner.png',
    previewImages: ['/uploads/categories/banner.png'],
    basePrice: 129.99,
    oldPrice: 179.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 28,
    dealBadgeText: '28% OFF',
    shipsFrom: 'East Coast Warehouse, PA',
    minDeliveryDays: 2,
    maxDeliveryDays: 5,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: false,
    stockQuantity: 55,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 6,
    minOrderQuantity: 1,
    maxOrderQuantity: 2,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone E, Aisle 01',
    returnPolicy: '30-Day Home Trial',
    returnTerms: 'Full refund within 30 days.',
    specifications: [
      { name: 'Piece Count', value: '10 Pieces' },
      { name: 'Oven Safe', value: 'Up to 500°F' },
      { name: 'Dishwasher Safe', value: 'Yes' }
    ],
    hasVariants: false
  },
  {
    categoryName: 'Kitchen Appliances',
    subcategoryName: 'Blenders & Juicers',
    name: 'Professional Countertop High-Speed Blender 1400W',
    sku: 'FACEP-KITCH-BLENDER-02',
    brand: 'CuisineMaster',
    productType: 'Countertop Blender',
    shortDescription:
      'Commercial grade 1400-watt peak blender with 6-leaf hardened steel blades and pulse preset.',
    detailedDescription:
      '<p>Crush ice, make silken nut butters, and whip up healthy fruit smoothies in seconds. Features a durable BPA-free 64oz Tritan pitcher and self-cleaning mode in under 60 seconds.</p>',
    keyFeatures:
      '<ul><li>1400W peak motor with variable 10-speed dial</li><li>64oz heavy-duty impact-resistant Tritan pitcher</li><li>Laser-cut hardened aircraft-grade stainless steel blades</li><li>Self-cleaning function with a drop of soap and warm water</li></ul>',
    tags: ['blender', 'smoothie', 'kitchen appliance', 'healthy', 'juice'],
    condition: Condition.NEW,
    availableColors: ['Brushed Stainless', 'Obsidian Black'],
    thumbnail: '/uploads/categories/banner.png',
    previewImages: ['/uploads/categories/banner.png'],
    basePrice: 79.99,
    oldPrice: 109.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 27,
    dealBadgeText: 'Best Seller',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 70,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 10,
    minOrderQuantity: 1,
    maxOrderQuantity: 3,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone E, Aisle 06',
    returnPolicy: '30-Day Satisfaction Guarantee',
    returnTerms: 'Must include motor base, pitcher, tamper, and manual.',
    specifications: [
      { name: 'Power', value: '1400 Watts' },
      { name: 'Capacity', value: '64 Fluid Ounces (2 Liters)' },
      { name: 'Warranty', value: '2-Year Manufacturer Warranty' }
    ],
    hasVariants: false
  },
  {
    categoryName: 'Kitchen Appliances',
    subcategoryName: 'Coffee Makers',
    name: '24-Hour Programmable 12-Cup Thermal Drip Coffee Maker',
    sku: 'FACEP-KITCH-COFFEE-03',
    brand: 'BrewCraft',
    productType: 'Coffee Maker',
    shortDescription:
      'Precision temperature drip coffee machine with vacuum-insulated stainless steel thermal carafe.',
    detailedDescription:
      '<p>Wake up to piping hot, richly brewed coffee every morning. The double-walled thermal stainless steel carafe keeps coffee hot and aromatic for up to 6 hours without burning on a hot plate.</p>',
    keyFeatures:
      '<ul><li>Double-walled thermal carafe keeps coffee fresh for 6+ hours</li><li>Programmable 24-hour auto-brew timer</li><li>Bold flavor strength selector</li><li>Reusable gold-tone mesh filter and charcoal water filter</li></ul>',
    tags: ['coffee', 'coffee maker', 'thermal carafe', 'morning brew', 'kitchen'],
    condition: Condition.NEW,
    availableColors: ['Stainless Steel'],
    thumbnail: '/uploads/categories/banner.png',
    previewImages: ['/uploads/categories/banner.png'],
    basePrice: 54.99,
    oldPrice: 74.99,
    discountType: DiscountType.FIXED,
    discountValue: 20,
    dealBadgeText: '$20 OFF',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 1,
    maxDeliveryDays: 3,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 85,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 10,
    minOrderQuantity: 1,
    maxOrderQuantity: 4,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone E, Aisle 12',
    returnPolicy: '30-Day Money Back Guarantee',
    returnTerms: 'Standard return policy.',
    specifications: [
      { name: 'Capacity', value: '12 Cups (60 oz)' },
      { name: 'Carafe Material', value: 'Stainless Steel Thermal Vacuum' }
    ],
    hasVariants: false
  },

  // ── 5. Gaming & Accessories ──
  {
    categoryName: 'Gaming & Accessories',
    subcategoryName: 'Gaming Keyboards',
    name: 'Apex Pro RGB Mechanical Gaming Keyboard',
    sku: 'FACEP-GAME-KEYBOARD-01',
    brand: 'Apex Gaming',
    productType: 'Mechanical Keyboard',
    shortDescription:
      'Hot-swappable linear red switches, per-key RGB backlighting, and CNC aluminum top plate.',
    detailedDescription:
      '<p>Designed for esports dominance. Features rapid pre-lubed mechanical switches with 1ms latency, durable doubleshot PBT keycaps, and a plush magnetic wrist rest for marathon gaming sessions.</p>',
    keyFeatures:
      '<ul><li>Hot-swappable mechanical switches (50M keystrokes rated)</li><li>Per-key customizable 16.8M RGB with side-glow accents</li><li>CNC aircraft-grade aluminum top frame</li><li>Detachable braided USB-C cable</li></ul>',
    tags: ['gaming', 'keyboard', 'rgb', 'mechanical keyboard', 'esports'],
    condition: Condition.NEW,
    availableColors: ['Matte Black', 'Glacier White'],
    thumbnail: '/uploads/categories/product-1.jpg',
    previewImages: ['/uploads/categories/product-1.jpg', '/uploads/categories/product-6.jpg'],
    basePrice: 79.99,
    oldPrice: 109.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 27,
    dealBadgeText: 'Gamer Choice',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 1,
    maxDeliveryDays: 3,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 110,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 15,
    minOrderQuantity: 1,
    maxOrderQuantity: 3,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone F, Rack 01',
    returnPolicy: '30-Day Satisfaction Guarantee',
    returnTerms: 'Includes keycap puller and switch puller in return.',
    specifications: [
      { name: 'Switch Type', value: 'Pre-lubed Red Linear Switches' },
      { name: 'Polling Rate', value: '1000Hz (1ms)' },
      { name: 'Form Factor', value: 'Tenkeyless (87 Keys)' }
    ],
    hasVariants: true,
    variants: [
      {
        sku: 'FACEP-GAME-KEYBOARD-01-BLK',
        color: 'Matte Black',
        price: 79.99,
        stock: 65,
        image: '/uploads/categories/product-1.jpg'
      },
      {
        sku: 'FACEP-GAME-KEYBOARD-01-WHT',
        color: 'Glacier White',
        price: 84.99,
        stock: 45,
        image: '/uploads/categories/product-1.jpg'
      }
    ]
  },
  {
    categoryName: 'Gaming & Accessories',
    subcategoryName: 'Gaming Mice',
    name: 'Viper Wireless 26K DPI Ultralight Gaming Mouse',
    sku: 'FACEP-GAME-MOUSE-02',
    brand: 'Apex Gaming',
    productType: 'Gaming Mouse',
    shortDescription:
      'Featherlight 58g ergonomic wireless mouse with 26,000 DPI optical sensor and 80-hour battery.',
    detailedDescription:
      '<p>Glide effortlessly with zero drag. The Viper Wireless features 100% virgin PTFE feet, optical switches with instantaneous actuation, and low-latency 2.4GHz wireless plus Bluetooth 5.2 connectivity.</p>',
    keyFeatures:
      '<ul><li>Ultralight 58-gram honeycomb internal chassis</li><li>PixArt 26K DPI optical sensor with 650 IPS tracking</li><li>Zero-debounce optical mouse switches</li><li>80-hour continuous gaming battery life</li></ul>',
    tags: ['gaming mouse', 'wireless mouse', 'ultralight', 'esports', 'high dpi'],
    condition: Condition.NEW,
    availableColors: ['Black', 'White'],
    thumbnail: '/uploads/categories/product-6.jpg',
    previewImages: ['/uploads/categories/product-6.jpg'],
    basePrice: 49.99,
    oldPrice: 69.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 28,
    dealBadgeText: '28% OFF',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 1,
    maxDeliveryDays: 3,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 95,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 12,
    minOrderQuantity: 1,
    maxOrderQuantity: 4,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone F, Rack 04',
    returnPolicy: '30-Day Free Returns',
    returnTerms: 'Return with USB wireless dongle included.',
    specifications: [
      { name: 'Weight', value: '58 grams' },
      { name: 'Sensor', value: '26,000 DPI Optical' },
      { name: 'Connectivity', value: '2.4GHz Wireless / BT 5.2 / USB-C' }
    ],
    hasVariants: false
  },
  {
    categoryName: 'Gaming & Accessories',
    subcategoryName: 'Gaming Headsets',
    name: 'Immersion 7.1 Surround Sound Wireless Gaming Headset',
    sku: 'FACEP-GAME-HEADSET-03',
    brand: 'Apex Gaming',
    productType: 'Gaming Headset',
    shortDescription:
      'Spatial audio headset with 50mm neodymium drivers and broadcast-quality noise-canceling mic.',
    detailedDescription:
      '<p>Hear footsteps, directional cues, and immersive explosions with pinpoint acoustic precision. Memory foam cooling-gel earcups ensure zero ear fatigue during marathon gaming tournaments.</p>',
    keyFeatures:
      '<ul><li>7.1 Virtual Spatial Surround Sound engine</li><li>Detachable broadcast-grade unidirectional microphone</li><li>Breathable memory foam cooling-gel earpads</li><li>Cross-platform compatible: PC, PS5, Xbox, Switch, Mobile</li></ul>',
    tags: ['headset', 'gaming headset', 'surround sound', 'wireless audio'],
    condition: Condition.NEW,
    availableColors: ['Black/Cyan', 'White/Black'],
    thumbnail: '/uploads/categories/product-7.jpg',
    previewImages: ['/uploads/categories/product-7.jpg'],
    basePrice: 69.99,
    oldPrice: 89.99,
    discountType: DiscountType.FIXED,
    discountValue: 20,
    dealBadgeText: '$20 OFF',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 1,
    maxDeliveryDays: 3,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 80,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 10,
    minOrderQuantity: 1,
    maxOrderQuantity: 3,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone F, Rack 09',
    returnPolicy: '30-Day Money Back Guarantee',
    returnTerms: 'Standard return policy.',
    specifications: [
      { name: 'Driver Size', value: '50mm Neodymium' },
      { name: 'Frequency Range', value: '20Hz - 20,000Hz' },
      { name: 'Battery Life', value: '35 Hours' }
    ],
    hasVariants: false
  },

  // ── 6. Audio & Headphones ──
  {
    categoryName: 'Audio & Headphones',
    subcategoryName: 'Over-Ear Headphones',
    name: 'SoundSphere Pro Hybrid Active Noise-Cancelling Headphones',
    sku: 'FACEP-AUDIO-ANC-01',
    brand: 'SonicPro',
    productType: 'Over-Ear Headphones',
    shortDescription:
      'Audiophile grade hybrid active noise cancellation, Hi-Res wireless audio, and 40-hr battery.',
    detailedDescription:
      '<p>Block out 95% of background engine and office noise with hybrid ANC microphones. Engineered with 40mm custom silk-diaphragm drivers delivering deep bass, natural mids, and pristine highs.</p>',
    keyFeatures:
      '<ul><li>Hybrid active noise cancellation with transparency ambient mode</li><li>Hi-Res Audio certified with LDAC codec support</li><li>Plush protein leather earcups with memory foam</li><li>Fast USB-C charging: 5 minutes gives 4 hours of playback</li></ul>',
    tags: ['headphones', 'anc', 'noise cancelling', 'hi-res', 'wireless audio'],
    condition: Condition.NEW,
    availableColors: ['Midnight Black', 'Silver Moon', 'Rose Gold'],
    thumbnail: '/uploads/categories/product-3.jpg',
    previewImages: ['/uploads/categories/product-3.jpg', '/uploads/categories/product-11.jpg'],
    basePrice: 129.99,
    oldPrice: 179.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 28,
    dealBadgeText: 'Save $50',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 1,
    maxDeliveryDays: 3,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 90,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 10,
    minOrderQuantity: 1,
    maxOrderQuantity: 3,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone G, Shelf 01',
    returnPolicy: '30-Day Risk-Free Trial',
    returnTerms: 'Includes hard carrying case, 3.5mm aux, and charging cable.',
    specifications: [
      { name: 'Battery Life', value: '40h with ANC on / 60h with ANC off' },
      { name: 'Bluetooth', value: '5.3 with Multipoint Dual-Connection' },
      { name: 'Driver', value: '40mm Silk Composite Dynamic Driver' }
    ],
    hasVariants: false
  },
  {
    categoryName: 'Audio & Headphones',
    subcategoryName: 'Wireless Earbuds',
    name: 'AeroPods True Wireless Earbuds with Qi Case',
    sku: 'FACEP-AUDIO-EARBUDS-02',
    brand: 'SonicPro',
    productType: 'Wireless Earbuds',
    shortDescription:
      'Ultra-compact IPX7 waterproof wireless earbuds with environmental noise cancellation for calls.',
    detailedDescription:
      '<p>Weighing only 3.8g per bud, AeroPods fit effortlessly and securely in any ear shape. Enjoy punchy bass with graphene drivers, instant auto-pairing, and clear phone calls with 4 ENC beamforming mics.</p>',
    keyFeatures:
      '<ul><li>IPX7 fully waterproof and sweatproof for workouts and rain</li><li>32 hours total playtime with pocket wireless charging case</li><li>4 ENC microphones for crystal-clear call quality</li><li>Intuitive smart touch controls on both earbuds</li></ul>',
    tags: ['earbuds', 'wireless earbuds', 'bluetooth', 'waterproof', 'gym'],
    condition: Condition.NEW,
    availableColors: ['White', 'Matte Black'],
    thumbnail: '/uploads/categories/product-4.jpg',
    previewImages: ['/uploads/categories/product-4.jpg', '/uploads/categories/product-9.jpg'],
    basePrice: 49.99,
    oldPrice: 69.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 28,
    dealBadgeText: 'Top Pick',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 1,
    maxDeliveryDays: 3,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 160,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 20,
    minOrderQuantity: 1,
    maxOrderQuantity: 5,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone G, Shelf 04',
    returnPolicy: '30-Day Money Back Guarantee',
    returnTerms: 'Include all 3 sizes of silicone eartips.',
    specifications: [
      { name: 'Playtime', value: '8h buds / 32h with charging case' },
      { name: 'Water Resistance', value: 'IPX7 Waterproof' },
      { name: 'Charging', value: 'USB-C + Qi Wireless' }
    ],
    hasVariants: false
  },
  {
    categoryName: 'Audio & Headphones',
    subcategoryName: 'Bluetooth Speakers',
    name: 'Pulse360 Waterproof Portable Bluetooth Speaker 25W',
    sku: 'FACEP-AUDIO-SPEAKER-03',
    brand: 'SonicPro',
    productType: 'Bluetooth Speaker',
    shortDescription:
      '360° omnidirectional stereo sound with dual passive bass radiators and 20-hour battery.',
    detailedDescription:
      '<p>Take the party anywhere from poolside to mountain trails. The Pulse360 is IP67 dustproof and waterproof, features rich 360-degree sound, and supports True Wireless Stereo pairing with a second unit.</p>',
    keyFeatures:
      '<ul><li>25W peak output with dual passive bass radiators</li><li>IP67 waterproof, dustproof, and drop-resistant housing</li><li>Up to 20 hours of continuous music on a single charge</li><li>TWS stereo pairing support to link two units</li></ul>',
    tags: ['speaker', 'bluetooth speaker', 'outdoor sound', 'waterproof', 'portable audio'],
    condition: Condition.NEW,
    availableColors: ['Ocean Blue', 'Charcoal', 'Forest Green'],
    thumbnail: '/uploads/categories/product-2.jpg',
    previewImages: ['/uploads/categories/product-2.jpg'],
    basePrice: 44.99,
    oldPrice: 59.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 25,
    dealBadgeText: '25% OFF',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 115,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 15,
    minOrderQuantity: 1,
    maxOrderQuantity: 4,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone G, Shelf 09',
    returnPolicy: '30-Day Return Policy',
    returnTerms: 'Standard return conditions.',
    specifications: [
      { name: 'Power Output', value: '25 Watts' },
      { name: 'Battery Capacity', value: '5200mAh (20 Hours)' },
      { name: 'Rating', value: 'IP67 Waterproof & Dustproof' }
    ],
    hasVariants: false
  },

  // ── 7. Computers & Laptops ──
  {
    categoryName: 'Computers & Laptops',
    subcategoryName: 'Ultrabooks',
    name: 'ZenithBook 14" Slim Aluminum Ultrabook Intel Core i7',
    sku: 'FACEP-COMP-ULTRABOOK-01',
    brand: 'Zenith Tech',
    productType: 'Ultrabook Laptop',
    shortDescription:
      'Featherlight 2.6 lbs laptop with Intel Core i7, 16GB LPDDR5 RAM, and 1TB NVMe SSD.',
    detailedDescription:
      '<p>The ultimate thin-and-light laptop for professionals, creators, and students. Features a stunning 2.8K OLED display, all-day 14-hour battery life, backlit keyboard, and Thunderbolt 4 ports inside a rigid unibody aluminum chassis.</p>',
    keyFeatures:
      '<ul><li>14-inch 2.8K 90Hz OLED 100% DCI-P3 display</li><li>Intel Core i7-1360P 12-core processor</li><li>16GB LPDDR5 5200MHz RAM & 1TB Gen4 NVMe SSD</li><li>14-hour battery with 65W fast USB-C Power Delivery charger</li></ul>',
    tags: ['laptop', 'ultrabook', 'intel i7', 'oled', 'portable computer'],
    condition: Condition.NEW,
    availableColors: ['Space Gray', 'Silver'],
    thumbnail: '/uploads/categories/product-1.jpg',
    previewImages: ['/uploads/categories/product-1.jpg', '/uploads/categories/product-10.jpg'],
    basePrice: 849.99,
    oldPrice: 1099.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 23,
    dealBadgeText: 'Save $250',
    shipsFrom: 'East Coast Warehouse, PA',
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: false,
    deliveryExpress: true,
    stockQuantity: 30,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 5,
    minOrderQuantity: 1,
    maxOrderQuantity: 2,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'High-Value Vault, Room 1',
    returnPolicy: '15-Day Return Period',
    returnTerms: 'Laptop must be factory reset with original packaging and charger.',
    specifications: [
      { name: 'Processor', value: 'Intel Core i7-1360P (12 Cores, up to 5.0 GHz)' },
      { name: 'Memory', value: '16GB LPDDR5 5200MHz' },
      { name: 'Storage', value: '1TB M.2 PCIe 4.0 NVMe SSD' },
      { name: 'Weight', value: '2.64 lbs (1.2 kg)' }
    ],
    hasVariants: false
  },
  {
    categoryName: 'Computers & Laptops',
    subcategoryName: 'Mini PCs',
    name: 'ProDesk Mini PC AMD Ryzen 7 32GB RAM 1TB SSD',
    sku: 'FACEP-COMP-MINIPC-02',
    brand: 'Zenith Tech',
    productType: 'Mini Desktop PC',
    shortDescription:
      'Palm-sized powerhouse mini desktop supporting triple 4K monitors and WiFi 6E.',
    detailedDescription:
      '<p>Pack colossal desktop productivity into the palm of your hand. Powered by an 8-core AMD Ryzen 7 processor and Radeon 680M graphics, it effortlessly handles 4K video editing, multitasking, and office productivity.</p>',
    keyFeatures:
      '<ul><li>AMD Ryzen 7 7735HS (8 Cores, 16 Threads, up to 4.75GHz)</li><li>32GB DDR5 dual-channel RAM & 1TB PCIe 4.0 SSD</li><li>Triple display output: 2x HDMI 2.1 + 1x USB-C 4.0</li><li>Silent copper dual-fan thermal cooling</li></ul>',
    tags: ['mini pc', 'desktop', 'ryzen 7', 'compact computer', 'workstation'],
    condition: Condition.NEW,
    availableColors: ['Gunmetal Black'],
    thumbnail: '/uploads/categories/product-10.jpg',
    previewImages: ['/uploads/categories/product-10.jpg'],
    basePrice: 469.99,
    oldPrice: 589.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 20,
    dealBadgeText: '20% OFF',
    shipsFrom: 'East Coast Warehouse, PA',
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: false,
    deliveryExpress: true,
    stockQuantity: 45,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 6,
    minOrderQuantity: 1,
    maxOrderQuantity: 3,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'High-Value Vault, Room 1',
    returnPolicy: '30-Day Money Back Guarantee',
    returnTerms: 'Standard conditions apply.',
    specifications: [
      { name: 'CPU', value: 'AMD Ryzen 7 7735HS' },
      { name: 'RAM', value: '32GB DDR5 4800MHz' },
      { name: 'SSD', value: '1TB M.2 PCIe Gen4' },
      { name: 'Networking', value: 'WiFi 6E + Bluetooth 5.2 + 2.5G LAN' }
    ],
    hasVariants: false
  },
  {
    categoryName: 'Computers & Laptops',
    subcategoryName: 'Desktop PCs',
    name: 'Horizon Tower Gaming Desktop PC RTX 4070',
    sku: 'FACEP-COMP-DESKTOP-03',
    brand: 'Zenith Tech',
    productType: 'Gaming Desktop',
    shortDescription:
      'High-performance gaming rig with Intel Core i7-14700F, RTX 4070 12GB, and ARGB liquid cooling.',
    detailedDescription:
      '<p>Experience blistering 1440p and 4K gaming with ray tracing and DLSS 3. Built inside a panoramic tempered glass chassis with optimized high-airflow cooling and liquid AIO CPU cooler.</p>',
    keyFeatures:
      '<ul><li>NVIDIA GeForce RTX 4070 12GB GDDR6X</li><li>Intel Core i7-14700F 20-core processor</li><li>32GB DDR5 6000MHz RGB Gaming RAM</li><li>2TB Gen4 NVMe M.2 SSD</li></ul>',
    tags: ['gaming pc', 'desktop', 'rtx 4070', 'intel i7', 'esports rig'],
    condition: Condition.NEW,
    availableColors: ['Arctic White', 'Shadow Black'],
    thumbnail: '/uploads/categories/product-1.jpg',
    previewImages: ['/uploads/categories/product-1.jpg'],
    basePrice: 1499.99,
    oldPrice: 1799.99,
    discountType: DiscountType.FIXED,
    discountValue: 300,
    dealBadgeText: '$300 OFF',
    shipsFrom: 'East Coast Warehouse, PA',
    minDeliveryDays: 2,
    maxDeliveryDays: 5,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: false,
    deliveryExpress: false,
    stockQuantity: 20,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 3,
    minOrderQuantity: 1,
    maxOrderQuantity: 1,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'High-Value Vault, Room 2',
    returnPolicy: '15-Day Free Return Policy',
    returnTerms: 'Requires original box and anti-static padding.',
    specifications: [
      { name: 'Graphics', value: 'NVIDIA GeForce RTX 4070 12GB' },
      { name: 'Power Supply', value: '750W 80+ Gold Fully Modular' },
      { name: 'Cooling', value: '240mm ARGB Liquid CPU Cooler' }
    ],
    hasVariants: false
  },

  // ── 8. Wearable Technology ──
  {
    categoryName: 'Wearable Technology',
    subcategoryName: 'Smartwatches',
    name: 'Chronos Smartwatch with 1.43" AMOLED Display',
    sku: 'FACEP-WEAR-WATCH-01',
    brand: 'ZenFit',
    productType: 'Smartwatch',
    shortDescription:
      'Stainless steel bezel smartwatch with Bluetooth calling, SpO2, heart rate, and 12-day battery.',
    detailedDescription:
      '<p>A refined blend of classic watch craftsmanship and cutting-edge health tracking. Features an always-on AMOLED touchscreen, 100+ workout modes, continuous sleep analysis, and water resistance up to 50 meters.</p>',
    keyFeatures:
      '<ul><li>1.43" HD AMOLED Always-On Touchscreen (466x466)</li><li>Built-in mic and speaker for Bluetooth phone calls</li><li>24/7 Heart rate, blood oxygen (SpO2), and stress monitoring</li><li>5ATM (50 meters) water resistance for swimming</li></ul>',
    tags: ['smartwatch', 'fitness watch', 'wearable', 'health tracker', 'amoled'],
    condition: Condition.NEW,
    availableColors: ['Midnight Black', 'Classic Silver', 'Rose Gold'],
    thumbnail: '/uploads/categories/product-15.jpg',
    previewImages: ['/uploads/categories/product-15.jpg', '/uploads/categories/product-4.jpg'],
    basePrice: 89.99,
    oldPrice: 129.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 30,
    dealBadgeText: '30% OFF',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 1,
    maxDeliveryDays: 3,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 110,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 12,
    minOrderQuantity: 1,
    maxOrderQuantity: 4,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone H, Shelf 01',
    returnPolicy: '30-Day Free Returns',
    returnTerms: 'Standard return conditions.',
    specifications: [
      { name: 'Display', value: '1.43" AMOLED 466 x 466' },
      { name: 'Battery Life', value: 'Up to 12 Days Normal Usage' },
      { name: 'Water Resistance', value: '5ATM (50 Meters)' }
    ],
    hasVariants: false
  },
  {
    categoryName: 'Wearable Technology',
    subcategoryName: 'Smart Rings',
    name: 'AuraRing Titanium Health & Sleep Tracker Smart Ring',
    sku: 'FACEP-WEAR-RING-02',
    brand: 'ZenFit',
    productType: 'Smart Ring',
    shortDescription:
      'Ultra-lightweight aerospace titanium smart ring tracking sleep stages, recovery, and HRV.',
    detailedDescription:
      '<p>Health tracking without the screen distraction. The AuraRing weighs under 3 grams, monitors your body temperature, resting heart rate, and sleep readiness, syncing seamlessly to iOS and Android with zero subscription fees.</p>',
    keyFeatures:
      '<ul><li>Aerospace-grade titanium shell with non-allergenic medical resin lining</li><li>Tracks sleep cycles (Deep, REM, Light), skin temperature, and HRV</li><li>7-day battery life per fast magnetic charge</li><li>100-meter waterproof rating (safe for saunas and diving)</li></ul>',
    tags: ['smart ring', 'health tracker', 'sleep tracking', 'titanium', 'wearables'],
    condition: Condition.NEW,
    availableColors: ['Matte Black', 'Brushed Titanium', 'Gold'],
    thumbnail: '/uploads/categories/product-4.jpg',
    previewImages: ['/uploads/categories/product-4.jpg'],
    basePrice: 149.99,
    oldPrice: 199.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 25,
    dealBadgeText: 'Trending',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 1,
    maxDeliveryDays: 3,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: false,
    deliveryExpress: true,
    stockQuantity: 65,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 8,
    minOrderQuantity: 1,
    maxOrderQuantity: 2,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone H, Shelf 05',
    returnPolicy: '30-Day Sizing Guarantee',
    returnTerms: 'Free size exchange within 30 days.',
    specifications: [
      { name: 'Weight', value: '2.8 grams' },
      { name: 'Battery', value: 'Up to 7 Days' },
      { name: 'Material', value: 'Aerospace Grade Titanium' }
    ],
    hasVariants: false
  },
  {
    categoryName: 'Wearable Technology',
    subcategoryName: 'Watch Bands',
    name: 'Milanese Loop Stainless Steel Mesh Magnetic Watch Strap',
    sku: 'FACEP-WEAR-BAND-03',
    brand: 'ZenFit',
    productType: 'Watch Band',
    shortDescription:
      'Breathable woven stainless steel mesh band with infinitely adjustable strong magnetic clasp.',
    detailedDescription:
      '<p>Give your smartwatch an immediate executive upgrade. Crafted from woven 316L stainless steel, this Milanese loop wraps gracefully around the wrist and secures with a high-strength neodymium magnet.</p>',
    keyFeatures:
      '<ul><li>Woven premium 316L stainless steel mesh</li><li>Infinitely adjustable magnetic closure</li><li>Sweatproof, breathable, and snag-resistant</li><li>Quick-release 20mm and 22mm pin installation</li></ul>',
    tags: ['watch band', 'strap', 'milanese loop', 'stainless steel', 'watch accessory'],
    condition: Condition.NEW,
    availableColors: ['Silver', 'Black', 'Starlight Gold'],
    thumbnail: '/uploads/categories/product-15.jpg',
    previewImages: ['/uploads/categories/product-15.jpg'],
    basePrice: 19.99,
    oldPrice: 29.99,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 33,
    dealBadgeText: 'Best Value',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 1,
    maxDeliveryDays: 3,
    shippingFeeType: ShippingFeeType.STANDARD,
    shippingCost: 3.99,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: false,
    stockQuantity: 180,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 20,
    minOrderQuantity: 1,
    maxOrderQuantity: 5,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone H, Shelf 11',
    returnPolicy: '30-Day Free Returns',
    returnTerms: 'Standard return conditions apply.',
    specifications: [
      { name: 'Material', value: '316L Stainless Steel' },
      { name: 'Width', value: '20mm / 22mm Universal Quick-Release' }
    ],
    hasVariants: false
  },

  // ── 9. Men's Fashion ──
  {
    categoryName: "Men's Fashion",
    subcategoryName: 'Formal Shirts',
    name: 'Executive Slim-Fit Non-Iron 100% Cotton Dress Shirt',
    sku: 'FACEP-MEN-SHIRT-01',
    brand: 'Sartorial London',
    productType: 'Formal Dress Shirt',
    shortDescription:
      'Tailored non-iron 80-ply Supima cotton formal shirt with spread collar and French cuffs.',
    detailedDescription:
      '<p>Stay crisp and wrinkle-free from your morning boardroom presentation to evening dinners. Crafted from 100% two-ply long-staple Supima cotton with taped seams to prevent puckering after washing.</p>',
    keyFeatures:
      '<ul><li>100% long-staple Supima cotton with wrinkle-free technology</li><li>Reinforced semi-spread collar with removable brass stays</li><li>Slim modern cut through chest and waist</li><li>Durable mother-of-pearl buttons</li></ul>',
    tags: ['shirt', 'formal shirt', 'dress shirt', 'menswear', 'cotton'],
    condition: Condition.NEW,
    availableColors: ['Crisp White', 'Sky Blue', 'Light Pink'],
    thumbnail: '/uploads/categories/product-7.jpg',
    previewImages: ['/uploads/categories/product-7.jpg'],
    basePrice: 44.99,
    oldPrice: 65.0,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 30,
    dealBadgeText: '30% OFF',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 100,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 15,
    minOrderQuantity: 1,
    maxOrderQuantity: 5,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone I, Rack 02',
    returnPolicy: '30-Day Hassle-Free Returns',
    returnTerms: 'Must be unworn and unwashed with original tags attached.',
    specifications: [
      { name: 'Fabric', value: '100% Two-Ply Supima Cotton' },
      { name: 'Fit', value: 'Modern Slim Fit' },
      { name: 'Care', value: 'Machine Wash Warm, Tumble Dry Low' }
    ],
    hasVariants: true,
    variants: [
      {
        sku: 'FACEP-MEN-SHIRT-01-WHT-M',
        color: 'Crisp White',
        size: 'M',
        price: 44.99,
        stock: 40,
        image: '/uploads/categories/product-7.jpg'
      },
      {
        sku: 'FACEP-MEN-SHIRT-01-WHT-L',
        color: 'Crisp White',
        size: 'L',
        price: 44.99,
        stock: 35,
        image: '/uploads/categories/product-7.jpg'
      },
      {
        sku: 'FACEP-MEN-SHIRT-01-BLU-M',
        color: 'Sky Blue',
        size: 'M',
        price: 44.99,
        stock: 25,
        image: '/uploads/categories/product-7.jpg'
      }
    ]
  },
  {
    categoryName: "Men's Fashion",
    subcategoryName: 'Casual T-Shirts',
    name: 'Heavyweight Vintage Washed Crewneck T-Shirt (3-Pack)',
    sku: 'FACEP-MEN-TSHIRT-02',
    brand: 'Urban Thread',
    productType: 'Casual T-Shirt',
    shortDescription:
      'Thick 240 GSM combed cotton vintage garment-dyed boxy fit crewneck t-shirts.',
    detailedDescription:
      '<p>The quintessential heavy tee built to last for years. Featuring dense 240 GSM combed ring-spun cotton that holds its shape, pre-shrunk fabric, and a ribbed collar that never sags.</p>',
    keyFeatures:
      '<ul><li>Heavyweight 240 GSM 100% combed ring-spun cotton</li><li>Garment-dyed for subtle vintage lived-in look and feel</li><li>Double-stitched reinforced collar and hems</li><li>Includes 3 complementary neutral colors in every pack</li></ul>',
    tags: ['tshirt', 'heavyweight tee', 'casual', 'mens fashion', 'cotton tee'],
    condition: Condition.NEW,
    availableColors: ['Neutral Tri-Pack (Black/Charcoal/Washed Olive)'],
    thumbnail: '/uploads/categories/product-7.jpg',
    previewImages: ['/uploads/categories/product-7.jpg'],
    basePrice: 34.99,
    oldPrice: 48.0,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 27,
    dealBadgeText: 'Value 3-Pack',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 120,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 15,
    minOrderQuantity: 1,
    maxOrderQuantity: 6,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone I, Rack 07',
    returnPolicy: '30-Day Return Guarantee',
    returnTerms: 'Pack must be returned with all 3 shirts.',
    specifications: [
      { name: 'Weight', value: '240 GSM Heavyweight' },
      { name: 'Material', value: '100% Combed Cotton' }
    ],
    hasVariants: false
  },
  {
    categoryName: "Men's Fashion",
    subcategoryName: 'Trousers & Chinos',
    name: 'Everyday 4-Way Stretch Slim Chino Trousers',
    sku: 'FACEP-MEN-CHINO-03',
    brand: 'Sartorial London',
    productType: 'Chino Trousers',
    shortDescription:
      'Smart-casual chino pants featuring 4-way performance stretch and spill-resistant coating.',
    detailedDescription:
      '<p>The comfort of sweatpants disguised as polished business casual trousers. Breathable cotton twill blended with elastane allows boundless freedom of movement while maintaining a clean silhouette.</p>',
    keyFeatures:
      '<ul><li>97% long-staple cotton twill with 3% elastane stretch</li><li>Subtle hidden zippered security pocket in right pocket</li><li>Water and stain repellent surface finish</li><li>Flexible expandable comfort waistband</li></ul>',
    tags: ['chinos', 'pants', 'trousers', 'business casual', 'stretch'],
    condition: Condition.NEW,
    availableColors: ['Classic Khaki', 'Midnight Navy', 'Charcoal Grey'],
    thumbnail: '/uploads/categories/product-7.jpg',
    previewImages: ['/uploads/categories/product-7.jpg'],
    basePrice: 48.0,
    oldPrice: 65.0,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 26,
    dealBadgeText: 'Best Seller',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 90,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 10,
    minOrderQuantity: 1,
    maxOrderQuantity: 4,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone I, Rack 14',
    returnPolicy: '30-Day Free Exchanges',
    returnTerms: 'Must have tags attached and unhemmed cuffs.',
    specifications: [
      { name: 'Material', value: '97% Cotton, 3% Spandex' },
      { name: 'Inseam', value: '32 Inches' }
    ],
    hasVariants: false
  },

  // ── 10. Women's Fashion ──
  {
    categoryName: "Women's Fashion",
    subcategoryName: 'Party Dresses',
    name: 'Satin Pleated Midi Cocktail Party Dress',
    sku: 'FACEP-WOMEN-DRESS-01',
    brand: 'Elegance Paris',
    productType: 'Cocktail Dress',
    shortDescription:
      'Luxurious cowl-neck silky satin midi dress with side slit and adjustable criss-cross straps.',
    detailedDescription:
      '<p>Drape yourself in effortless glamour. This lustrous satin midi dress features an alluring cowl neckline, delicate criss-cross back ties for a bespoke fit, and a flowing pleated A-line skirt with a tasteful side slit.</p>',
    keyFeatures:
      '<ul><li>Ultra-soft premium heavyweight polyester satin</li><li>Adjustable lace-up back for custom bust fit</li><li>Lined bust with non-slip silicone hem</li><li>Flattering bias-cut midi silhouette</li></ul>',
    tags: ['party dress', 'cocktail dress', 'satin dress', 'evening wear', 'midi dress'],
    condition: Condition.NEW,
    availableColors: ['Emerald Green', 'Champagne Gold', 'Ruby Red'],
    thumbnail: '/uploads/categories/product-9.jpg',
    previewImages: ['/uploads/categories/product-9.jpg'],
    basePrice: 68.0,
    oldPrice: 95.0,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 28,
    dealBadgeText: 'Trending Now',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 80,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 10,
    minOrderQuantity: 1,
    maxOrderQuantity: 3,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone J, Rack 03',
    returnPolicy: '30-Day Hassle-Free Returns',
    returnTerms: 'Must be unworn, undamaged, with intact security ribbon.',
    specifications: [
      { name: 'Length', value: 'Midi (46" from shoulder)' },
      { name: 'Fabric', value: '100% High-Density Polyester Satin' },
      { name: 'Care', value: 'Dry Clean or Gentle Hand Wash Cold' }
    ],
    hasVariants: true,
    variants: [
      {
        sku: 'FACEP-WOMEN-DRESS-01-EM-S',
        color: 'Emerald Green',
        size: 'S',
        price: 68.0,
        stock: 30,
        image: '/uploads/categories/product-9.jpg'
      },
      {
        sku: 'FACEP-WOMEN-DRESS-01-EM-M',
        color: 'Emerald Green',
        size: 'M',
        price: 68.0,
        stock: 30,
        image: '/uploads/categories/product-9.jpg'
      },
      {
        sku: 'FACEP-WOMEN-DRESS-01-CH-S',
        color: 'Champagne Gold',
        size: 'S',
        price: 68.0,
        stock: 20,
        image: '/uploads/categories/product-9.jpg'
      }
    ]
  },
  {
    categoryName: "Women's Fashion",
    subcategoryName: 'Summer Dresses',
    name: 'Bohemian Tiered Ruffle Floral Summer Sundress',
    sku: 'FACEP-WOMEN-SUMMER-02',
    brand: 'Elegance Paris',
    productType: 'Summer Sundress',
    shortDescription:
      'Breezy lightweight tiered cotton sundress with smocked bodice and adjustable tie shoulders.',
    detailedDescription:
      '<p>The ultimate warm-weather staple. Made from breathable 100% cotton with a stretchy smocked elastic bodice that adapts comfortably to your silhouette and a floating tiered ruffle skirt.</p>',
    keyFeatures:
      '<ul><li>100% breathable organic woven cotton</li><li>Stretchy smocked bodice fits diverse bust sizes</li><li>Side seam functional deep pockets</li><li>Flowy tiered ruffle hem</li></ul>',
    tags: ['summer dress', 'sundress', 'floral', 'boho', 'vacation'],
    condition: Condition.NEW,
    availableColors: ['Sunlit Marigold', 'Pastel Sage', 'Sky Blue Floral'],
    thumbnail: '/uploads/categories/product-9.jpg',
    previewImages: ['/uploads/categories/product-9.jpg'],
    basePrice: 38.99,
    oldPrice: 52.0,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 25,
    dealBadgeText: '25% OFF',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 110,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 15,
    minOrderQuantity: 1,
    maxOrderQuantity: 4,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone J, Rack 08',
    returnPolicy: '30-Day Return Policy',
    returnTerms: 'Tags must remain intact.',
    specifications: [
      { name: 'Material', value: '100% Breathable Woven Cotton' },
      { name: 'Pockets', value: 'Two Deep Side Pockets' }
    ],
    hasVariants: false
  },
  {
    categoryName: "Women's Fashion",
    subcategoryName: 'Tops & Blouses',
    name: 'Classic Silk-Touch Button-Down French Blouse',
    sku: 'FACEP-WOMEN-TOP-03',
    brand: 'Elegance Paris',
    productType: 'Blouse',
    shortDescription:
      'Elegant silky satin collared blouse with French cuffs and mother-of-pearl buttons.',
    detailedDescription:
      '<p>A timeless wardrobe essential that transitions seamlessly from office tailoring to evening dinner. Crafted from silky modal crepe with a relaxed drape and elegant curved hemline.</p>',
    keyFeatures:
      '<ul><li>Silky modal crepe with subtle pearl luster</li><li>Concealed front button placket for clean minimalist styling</li><li>Curved shirttail hem for easy tucking or untucked flow</li><li>Anti-static and wrinkle-resistant fabric</li></ul>',
    tags: ['blouse', 'workwear', 'silk blouse', 'office fashion', 'tops'],
    condition: Condition.NEW,
    availableColors: ['Ivory White', 'Dusty Rose', 'Midnight Black'],
    thumbnail: '/uploads/categories/product-9.jpg',
    previewImages: ['/uploads/categories/product-9.jpg'],
    basePrice: 42.0,
    oldPrice: 58.0,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 27,
    dealBadgeText: 'Workwear Essential',
    shipsFrom: 'Central Fulfillment Hub, NJ',
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
    shippingFeeType: ShippingFeeType.FREE,
    shippingCost: 0,
    deliveryStandard: true,
    deliveryCod: true,
    deliveryExpress: true,
    stockQuantity: 95,
    stockStatus: StockStatus.AVAILABLE,
    lowStockAlertQuantity: 12,
    minOrderQuantity: 1,
    maxOrderQuantity: 5,
    inventoryManagedBy: 'Facep Direct',
    warehouseLocation: 'Zone J, Rack 12',
    returnPolicy: '30-Day Free Returns',
    returnTerms: 'Standard return policy applies.',
    specifications: [
      { name: 'Material', value: 'Silky Modal Crepe' },
      { name: 'Collar', value: 'Structured Spread Collar' }
    ],
    hasVariants: false
  }
];

const slugify = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

async function seedProducts() {
  logger.info(`Starting product seed for ${PRODUCTS_DATA.length} products across 10 categories...`);

  let seededCount = 0;

  for (const item of PRODUCTS_DATA) {
    // 1. Find category
    const category = await prisma.category.findUnique({
      where: { name: item.categoryName },
      include: { subcategories: true }
    });

    if (!category) {
      logger.warn(`Category "${item.categoryName}" not found. Skipping product "${item.name}".`);
      continue;
    }

    // 2. Find matching subcategory
    let subcategoryId: string | null = null;
    const subcategory = category.subcategories.find(
      (sub) => sub.name.toLowerCase() === item.subcategoryName.toLowerCase()
    );
    if (subcategory) {
      subcategoryId = subcategory.id;
    } else if (category.subcategories.length > 0) {
      subcategoryId = category.subcategories[0].id;
    }

    const slug = slugify(item.name);

    const productPayload = {
      name: item.name,
      slug,
      sku: item.sku,
      brand: item.brand,
      productType: item.productType,
      shortDescription: item.shortDescription,
      detailedDescription: item.detailedDescription,
      keyFeatures: item.keyFeatures,
      categoryId: category.id,
      subcategoryId,
      tags: item.tags,
      condition: item.condition ?? Condition.NEW,
      availableColors: item.availableColors,
      thumbnail: item.thumbnail,
      previewImages: item.previewImages,
      basePrice: item.basePrice,
      oldPrice: item.oldPrice ?? null,
      discountType: item.discountType ?? null,
      discountValue: item.discountValue ?? null,
      dealBadgeText: item.dealBadgeText ?? null,
      shipsFrom: item.shipsFrom,
      minDeliveryDays: item.minDeliveryDays,
      maxDeliveryDays: item.maxDeliveryDays,
      shippingFeeType: item.shippingFeeType ?? ShippingFeeType.FREE,
      shippingCost: item.shippingCost ?? null,
      deliveryStandard: item.deliveryStandard,
      deliveryCod: item.deliveryCod,
      deliveryExpress: item.deliveryExpress,
      stockQuantity: item.stockQuantity,
      stockStatus: item.stockStatus ?? StockStatus.AVAILABLE,
      lowStockAlertQuantity: item.lowStockAlertQuantity,
      minOrderQuantity: item.minOrderQuantity,
      maxOrderQuantity: item.maxOrderQuantity,
      inventoryManagedBy: item.inventoryManagedBy,
      warehouseLocation: item.warehouseLocation,
      returnPolicy: item.returnPolicy,
      returnTerms: item.returnTerms,
      hasVariants: item.hasVariants
    };

    // Upsert product and manage specifications & variants cleanly
    const existing = await prisma.product.findUnique({
      where: { sku: item.sku }
    });

    if (existing) {
      // Clean up previous specifications and variants to avoid duplicate rows
      await prisma.productSpecification.deleteMany({ where: { productId: existing.id } });
      await prisma.productVariant.deleteMany({ where: { productId: existing.id } });

      await prisma.product.update({
        where: { id: existing.id },
        data: {
          ...productPayload,
          specifications: {
            create: item.specifications
          },
          variants:
            item.hasVariants && item.variants
              ? {
                  create: item.variants.map((v) => ({
                    sku: v.sku,
                    price: v.price,
                    stock: v.stock,
                    color: v.color ?? null,
                    size: v.size ?? null,
                    storage: v.storage ?? null,
                    image: v.image ?? null
                  }))
                }
              : undefined
        }
      });
    } else {
      await prisma.product.create({
        data: {
          ...productPayload,
          specifications: {
            create: item.specifications
          },
          variants:
            item.hasVariants && item.variants
              ? {
                  create: item.variants.map((v) => ({
                    sku: v.sku,
                    price: v.price,
                    stock: v.stock,
                    color: v.color ?? null,
                    size: v.size ?? null,
                    storage: v.storage ?? null,
                    image: v.image ?? null
                  }))
                }
              : undefined
        }
      });
    }

    seededCount++;
  }

  logger.info(`Successfully seeded ${seededCount} products across 10 categories!`);
}

seedProducts()
  .catch((err) => {
    logger.error('Error during product seeding:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
