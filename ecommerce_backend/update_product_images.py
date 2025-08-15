#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
django.setup()

from store.models import Product

def update_product_images():
    # Product image mappings
    product_images = {
        'Smartphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center',
        'Laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center',
        'T-Shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
        'Jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center',
        'Python Programming Book': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&crop=center',
        'Bangladesh Away Thai Premium Football Jersey For Men - Bangladesh Football Away Jersey 2025': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center'
    }

    # Update products with images
    for product in Product.objects.all():
        if product.name in product_images:
            product.image_url = product_images[product.name]
            product.save()
            print(f"Updated image for: {product.name}")
        else:
            # Set a default image based on category
            if product.category.name == 'Electronics':
                if 'phone' in product.name.lower() or 'smartphone' in product.name.lower():
                    product.image_url = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center'
                elif 'laptop' in product.name.lower():
                    product.image_url = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center'
                else:
                    product.image_url = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center'
            elif product.category.name == 'Clothing':
                if 'shirt' in product.name.lower():
                    product.image_url = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center'
                elif 'jean' in product.name.lower():
                    product.image_url = 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center'
                elif 'jersey' in product.name.lower():
                    product.image_url = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center'
                else:
                    product.image_url = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center'
            elif product.category.name == 'Books':
                product.image_url = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&crop=center'
            else:
                product.image_url = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center'
            
            product.save()
            print(f"Set default image for: {product.name}")

    print("All product images updated successfully!")

if __name__ == '__main__':
    update_product_images()