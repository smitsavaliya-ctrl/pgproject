from django.db import models

class City(models.Model):
    name = models.CharField(max_length=100, unique=True)
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)
    image_url = models.URLField(max_length=500, blank=True)

    def __str__(self):
        return self.name

class Locality(models.Model):
    name = models.CharField(max_length=150)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='localities')

    def __str__(self):
        return f"{self.name}, {self.city.name}"

class Institution(models.Model):
    name = models.CharField(max_length=200)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='institutions')
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)

    def __str__(self):
        return self.name

class Property(models.Model):
    GENDER_CHOICES = (
        ('Boys', 'Boys'),
        ('Girls', 'Girls'),
        ('Unisex', 'Unisex'),
    )

    name = models.CharField(max_length=250)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='properties')
    area = models.CharField(max_length=150)
    address = models.TextField()
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='Unisex')
    verified = models.BooleanField(default=True)
    rating = models.FloatField(default=4.5)
    rent = models.IntegerField(default=7500)
    security_deposit = models.IntegerField(default=7500)
    college_name = models.CharField(max_length=200, blank=True)
    distance_from_college = models.CharField(max_length=100, blank=True)
    room_types = models.CharField(max_length=250, default="Single,Double,Triple")
    amenities = models.TextField(default="Wi-Fi,Food,Housekeeping,Security")
    images = models.TextField(default="[]")
    description = models.TextField(blank=True)
    phone = models.CharField(max_length=50, default="+91 98765 12345")

    def __str__(self):
        return f"{self.name} - {self.area}, {self.city.name}"

class Booking(models.Model):
    user_name = models.CharField(max_length=150)
    user_email = models.EmailField()
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='bookings')
    room_type = models.CharField(max_length=50, default='Single')
    created_at = models.DateTimeField(auto_now_add=True)

class Inquiry(models.Model):
    user_name = models.CharField(max_length=150)
    user_phone = models.CharField(max_length=50)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='inquiries')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Review(models.Model):
    user_name = models.CharField(max_length=150)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='reviews')
    rating = models.FloatField(default=5.0)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Complaint(models.Model):
    user_name = models.CharField(max_length=150)
    issue_type = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(max_length=50, default='Open')
    created_at = models.DateTimeField(auto_now_add=True)
