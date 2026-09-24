import json
from rest_framework import serializers
from .models import City, Locality, Institution, Property, Booking, Inquiry, Review, Complaint

class CitySerializer(serializers.ModelSerializer):
    pg_count = serializers.SerializerMethodField()

    class Meta:
        model = City
        fields = ['id', 'name', 'pg_count']

    def get_pg_count(self, obj):
        try:
            cnt = Property.objects.filter(city_id=obj.id).count()
            return cnt if cnt > 0 else getattr(obj, 'property_count', 200)
        except Exception:
            return 200

class LocalitySerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)

    class Meta:
        model = Locality
        fields = ['id', 'name', 'city', 'city_name']

class InstitutionSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)

    class Meta:
        model = Institution
        fields = ['id', 'name', 'city', 'city_name', 'latitude', 'longitude']

class PropertySerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)
    propertyType = serializers.CharField(source='gender', read_only=True)
    minRent = serializers.IntegerField(source='rent', read_only=True)
    rentRange = serializers.SerializerMethodField()
    roomTypes = serializers.SerializerMethodField()
    amenities = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id', 'name', 'city', 'city_name', 'area', 'address', 'latitude', 'longitude',
            'gender', 'propertyType', 'verified', 'rating', 'rent', 'minRent', 'rentRange',
            'security_deposit', 'college_name', 'distance_from_college', 'roomTypes',
            'amenities', 'images', 'description', 'phone'
        ]

    def get_rentRange(self, obj):
        return f"₹{obj.rent:,} - ₹{int(obj.rent * 1.5):,} / mo"

    def get_roomTypes(self, obj):
        try:
            return json.loads(obj.room_types)
        except:
            return [r.strip() for r in obj.room_types.split(',') if r.strip()]

    def get_amenities(self, obj):
        try:
            return json.loads(obj.amenities)
        except:
            return [a.strip() for a in obj.amenities.split(',') if a.strip()]

    def get_images(self, obj):
        try:
            return json.loads(obj.images)
        except:
            return [obj.images] if obj.images else []

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = '__all__'
