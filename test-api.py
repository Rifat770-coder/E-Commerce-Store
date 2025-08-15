#!/usr/bin/env python3
"""
Simple script to test the Django API endpoints
"""
import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_api():
    print("Testing E-Commerce API...")
    
    # Test root endpoint
    try:
        response = requests.get('http://localhost:8000/')
        print(f"✓ Root endpoint: {response.status_code}")
        print(f"  Response: {response.json()['message']}")
    except Exception as e:
        print(f"✗ Root endpoint failed: {e}")
    
    # Test products endpoint
    try:
        response = requests.get(f'{BASE_URL}/products/')
        print(f"✓ Products endpoint: {response.status_code}")
        products = response.json()
        print(f"  Found {len(products)} products")
    except Exception as e:
        print(f"✗ Products endpoint failed: {e}")
    
    # Test categories endpoint
    try:
        response = requests.get(f'{BASE_URL}/categories/')
        print(f"✓ Categories endpoint: {response.status_code}")
        categories = response.json()
        print(f"  Found {len(categories)} categories")
    except Exception as e:
        print(f"✗ Categories endpoint failed: {e}")
    
    print("\nAPI test completed!")

if __name__ == '__main__':
    test_api()