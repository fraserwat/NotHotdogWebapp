from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    # path("upload_image/", views.upload_image, name="upload_image"),
    path("take_photo/", views.take_photo, name="take_photo"),
    # path("result/<str:image_url>/", views.result, name="result"),
]
