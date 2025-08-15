#!/usr/bin/env python3
"""
Simple script to check if both Django and Next.js servers are running
"""
import requests
import subprocess
import sys

def check_django_server():
    """Check if Django server is running on port 8000"""
    try:
        response = requests.get('http://localhost:8000/', timeout=5)
        print("✅ Django server is running on http://localhost:8000")
        return True
    except requests.exceptions.RequestException as e:
        print("❌ Django server is NOT running on http://localhost:8000")
        print(f"   Error: {e}")
        return False

def check_nextjs_server():
    """Check if Next.js server is running on port 3000"""
    try:
        response = requests.get('http://localhost:3000/', timeout=5)
        print("✅ Next.js server is running on http://localhost:3000")
        return True
    except requests.exceptions.RequestException as e:
        print("❌ Next.js server is NOT running on http://localhost:3000")
        print(f"   Error: {e}")
        return False

def main():
    print("🔍 Checking server status...\n")
    
    django_ok = check_django_server()
    nextjs_ok = check_nextjs_server()
    
    print("\n" + "="*50)
    
    if django_ok and nextjs_ok:
        print("🎉 Both servers are running correctly!")
        print("   Frontend: http://localhost:3000")
        print("   Backend API: http://localhost:8000/api")
    else:
        print("⚠️  Some servers are not running:")
        if not django_ok:
            print("   • Start Django: cd ecommerce_backend && python manage.py runserver")
        if not nextjs_ok:
            print("   • Start Next.js: cd ecommerce-frontend && npm run dev")

if __name__ == '__main__':
    main()