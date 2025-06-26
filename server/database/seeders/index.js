const { sequelize } = require('../connection');
const { User, Category, Product } = require('../models/associations');

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Sync database first
    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@flipkart.com',
      password: 'admin123',
      phone: '9876543210',
      role: 'admin'
    });

    // Create seller user
    const sellerUser = await User.create({
      firstName: 'John',
      lastName: 'Seller',
      email: 'seller@flipkart.com',
      password: 'seller123',
      phone: '9876543211',
      role: 'seller'
    });

    // Create customer user
    const customerUser = await User.create({
      firstName: 'Jane',
      lastName: 'Customer',
      email: 'customer@flipkart.com',
      password: 'customer123',
      phone: '9876543212',
      role: 'customer'
    });

    console.log('Users created successfully');

    // Create categories
    const electronicsCategory = await Category.create({
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      sortOrder: 1
    });

    const mobilesCategory = await Category.create({
      name: 'Mobiles',
      description: 'Smartphones and mobile accessories',
      parentId: electronicsCategory.id,
      sortOrder: 1
    });

    const laptopsCategory = await Category.create({
      name: 'Laptops',
      description: 'Laptops and computers',
      parentId: electronicsCategory.id,
      sortOrder: 2
    });

    const fashionCategory = await Category.create({
      name: 'Fashion',
      description: 'Clothing and accessories',
      sortOrder: 2
    });

    const mensCategory = await Category.create({
      name: 'Men\'s Clothing',
      description: 'Clothing for men',
      parentId: fashionCategory.id,
      sortOrder: 1
    });

    const womensCategory = await Category.create({
      name: 'Women\'s Clothing',
      description: 'Clothing for women',
      parentId: fashionCategory.id,
      sortOrder: 2
    });

    const homeCategory = await Category.create({
      name: 'Home & Kitchen',
      description: 'Home appliances and kitchen items',
      sortOrder: 3
    });

    console.log('Categories created successfully');

    // Create sample products
    const products = [
      {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with A17 Pro chip, advanced camera system, and titanium design',
        shortDescription: 'Premium smartphone with cutting-edge technology',
        price: 129900.00,
        discountPrice: 119900.00,
        stock: 50,
        sku: 'IPH15PRO128',
        brand: 'Apple',
        categoryId: mobilesCategory.id,
        sellerId: sellerUser.id,
        isFeatured: true,
        images: ['/uploads/iphone15pro.jpg'],
        specifications: {
          display: '6.1-inch Super Retina XDR',
          storage: '128GB',
          camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
          battery: 'Up to 23 hours video playback',
          processor: 'A17 Pro chip'
        },
        tags: ['smartphone', 'apple', 'premium', 'camera']
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Flagship Samsung phone with S Pen, advanced AI features, and incredible camera',
        shortDescription: 'Ultimate Android flagship with S Pen',
        price: 124999.00,
        discountPrice: 109999.00,
        stock: 30,
        sku: 'SAMS24U256',
        brand: 'Samsung',
        categoryId: mobilesCategory.id,
        sellerId: sellerUser.id,
        isFeatured: true,
        images: ['/uploads/galaxys24ultra.jpg'],
        specifications: {
          display: '6.8-inch Dynamic AMOLED 2X',
          storage: '256GB',
          camera: '200MP Main + 50MP Periscope + 12MP Ultra Wide + 10MP Telephoto',
          battery: '5000mAh',
          processor: 'Snapdragon 8 Gen 3'
        },
        tags: ['smartphone', 'samsung', 'android', 's-pen']
      },
      {
        name: 'MacBook Air M3',
        description: 'Ultra-thin laptop with M3 chip, all-day battery life, and stunning Liquid Retina display',
        shortDescription: 'Powerful and portable laptop',
        price: 114900.00,
        discountPrice: 104900.00,
        stock: 25,
        sku: 'MBA13M3256',
        brand: 'Apple',
        categoryId: laptopsCategory.id,
        sellerId: sellerUser.id,
        isFeatured: true,
        images: ['/uploads/macbookairm3.jpg'],
        specifications: {
          display: '13.6-inch Liquid Retina',
          storage: '256GB SSD',
          memory: '8GB unified memory',
          processor: 'Apple M3 chip',
          battery: 'Up to 18 hours'
        },
        tags: ['laptop', 'apple', 'macbook', 'm3']
      },
      {
        name: 'Dell XPS 13',
        description: 'Premium ultrabook with InfinityEdge display and latest Intel processors',
        shortDescription: 'Premium Windows ultrabook',
        price: 89999.00,
        discountPrice: 79999.00,
        stock: 20,
        sku: 'DELLXPS13512',
        brand: 'Dell',
        categoryId: laptopsCategory.id,
        sellerId: sellerUser.id,
        images: ['/uploads/dellxps13.jpg'],
        specifications: {
          display: '13.4-inch FHD+ InfinityEdge',
          storage: '512GB SSD',
          memory: '16GB LPDDR5',
          processor: 'Intel Core i7-1355U',
          battery: 'Up to 12 hours'
        },
        tags: ['laptop', 'dell', 'ultrabook', 'windows']
      },
      {
        name: 'Men\'s Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt perfect for casual wear',
        shortDescription: 'Classic cotton t-shirt',
        price: 799.00,
        discountPrice: 599.00,
        stock: 100,
        sku: 'MENTSHIRT001',
        brand: 'Flipkart Brand',
        categoryId: mensCategory.id,
        sellerId: sellerUser.id,
        images: ['/uploads/mens-tshirt.jpg'],
        specifications: {
          material: '100% Cotton',
          fit: 'Regular Fit',
          sleeve: 'Short Sleeve',
          care: 'Machine Wash'
        },
        tags: ['clothing', 'men', 'casual', 'cotton']
      },
      {
        name: 'Women\'s Kurti',
        description: 'Elegant cotton kurti with beautiful prints',
        shortDescription: 'Traditional cotton kurti',
        price: 1299.00,
        discountPrice: 899.00,
        stock: 75,
        sku: 'WOMKURTI001',
        brand: 'Flipkart Brand',
        categoryId: womensCategory.id,
        sellerId: sellerUser.id,
        images: ['/uploads/womens-kurti.jpg'],
        specifications: {
          material: 'Cotton',
          length: 'Knee Length',
          sleeve: '3/4 Sleeve',
          pattern: 'Printed'
        },
        tags: ['clothing', 'women', 'traditional', 'kurti']
      },
      {
        name: 'Smart LED TV 55 inch',
        description: '4K Ultra HD Smart LED TV with multiple streaming apps',
        shortDescription: '55-inch 4K Smart TV',
        price: 45999.00,
        discountPrice: 39999.00,
        stock: 15,
        sku: 'SMARTTV55',
        brand: 'Flipkart Brand',
        categoryId: electronicsCategory.id,
        sellerId: sellerUser.id,
        isFeatured: true,
        images: ['/uploads/smart-tv-55.jpg'],
        specifications: {
          display: '55-inch 4K Ultra HD',
          resolution: '3840 x 2160',
          smartFeatures: 'Android TV, Netflix, Prime Video',
          connectivity: 'Wi-Fi, Bluetooth, HDMI, USB'
        },
        tags: ['tv', 'smart', '4k', 'entertainment']
      },
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-cancelling wireless headphones with long battery life',
        shortDescription: 'Noise-cancelling wireless headphones',
        price: 8999.00,
        discountPrice: 6999.00,
        stock: 60,
        sku: 'BTHEADPHONE01',
        brand: 'Flipkart Brand',
        categoryId: electronicsCategory.id,
        sellerId: sellerUser.id,
        images: ['/uploads/bluetooth-headphones.jpg'],
        specifications: {
          connectivity: 'Bluetooth 5.0',
          battery: 'Up to 30 hours',
          features: 'Active Noise Cancellation',
          weight: '250g'
        },
        tags: ['headphones', 'wireless', 'bluetooth', 'music']
      },
      {
        name: 'Kitchen Mixer Grinder',
        description: 'Powerful 750W mixer grinder with multiple jars for all kitchen needs',
        shortDescription: '750W mixer grinder',
        price: 4999.00,
        discountPrice: 3999.00,
        stock: 40,
        sku: 'MIXERGRINDER01',
        brand: 'Flipkart Brand',
        categoryId: homeCategory.id,
        sellerId: sellerUser.id,
        images: ['/uploads/mixer-grinder.jpg'],
        specifications: {
          power: '750W',
          jars: '3 Stainless Steel Jars',
          speed: 'Variable Speed Control',
          warranty: '2 Years'
        },
        tags: ['kitchen', 'appliance', 'mixer', 'grinder']
      },
      {
        name: 'Air Fryer 4L',
        description: 'Healthy cooking with hot air circulation, oil-free frying',
        shortDescription: '4L capacity air fryer',
        price: 7999.00,
        discountPrice: 5999.00,
        stock: 35,
        sku: 'AIRFRYER4L',
        brand: 'Flipkart Brand',
        categoryId: homeCategory.id,
        sellerId: sellerUser.id,
        images: ['/uploads/air-fryer.jpg'],
        specifications: {
          capacity: '4 Liters',
          temperature: 'Up to 200°C',
          timer: '60 minutes',
          features: 'Oil-free cooking, Easy cleanup'
        },
        tags: ['kitchen', 'appliance', 'healthy', 'cooking']
      }
    ];

    // Create products
    for (const productData of products) {
      await Product.create(productData);
    }

    console.log('Products created successfully');

    // Create sample addresses for customer
    const addresses = [
      {
        userId: customerUser.id,
        type: 'home',
        firstName: 'Jane',
        lastName: 'Customer',
        phone: '9876543212',
        street: '123 Main Street, Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India',
        landmark: 'Near Central Mall',
        isDefault: true
      },
      {
        userId: customerUser.id,
        type: 'office',
        firstName: 'Jane',
        lastName: 'Customer',
        phone: '9876543212',
        street: 'Office Complex, Tower A, Floor 5',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400070',
        country: 'India',
        landmark: 'Near Metro Station',
        isDefault: false
      }
    ];

    const { Address } = require('../models/associations');
    for (const addressData of addresses) {
      await Address.create(addressData);
    }

    console.log('Sample addresses created successfully');

    console.log('\n=== DATABASE SEEDING COMPLETED ===');
    console.log('\nSample Login Credentials:');
    console.log('Admin: admin@flipkart.com / admin123');
    console.log('Seller: seller@flipkart.com / seller123');
    console.log('Customer: customer@flipkart.com / customer123');
    console.log('\nCategories created: Electronics, Fashion, Home & Kitchen');
    console.log('Products created: 10 sample products');
    console.log('Sample addresses created for customer user');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;