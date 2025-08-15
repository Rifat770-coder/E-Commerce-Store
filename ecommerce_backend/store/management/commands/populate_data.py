from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from store.models import Category, Product, UserProfile, Cart


class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        # Create categories
        categories_data = [
            {'name': 'Electronics', 'description': 'Electronic devices and gadgets'},
            {'name': 'Clothing', 'description': 'Fashion and apparel'},
            {'name': 'Books', 'description': 'Books and literature'},
            {'name': 'Home & Garden', 'description': 'Home improvement and gardening'},
            {'name': 'Sports', 'description': 'Sports equipment and accessories'},
        ]

        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            if created:
                self.stdout.write(f'Created category: {category.name}')

        # Create products
        electronics = Category.objects.get(name='Electronics')
        clothing = Category.objects.get(name='Clothing')
        books = Category.objects.get(name='Books')

        products_data = [
            {
                'name': 'Smartphone',
                'description': 'Latest smartphone with advanced features',
                'price': 699.99,
                'category': electronics,
                'stock_quantity': 50,
                'image_url': ''  # Will use placeholder component
            },
            {
                'name': 'Laptop',
                'description': 'High-performance laptop for work and gaming',
                'price': 1299.99,
                'category': electronics,
                'stock_quantity': 25,
                'image_url': ''  # Will use placeholder component
            },
            {
                'name': 'T-Shirt',
                'description': 'Comfortable cotton t-shirt',
                'price': 19.99,
                'category': clothing,
                'stock_quantity': 100,
                'image_url': ''  # Will use placeholder component
            },
            {
                'name': 'Jeans',
                'description': 'Classic blue jeans',
                'price': 49.99,
                'category': clothing,
                'stock_quantity': 75,
                'image_url': ''  # Will use placeholder component
            },
            {
                'name': 'Python Programming Book',
                'description': 'Learn Python programming from scratch',
                'price': 29.99,
                'category': books,
                'stock_quantity': 40,
                'image_url': ''  # Will use placeholder component
            },
        ]

        for prod_data in products_data:
            product, created = Product.objects.get_or_create(
                name=prod_data['name'],
                defaults=prod_data
            )
            if created:
                self.stdout.write(f'Created product: {product.name}')

        self.stdout.write(self.style.SUCCESS('Successfully populated database with sample data'))