from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from reservations.models import Patient, Doctor, Staff

from django.conf import settings
from django.contrib.auth.forms import SetPasswordForm


User = get_user_model()

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name')

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password') 
        extra_kwargs = { 'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user( validated_data['email'], validated_data['password']) 
        
        return user

# Login Serializer
class LoginSerializer(serializers.Serializer): 
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data) #authenticate - imported
        if user and user.is_active: 
            return user
        raise serializers.ValidationError("Incorrect Credentials")

#==============================================================================Register Serializers================================================================================================================

# Patient Register Serializer
class PatientRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'last_name', 'first_name', 'password') 
        extra_kwargs = { 'password': {'write_only': True}} 
    def create(self, validated_data):
        user = User.objects.create_user( validated_data['email'], validated_data['last_name'], validated_data['first_name'], validated_data['password']  ) 
        user.is_patient=True
        user.save()
        Patient.objects.create(email=user.email,user=user,title="",fname=user.first_name,lname=user.last_name)
        return user

# Doctor Register Serializer
class DoctorRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'last_name', 'first_name', 'password') 
        extra_kwargs = { 'password': {'write_only': True}} 

    def create(self, validated_data):
        user = User.objects.create_user( validated_data['email'], validated_data['last_name'], validated_data['first_name'], validated_data['password']) 
        user.is_doctor=True
        user.save()
        Doctor.objects.create(email=user.email,user=user,created_at=user.date_joined, doctorFName=user.first_name, doctorLName=user.last_name)
        return user

# Staff Register Serializer
class StaffRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password') 
        extra_kwargs = { 'password': {'write_only': True}} 

    def create(self, validated_data):
        user = User.objects.create_user( validated_data['email'], validated_data['password']) 
        user.is_hospStaff=True
        user.save()
        Staff.objects.create(email=user.email,user=user,created_at=user.created_at,sTitle="", sFname=user.first_name, sLname=user.last_name)
        return user

#==============================================================================Login Serializers================================================================================================================

# Patient Login Serializer
class PatientLoginSerializer(serializers.Serializer): 
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data) #authenticate - imported
        if user and user.is_active and user.is_patient: 
            return user
        raise serializers.ValidationError("Incorrect Credentials")

# Doctor Login Serializer
class DoctorLoginSerializer(serializers.Serializer): 
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data) #authenticate - imported
        if user and user.is_active and user.is_doctor: 
            return user
        raise serializers.ValidationError("Incorrect Credentials")

# Staff Login Serializer
class StaffLoginSerializer(serializers.Serializer): 
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data) #authenticate - imported
        if user and user.is_active and user.is_hospStaff: 
            return user
        raise serializers.ValidationError("Incorrect Credentials")


#========================================= Change Password =================================================
class PasswordChangeSerializer(serializers.Serializer):

    old_password = serializers.CharField(max_length=128)
    new_password1 = serializers.CharField(max_length=128)
    new_password2 = serializers.CharField(max_length=128)

    set_password_form_class = SetPasswordForm

    def __init__(self, *args, **kwargs):
        self.old_password_field_enabled = getattr(
            settings, 'OLD_PASSWORD_FIELD_ENABLED', False
        )
        self.logout_on_password_change = getattr(
            settings, 'LOGOUT_ON_PASSWORD_CHANGE', False
        )
        super(PasswordChangeSerializer, self).__init__(*args, **kwargs)

        if not self.old_password_field_enabled:
            self.fields.pop('old_password')

        self.request = self.context.get('request')
        self.user = getattr(self.request, 'user', None)

    def validate_old_password(self, value):
        invalid_password_conditions = (
            self.old_password_field_enabled,
            self.user,
            not self.user.check_password(value)
        )

        if all(invalid_password_conditions):
            raise serializers.ValidationError('Invalid password')
        return value

    def validate(self, attrs):
        self.set_password_form = self.set_password_form_class(
            user=self.user, data=attrs
        )

        if not self.set_password_form.is_valid():
            raise serializers.ValidationError(self.set_password_form.errors)
        return attrs

    def save(self):
        self.set_password_form.save()
        if not self.logout_on_password_change:
            from django.contrib.auth import update_session_auth_hash
            update_session_auth_hash(self.request, self.user)