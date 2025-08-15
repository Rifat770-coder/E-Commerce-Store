@echo off
echo Starting Django Backend Server...
cd ecommerce_backend
call ..\env\Scripts\activate
python manage.py runserver
pause