from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("take_photo/", views.take_photo, name="take_photo")
]
