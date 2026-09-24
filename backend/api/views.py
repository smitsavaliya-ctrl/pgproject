from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from rest_framework.pagination import PageNumberPagination
from .models import City, Locality, Institution, Property, Booking, Inquiry, Review, Complaint
from .serializers import (
    CitySerializer, LocalitySerializer, InstitutionSerializer,
    PropertySerializer, BookingSerializer, InquirySerializer,
    ReviewSerializer, ComplaintSerializer
)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 500
    page_size_query_param = 'page_size'
    max_page_size = 3000

class CityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer

class LocalityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Locality.objects.all()
    serializer_class = LocalitySerializer

    def get_queryset(self):
        qs = super().get_queryset()
        city_name = self.request.query_params.get('city', None)
        if city_name:
            qs = qs.filter(city__name__iexact=city_name)
        return qs

class InstitutionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        city_name = self.request.query_params.get('city', None)
        if city_name:
            qs = qs.filter(city__name__iexact=city_name)
        return qs

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = super().get_queryset()
        city = self.request.query_params.get('city', None)
        locality = self.request.query_params.get('locality', None)
        gender = self.request.query_params.get('gender', None)
        max_rent = self.request.query_params.get('max_rent', None)
        min_rating = self.request.query_params.get('min_rating', None)
        keyword = self.request.query_params.get('keyword', None)

        if city:
            qs = qs.filter(city__name__iexact=city)
        if locality:
            qs = qs.filter(area__icontains=locality)
        if gender and gender.lower() != 'all':
            qs = qs.filter(gender__iexact=gender)
        if max_rent:
            try:
                qs = qs.filter(rent__lte=int(max_rent))
            except: pass
        if min_rating:
            try:
                qs = qs.filter(rating__gte=float(min_rating))
            except: pass
        if keyword:
            qs = qs.filter(name__icontains=keyword)

        return qs

    @action(detail=False, methods=['get'])
    def recommendations(self, request):
        qs = self.get_queryset().order_by('-rating')[:6]
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer

@api_view(['POST'])
def auth_register(request):
    return Response({'message': 'User registered successfully', 'token': 'mock-jwt-token-registered'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def auth_login(request):
    username = request.data.get('username')
    return Response({'message': 'Login successful', 'token': f'mock-jwt-token-{username}', 'user': {'name': username}}, status=status.HTTP_200_OK)

@api_view(['GET'])
def admin_stats(request):
    return Response({
        'totalStudents': 24500,
        'totalOwners': 1250,
        'totalPgs': Property.objects.count(),
        'availableRooms': Property.objects.count() * 4
    })
