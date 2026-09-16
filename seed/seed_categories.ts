import { logger } from '../src/app/utils/logger';
import prisma from '../src/app/utils/prisma';

interface SeedCategory {
  name: string;
  imageUrl: string;
  isActive?: boolean;
  subcategories: string[];
}

const CATEGORIES_DATA: SeedCategory[] = [
  // ── 1. Home, Lighting & Living ──
  {
    name: 'Lighting Solutions',
    imageUrl: '/uploads/categories/product-2.jpg',
    subcategories: [
      'Chandeliers',
      'String Lights',
      'Lamps & Shades',
      'Pendant Lighting',
      'Track Lights',
      'Wall Sconces'
    ]
  },
  {
    name: 'Home Decor',
    imageUrl: '/uploads/categories/banner.png',
    subcategories: [
      'Vases & Vessels',
      'Wall Art & Paintings',
      'Photo Frames',
      'Showpieces & Sculptures',
      'Clocks',
      'Candles & Holders'
    ]
  },
  {
    name: 'Smart Home & Lighting',
    imageUrl: '/uploads/categories/product-2.jpg',
    subcategories: [
      'Smart Bulbs',
      'Smart Plugs',
      'Smart Sensors',
      'Home Security Cameras',
      'Smart Hubs',
      'Video Doorbells'
    ]
  },
  {
    name: 'Home Appliances',
    imageUrl: '/uploads/categories/banner.png',
    subcategories: [
      'Ceiling Fans',
      'Air Conditioners',
      'Vacuum Cleaners',
      'Air Purifiers',
      'Heaters',
      'Dehumidifiers'
    ]
  },
  {
    name: 'Living Room Furniture',
    imageUrl: '/uploads/categories/banner.png',
    subcategories: [
      'Sofas & Couches',
      'Coffee Tables',
      'TV Units & Consoles',
      'Recliners',
      'Accent Chairs'
    ]
  },
  {
    name: 'Bedroom Furniture & Bedding',
    imageUrl: '/uploads/categories/banner.png',
    subcategories: [
      'Beds & Frames',
      'Mattresses',
      'Pillows & Cases',
      'Bed Sheets',
      'Comforters & Quilts',
      'Nightstands'
    ]
  },
  {
    name: 'Kitchen Appliances',
    imageUrl: '/uploads/categories/banner.png',
    subcategories: [
      'Cookware Sets',
      'Small Appliances',
      'Blenders & Juicers',
      'Coffee Makers',
      'Microwaves & Ovens',
      'Dinnerware'
    ]
  },
  {
    name: 'Kitchenware & Utensils',
    imageUrl: '/uploads/categories/product-5.jpg',
    subcategories: [
      'Knives & Cutlery',
      'Food Storage',
      'Cutting Boards',
      'Cooking Utensils',
      'Baking Dishes'
    ]
  },
  {
    name: 'Bathroom & Sanitary',
    imageUrl: '/uploads/categories/product-14.jpg',
    subcategories: [
      'Shower Heads',
      'Faucets & Taps',
      'Bath Towels',
      'Bath Mats',
      'Vanities & Mirrors'
    ]
  },
  {
    name: 'Storage & Organization',
    imageUrl: '/uploads/categories/product-10.jpg',
    subcategories: [
      'Closet Organizers',
      'Shoe Racks',
      'Storage Bins & Boxes',
      'Under-Cabinet Racks',
      'Shelving Units'
    ]
  },

  // ── 2. Electronics, Computers & Gaming ──
  {
    name: 'Gaming & Accessories',
    imageUrl: '/uploads/categories/product-1.jpg',
    subcategories: [
      'Gaming Keyboards',
      'Gaming Mice',
      'Gaming Headsets',
      'Controllers & Gamepads',
      'Gaming Monitors',
      'Capture Cards'
    ]
  },
  {
    name: 'Gaming Hardware & Chairs',
    imageUrl: '/uploads/categories/product-1.jpg',
    subcategories: [
      'Gaming Chairs',
      'Gaming Desks',
      'Graphics Cards',
      'Mechanical Keyboards',
      'PC Cases'
    ]
  },
  {
    name: 'Audio & Headphones',
    imageUrl: '/uploads/categories/product-3.jpg',
    subcategories: [
      'Over-Ear Headphones',
      'Wireless Earbuds',
      'Bluetooth Speakers',
      'Soundbars',
      'Noise-Cancelling Headsets'
    ]
  },
  {
    name: 'Computers & Laptops',
    imageUrl: '/uploads/categories/product-1.jpg',
    subcategories: ['Ultrabooks', 'Gaming Laptops', 'Desktop PCs', 'Mini PCs', 'Workstations']
  },
  {
    name: 'Computer Peripherals',
    imageUrl: '/uploads/categories/product-6.jpg',
    subcategories: [
      'Wireless Mice',
      'Keyboards',
      'External Webcams',
      'USB Hubs & Docks',
      'Mouse Pads'
    ]
  },
  {
    name: 'Monitors & Displays',
    imageUrl: '/uploads/categories/product-10.jpg',
    subcategories: [
      '4K Monitors',
      'Curved Monitors',
      'Ultrawide Displays',
      'Monitor Arms & Mounts',
      'Portable Monitors'
    ]
  },
  {
    name: 'Smartphones & Tablets',
    imageUrl: '/uploads/categories/product-14.jpg',
    subcategories: ['Flagship Smartphones', 'Budget Phones', 'Tablets', 'E-Readers', 'Stylus Pens']
  },
  {
    name: 'Mobile Accessories',
    imageUrl: '/uploads/categories/product-13.jpg',
    subcategories: [
      'Phone Cases',
      'Screen Protectors',
      'Fast Chargers',
      'Power Banks',
      'Wireless Chargers',
      'Car Mounts'
    ]
  },
  {
    name: 'Wearable Technology',
    imageUrl: '/uploads/categories/product-4.jpg',
    subcategories: [
      'Smartwatches',
      'Fitness Trackers',
      'Smart Rings',
      'Watch Bands',
      'Charging Docks'
    ]
  },
  {
    name: 'Cameras & Photography',
    imageUrl: '/uploads/categories/product-8.jpg',
    subcategories: [
      'Mirrorless Cameras',
      'DSLR Cameras',
      'Action Cameras',
      'Camera Lenses',
      'Tripods & Gimbals'
    ]
  },

  // ── 3. Fashion & Apparel ──
  {
    name: "Men's Fashion",
    imageUrl: '/uploads/categories/product-7.jpg',
    subcategories: [
      'Formal Shirts',
      'Casual T-Shirts',
      'Trousers & Chinos',
      'Suits & Blazers',
      'Jeans',
      'Polo Shirts'
    ]
  },
  {
    name: "Women's Fashion",
    imageUrl: '/uploads/categories/product-9.jpg',
    subcategories: [
      'Formal Dresses',
      'Casual Dresses',
      'Party Dresses',
      'Summer Dresses',
      'Tops & Blouses',
      'Skirts'
    ]
  },
  {
    name: "Men's Footwear",
    imageUrl: '/uploads/categories/product-11.jpg',
    subcategories: [
      'Running Shoes',
      'Sneakers',
      'Leather Loafers',
      'Formal Oxfords',
      'Boots',
      'Sandals'
    ]
  },
  {
    name: "Women's Footwear",
    imageUrl: '/uploads/categories/product-12.jpg',
    subcategories: ['High Heels', 'Flats & Loafers', 'Sneakers', 'Ankle Boots', 'Wedges & Sandals']
  },
  {
    name: 'Watches & Timepieces',
    imageUrl: '/uploads/categories/product-15.jpg',
    subcategories: [
      'Luxury Chronographs',
      'Automatic Watches',
      'Minimalist Watches',
      'Digital Sports Watches',
      'Dress Watches'
    ]
  },
  {
    name: 'Bags & Luggage',
    imageUrl: '/uploads/categories/product-13.jpg',
    subcategories: [
      'Backpacks',
      'Tote Bags',
      'Suitcases & Trolleys',
      'Messenger Bags',
      'Duffel Bags'
    ]
  },
  {
    name: "Men's Accessories",
    imageUrl: '/uploads/categories/product-14.jpg',
    subcategories: [
      'Leather Belts',
      'Silk Ties',
      'Wallets & Cardholders',
      'Sunglasses',
      'Cufflinks'
    ]
  },
  {
    name: "Women's Accessories",
    imageUrl: '/uploads/categories/product-9.jpg',
    subcategories: [
      'Handbags',
      'Scarves & Shawls',
      'Fashion Sunglasses',
      'Wallets',
      'Hair Accessories'
    ]
  },
  {
    name: 'Jewelry & Fine Accessories',
    imageUrl: '/uploads/categories/product-15.jpg',
    subcategories: [
      'Necklaces & Pendants',
      'Earrings',
      'Bracelets & Bangles',
      'Rings',
      'Jewelry Boxes'
    ]
  },
  {
    name: 'Activewear & Sportswear',
    imageUrl: '/uploads/categories/product-5.jpg',
    subcategories: [
      'Gym T-Shirts',
      'Joggers & Track Pants',
      'Sports Bras',
      'Yoga Leggings',
      'Athletic Jackets'
    ]
  },

  // ── 4. Health, Beauty & Personal Care ──
  {
    name: 'Skincare Essentials',
    imageUrl: '/uploads/categories/product-9.jpg',
    subcategories: ['Face Cleansers', 'Moisturizers', 'Serums & Oils', 'Sunscreens', 'Face Masks']
  },
  {
    name: 'Hair Care & Styling',
    imageUrl: '/uploads/categories/product-3.jpg',
    subcategories: [
      'Shampoos & Conditioners',
      'Hair Dryers',
      'Straighteners & Curlers',
      'Hair Oils & Serums'
    ]
  },
  {
    name: 'Fragrances & Perfumes',
    imageUrl: '/uploads/categories/product-11.jpg',
    subcategories: [
      "Men's Cologne",
      "Women's Perfume",
      'Body Mists',
      'Unisex Fragrances',
      'Deodorants'
    ]
  },
  {
    name: 'Makeup & Cosmetics',
    imageUrl: '/uploads/categories/product-9.jpg',
    subcategories: [
      'Lipsticks & Tints',
      'Foundations',
      'Mascara & Eye Liners',
      'Makeup Brushes',
      'Palettes'
    ]
  },
  {
    name: 'Personal Grooming',
    imageUrl: '/uploads/categories/product-8.jpg',
    subcategories: ['Electric Shavers', 'Beard Trimmers', 'Dental Flossers', 'Nail Care Sets']
  },
  {
    name: 'Health & Wellness',
    imageUrl: '/uploads/categories/product-4.jpg',
    subcategories: [
      'Vitamins & Supplements',
      'Blood Pressure Monitors',
      'Digital Thermometers',
      'Massage Guns'
    ]
  },

  // ── 5. Sports, Fitness & Outdoors ──
  {
    name: 'Fitness & Gym Equipment',
    imageUrl: '/uploads/categories/product-6.jpg',
    subcategories: [
      'Dumbbells & Weights',
      'Resistance Bands',
      'Yoga Mats',
      'Kettlebells',
      'Pull-Up Bars'
    ]
  },
  {
    name: 'Cycling & Bicycles',
    imageUrl: '/uploads/categories/product-12.jpg',
    subcategories: [
      'Mountain Bikes',
      'Road Bikes',
      'Helmets & Pads',
      'Bike Lights & Locks',
      'Cycling Apparel'
    ]
  },
  {
    name: 'Camping & Hiking Gear',
    imageUrl: '/uploads/categories/product-5.jpg',
    subcategories: [
      'Camping Tents',
      'Sleeping Bags',
      'Camping Stoves',
      'Hiking Poles',
      'Flashlights & Headlamps'
    ]
  },
  {
    name: 'Travel Essentials',
    imageUrl: '/uploads/categories/product-13.jpg',
    subcategories: [
      'Travel Adapters',
      'Neck Pillows',
      'Packing Cubes',
      'Luggage Scales',
      'Travel Bottles'
    ]
  },
  {
    name: 'Outdoor Recreation',
    imageUrl: '/uploads/categories/banner.png',
    subcategories: [
      'Hammocks',
      'Picnic Blankets',
      'Coolers & Ice Boxes',
      'Fishing Rods & Reels',
      'Binoculars'
    ]
  },
  {
    name: 'Water Sports & Swimming',
    imageUrl: '/uploads/categories/product-4.jpg',
    subcategories: [
      'Swimming Goggles',
      'Swimwear',
      'Paddle Boards',
      'Life Vests',
      'Waterproof Pouches'
    ]
  },

  // ── 6. Office, Stationery & Books ──
  {
    name: 'Office Furniture',
    imageUrl: '/uploads/categories/product-1.jpg',
    subcategories: [
      'Ergonomic Chairs',
      'Standing Desks',
      'Bookcases',
      'Filing Cabinets',
      'Desk Organizers'
    ]
  },
  {
    name: 'Office Supplies & Stationery',
    imageUrl: '/uploads/categories/product-5.jpg',
    subcategories: [
      'Notebooks & Planners',
      'Gel Pens & Markers',
      'Desk Mats',
      'Staplers & Scissors',
      'Paper Shredders'
    ]
  },
  {
    name: 'Books & Literature',
    imageUrl: '/uploads/categories/product-15.jpg',
    subcategories: [
      'Fiction & Novels',
      'Self-Help & Motivation',
      'Business & Finance',
      'Sci-Fi & Fantasy',
      "Children's Books"
    ]
  },
  {
    name: 'Art & Craft Supplies',
    imageUrl: '/uploads/categories/product-9.jpg',
    subcategories: [
      'Sketchbooks & Pads',
      'Acrylic Paints',
      'Brushes & Palettes',
      'Color Pencils',
      'Crafting Tools'
    ]
  },
  {
    name: 'Musical Instruments',
    imageUrl: '/uploads/categories/product-7.jpg',
    subcategories: [
      'Acoustic Guitars',
      'Electric Keyboards',
      'Ukuleles',
      'Microphones',
      'Headphone Monitors'
    ]
  },

  // ── 7. Toys, Baby & Kids ──
  {
    name: 'Toys & Building Games',
    imageUrl: '/uploads/categories/product-12.jpg',
    subcategories: [
      'Building Blocks',
      'Action Figures',
      'Board Games & Puzzles',
      'Remote Control Cars',
      'Stuffed Animals'
    ]
  },
  {
    name: 'Baby Essentials & Care',
    imageUrl: '/uploads/categories/product-9.jpg',
    subcategories: [
      'Baby Strollers',
      'Car Seats',
      'Baby Bottles & Pacifiers',
      'Diaper Bags',
      'Baby Monitors'
    ]
  },
  {
    name: "Kids' Fashion",
    imageUrl: '/uploads/categories/product-11.jpg',
    subcategories: [
      "Boys' Clothing",
      "Girls' Clothing",
      "Kids' Footwear",
      'Baby Rompers',
      'Winter Wear'
    ]
  },
  {
    name: 'Educational Toys',
    imageUrl: '/uploads/categories/product-8.jpg',
    subcategories: [
      'STEM Kits',
      'Microscopes',
      'Learning Tablets',
      'Alphabet & Math Toys',
      'Robotics Kits'
    ]
  },
  {
    name: "Kids' Furniture & Play",
    imageUrl: '/uploads/categories/product-10.jpg',
    subcategories: ['Play Tents', 'Kids Study Tables', 'Toy Storage Organizers', 'High Chairs']
  },

  // ── 8. Automotive, Hardware, Garden & Pet Supplies ──
  {
    name: 'Automotive Accessories',
    imageUrl: '/uploads/categories/product-14.jpg',
    subcategories: [
      'Dash Cams',
      'Car Vacuum Cleaners',
      'Tire Inflators',
      'Car Seat Covers',
      'Jump Starters'
    ]
  },
  {
    name: 'Car Electronics & Audio',
    imageUrl: '/uploads/categories/product-2.jpg',
    subcategories: [
      'Car Stereos & Receivers',
      'Car Speakers',
      'Bluetooth FM Transmitters',
      'GPS Navigators'
    ]
  },
  {
    name: 'Garden & Lawn Care',
    imageUrl: '/uploads/categories/banner.png',
    subcategories: [
      'Garden Hoses & Nozzles',
      'Pruning Shears',
      'Plant Pots & Planters',
      'Lawn Mowers',
      'Fertilizers & Soil'
    ]
  },
  {
    name: 'Power Tools & Hardware',
    imageUrl: '/uploads/categories/product-6.jpg',
    subcategories: [
      'Cordless Drills',
      'Tool Sets & Toolboxes',
      'Screwdriver Sets',
      'Measuring Tapes & Levels',
      'Rotary Tools'
    ]
  },
  {
    name: 'Pet Supplies - Dogs & Cats',
    imageUrl: '/uploads/categories/product-3.jpg',
    subcategories: [
      'Dog Beds',
      'Cat Trees & Scratchers',
      'Pet Grooming Kits',
      'Pet Leashes & Collars',
      'Automatic Feeders'
    ]
  },
  {
    name: 'Smart Gadgets & Novelties',
    imageUrl: '/uploads/categories/product-15.jpg',
    subcategories: [
      'Mini Drones',
      'Retro Arcade Consoles',
      'Smart Thermos Bottles',
      'Desk Fidget Toys',
      'LED Neon Signs'
    ]
  }
];

async function seedCategories() {
  logger.info(`Starting category seed: ${CATEGORIES_DATA.length} categories to seed...`);

  let totalSubcategories = 0;

  for (const cat of CATEGORIES_DATA) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {
        imageUrl: cat.imageUrl,
        isActive: cat.isActive ?? true
      },
      create: {
        name: cat.name,
        imageUrl: cat.imageUrl,
        isActive: cat.isActive ?? true
      }
    });

    for (const subName of cat.subcategories) {
      await prisma.subcategory.upsert({
        where: {
          name_categoryId: {
            name: subName,
            categoryId: category.id
          }
        },
        update: {},
        create: {
          name: subName,
          categoryId: category.id
        }
      });
      totalSubcategories++;
    }
  }

  logger.info(
    `Successfully seeded ${CATEGORIES_DATA.length} categories and ${totalSubcategories} subcategories!`
  );
}

seedCategories()
  .catch((err) => {
    logger.error('Error during category seeding:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
