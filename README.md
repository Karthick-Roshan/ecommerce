# E-commerce Flipkart Clone

A full-stack e-commerce application built with React.js, Node.js, Express.js, and MySQL.

## Features

### Frontend (React.js)
- User authentication (login/register)
- Product browsing and search
- Shopping cart functionality
- Order management
- User profile management
- Responsive design
- Redux for state management

### Backend (Node.js/Express.js)
- RESTful API
- JWT authentication
- MySQL database with Sequelize ORM
- File upload handling
- Role-based access control (Customer, Seller, Admin)
- Order processing
- Cart management

## Tech Stack

### Frontend
- React.js 18
- Redux Toolkit
- React Router DOM
- Axios
- React Toastify
- CSS3

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT
- Bcrypt.js
- Multer (file uploads)
- CORS

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd ecommerce-flipkart-clone
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client
```

### 3. Database Setup
1. Create a MySQL database named `ecommerce_db`
2. Update the database credentials in `server/.env`

### 4. Environment Variables

#### Server (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce_db
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your-super-secret-jwt-key
PORT=8000
NODE_ENV=development
MAX_FILE_SIZE=5000000
FRONTEND_URL=http://localhost:3000
```

#### Client (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME=Flipkart Clone
REACT_APP_VERSION=1.0.0
```

### 5. Database Migration & Seeding
```bash
# Seed the database with sample data
npm run seed
```

### 6. Run the Application
```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately:
# Backend only
npm run server

# Frontend only
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Sample Login Credentials

After running the seed command, you can use these credentials:

- **Admin**: admin@flipkart.com / admin123
- **Seller**: seller@flipkart.com / seller123
- **Customer**: customer@flipkart.com / customer123

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update user profile

### Products
- GET `/api/products` - Get all products (with filters)
- GET `/api/products/:slug` - Get single product
- POST `/api/products` - Create product (Seller/Admin)
- PUT `/api/products/:id` - Update product (Seller/Admin)
- DELETE `/api/products/:id` - Delete product (Seller/Admin)

### Categories
- GET `/api/categories` - Get all categories
- GET `/api/categories/:slug` - Get category with products
- POST `/api/categories` - Create category (Admin)

### Cart
- GET `/api/cart` - Get user cart
- POST `/api/cart/add` - Add item to cart
- PUT `/api/cart/update/:id` - Update cart item
- DELETE `/api/cart/remove/:id` - Remove cart item
- DELETE `/api/cart/clear` - Clear entire cart

### Orders
- POST `/api/orders/create` - Create new order
- GET `/api/orders/my-orders` - Get user orders
- GET `/api/orders/:orderId` - Get single order
- PUT `/api/orders/:orderId/cancel` - Cancel order

## Project Structure

```
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store and slices
│   │   ├── utils/         # Utility functions
│   │   └── App.js
│   └── package.json
├── server/                # Node.js backend
│   ├── database/
│   │   ├── models/        # Sequelize models
│   │   ├── seeders/       # Database seeders
│   │   └── connection.js
│   ├── middleware/        # Custom middleware
│   ├── routes/           # API routes
│   ├── uploads/          # File uploads directory
│   └── index.js
└── package.json          # Root package.json
```

## Features in Detail

### User Roles
1. **Customer**: Browse products, manage cart, place orders
2. **Seller**: Manage own products, view orders
3. **Admin**: Full system access, manage all products and orders

### Product Management
- Product CRUD operations
- Image upload support
- Category-based organization
- Search and filtering
- Stock management

### Order Management
- Cart to order conversion
- Order status tracking
- Order history
- Order cancellation

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- CORS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.