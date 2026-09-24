from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CityViewSet, LocalityViewSet, InstitutionViewSet, PropertyViewSet,
    BookingViewSet, InquiryViewSet, ReviewViewSet, ComplaintViewSet,
    auth_register, auth_login, admin_stats
)

router = DefaultRouter()
router.register(r'cities', CityViewSet)
router.register(r'localities', LocalityViewSet)
router.register(r'institutions', InstitutionViewSet)
router.register(r'properties', PropertyViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'inquiries', InquiryViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'complaints', ComplaintViewSet)

urlpatterns = [
    path('auth/register/', auth_register, name='auth_register'),
    path('auth/login/', auth_login, name='auth_login'),
    path('admin/stats/', admin_stats, name='admin_stats'),
    path('', include(router.urls)),
]
