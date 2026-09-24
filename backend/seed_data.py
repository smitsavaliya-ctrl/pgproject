# Django Seed script for StayNest Backend
import os
import django
import json
from pathlib import Path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'staynest_backend.settings')
django.setup()

from api.models import City, Property

BASE_DIR = Path(__file__).resolve().parent

def seed_db():
    print("Seeding StayNest Database...")
    json_path = BASE_DIR / 'dataset.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cities_data = data['cities']
    properties_data = data['properties']

    # Clear existing data for fresh seed
    Property.objects.all().delete()

    for c_data in cities_data:
        city, _ = City.objects.get_or_create(
            name=c_data['name'],
            defaults={
                'latitude': c_data.get('latitude', 23.0225),
                'longitude': c_data.get('longitude', 72.5714),
                'image_url': c_data.get('image', f"/assets/cities/{c_data['name'].lower()}.jpg")
            }
        )
        print(f"City registered: {city.name}")
        
    created_count = 0
    for p_data in properties_data:
        city_obj = City.objects.filter(name=p_data['city']).first()
        if not city_obj:
            city_obj, _ = City.objects.create(name=p_data['city'])
            
        Property.objects.create(
            name=p_data.get('name', 'StayNest PG'),
            city=city_obj,
            area=p_data.get('area', 'Central'),
            address=p_data.get('address', 'Central Area'),
            latitude=p_data.get('latitude', 23.0225),
            longitude=p_data.get('longitude', 72.5714),
            gender=p_data.get('gender', 'Unisex'),
            verified=p_data.get('verified', True),
            rating=p_data.get('rating', 4.5),
            rent=p_data.get('rent', 7500),
            security_deposit=p_data.get('securityDeposit', p_data.get('rent', 7500)),
            college_name=p_data.get('collegeName', 'Nearby University'),
            distance_from_college=p_data.get('distanceFromCollege', '0.5 km'),
            room_types=",".join(p_data.get('roomTypes', ['Single', 'Double'])),
            amenities=",".join(p_data.get('amenities', ['Wi-Fi', 'Food'])),
            images=json.dumps(p_data.get('images', ['./assets/pg_photos/photo_1.jpg'])),
            description=p_data.get('description', ''),
            phone=p_data.get('phone', '+91 98765 12345')
        )
        created_count += 1
        
    print(f"Seeding complete! {created_count} PGs created.")

if __name__ == '__main__':
    seed_db()
