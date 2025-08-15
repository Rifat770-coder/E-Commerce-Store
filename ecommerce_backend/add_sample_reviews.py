#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
django.setup()

from django.contrib.auth.models import User
from store.models import Product, Review

def add_sample_reviews():
    # Get or create a sample user
    user, created = User.objects.get_or_create(
        username='sampleuser',
        defaults={
            'email': 'sample@example.com',
            'first_name': 'John',
            'last_name': 'Doe'
        }
    )
    if created:
        user.set_password('password123')
        user.save()
        print(f"Created user: {user.username}")

    # Get all products
    products = Product.objects.all()
    
    if not products:
        print("No products found. Please add some products first.")
        return

    # Sample reviews data
    sample_reviews = [
        {
            'rating': 5,
            'title': 'Excellent product!',
            'comment': 'This product exceeded my expectations. Great quality and fast shipping!'
        },
        {
            'rating': 4,
            'title': 'Good value for money',
            'comment': 'Solid product with good features. Would recommend to others.'
        },
        {
            'rating': 5,
            'title': 'Perfect!',
            'comment': 'Exactly what I was looking for. The quality is outstanding and delivery was quick.'
        },
        {
            'rating': 3,
            'title': 'Average product',
            'comment': 'It\'s okay, does what it\'s supposed to do but nothing special.'
        },
        {
            'rating': 4,
            'title': 'Pretty good',
            'comment': 'Good product overall, minor issues but nothing major.'
        }
    ]

    # Add reviews to products
    for i, product in enumerate(products[:3]):  # Add reviews to first 3 products
        for j, review_data in enumerate(sample_reviews[:3]):  # Add 3 reviews per product
            # Create a unique user for each review
            review_user, created = User.objects.get_or_create(
                username=f'reviewer_{i}_{j}',
                defaults={
                    'email': f'reviewer{i}{j}@example.com',
                    'first_name': f'User{i}{j}',
                    'last_name': 'Reviewer'
                }
            )
            
            # Check if review already exists
            if not Review.objects.filter(product=product, user=review_user).exists():
                Review.objects.create(
                    product=product,
                    user=review_user,
                    rating=review_data['rating'],
                    title=review_data['title'],
                    comment=review_data['comment'],
                    is_verified_purchase=True
                )
                print(f"Added review for {product.name} by {review_user.username}")

    print("Sample reviews added successfully!")

if __name__ == '__main__':
    add_sample_reviews()