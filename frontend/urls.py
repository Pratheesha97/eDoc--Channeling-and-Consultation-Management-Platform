from django.urls import path
from . import views #import from current directory

urlpatterns = [
    path('', views.index) #for the root directory
]
