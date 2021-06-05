from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

admin.site.site_header = 'eDoc Administration'                   
admin.site.site_title = 'eDoc site admin' 

urlpatterns = [
    path('', include('frontend.urls')),
    path('', include('reservations.urls')),
    path('', include('accounts.urls')),
    path('admin/', admin.site.urls),
]

urlpatterns = urlpatterns + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)