from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root_home(request):
    return JsonResponse({
        "status": "online",
        "message": "Welcome to StayNest Backend API (1,200 PGs Loaded)",
        "endpoints": {
            "properties": "/api/properties/",
            "cities": "/api/cities/",
            "admin": "/admin/"
        }
    })

urlpatterns = [
    path('', root_home, name='root_home'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
