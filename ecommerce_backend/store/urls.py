from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('users/register/', views.register_user, name='register'),
    path('users/login/', views.login_user, name='login'),
    path('users/logout/', views.logout_user, name='logout'),
    
    # Products
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    
    # Cart
    path('cart/', views.get_cart, name='get-cart'),
    path('cart/add/', views.add_to_cart, name='add-to-cart'),
    path('cart/update/<int:item_id>/', views.update_cart_item, name='update-cart-item'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove-from-cart'),
    
    # Orders
    path('orders/', views.get_user_orders, name='user-orders'),
    path('orders/create/', views.create_order, name='create-order'),
    path('orders/<int:order_id>/', views.get_order_detail, name='order-detail'),
    
    # Reviews
    path('products/<int:product_id>/reviews/', views.get_product_reviews, name='product-reviews'),
    path('reviews/', views.create_review, name='create-review'),
    path('reviews/<int:review_id>/', views.update_review, name='update-review'),
    path('reviews/<int:review_id>/delete/', views.delete_review, name='delete-review'),
    path('users/reviews/', views.get_user_reviews, name='user-reviews'),
]