# E-Commerce Store

A full-stack e-commerce application built with Django REST Framework backend and Next.js frontend.

## Features

### User Features
- User registration and authentication
- Product browsing and search
- Shopping cart functionality
- Order placement and history
- Responsive design

### Admin Features
- Product management (CRUD operations)
- Order management
- User management
- Category management

## Tech Stack

### Backend
- **Django 4.2.7** - Web framework
- **Django REST Framework** - API framework
- **SQLite** - Database (development)
- **Django CORS Headers** - Cross-origin resource sharing

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## Project Structure

```
├── ecommerce_backend/          # Django backend
│   ├── ecommerce_backend/      # Project settings
│   ├── store/                  # Main app
│   │   ├── models.py          # Database models
│   │   ├── views.py           # API views
│   │   ├── serializers.py     # DRF serializers
│   │   ├── urls.py            # URL routing
│   │   └── admin.py           # Admin configuration
│   └── manage.py              # Django management script
├── ecommerce-frontend/         # Next.js frontend
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── components/        # React components
│   │   └── utils/             # Utility functions
│   └── package.json
└── requirements.txt           # Python dependencies
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Create and activate virtual environment:**
   ```bash
   python -m venv env
   # Windows
   .\env\Scripts\activate
   # macOS/Linux
   source env/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Navigate to backend directory:**
   ```bash
   cd ecommerce_backend
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Populate sample data:**
   ```bash
   python manage.py populate_data
   ```

7. **Start development server:**
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ecommerce-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `POST /api/users/logout/` - User logout

### Products
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- `GET /api/categories/` - List all categories

### Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add/` - Add item to cart
- `PUT /api/cart/update/{item_id}/` - Update cart item quantity
- `DELETE /api/cart/remove/{item_id}/` - Remove item from cart

### Orders
- `GET /api/orders/` - Get user's orders
- `POST /api/orders/create/` - Create new order
- `GET /api/orders/{id}/` - Get order details

## Usage

1. **Start both servers** (backend on :8000, frontend on :3000)
   - Use `start-backend.bat` to start Django server
   - Use `start-frontend.bat` to start Next.js server
   - Or run them manually as described in the setup section

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin (username: admin, password: admin123)

3. **Register a new account** or use existing credentials
4. **Browse products** on the homepage
5. **Add items to cart** and proceed to checkout
6. **View order history** in the orders section

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/` to:
- Manage products and categories
- View and update orders
- Manage users

## Development Notes

- The frontend uses localStorage for simple authentication state management
- CORS is configured to allow requests from localhost:3000
- Sample data includes 5 products across different categories
- All API calls include credentials for session-based authentication

## Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Product search and filtering
- Email notifications
- Inventory management
- Product reviews and ratings
- AI-powered recommendations
- Mobile app development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.