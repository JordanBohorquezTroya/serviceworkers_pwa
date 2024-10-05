from django.urls import path
from .views import home, guardar_token

urlpatterns = [
    path('', home, name='home'),  # Ruta para la vista 'home'
    path('guardar_token/', guardar_token, name='guardar_token'),
]
