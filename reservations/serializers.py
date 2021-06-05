from rest_framework import serializers
from reservations.models import User, Patient, Doctor, Staff, Appointment, WorkSchedule, Prescription, TreatmentPlan

#User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


#Patient Serializer
class PatientSerializer(serializers.ModelSerializer):
    
    patientImage = serializers.ImageField(max_length=None, use_url=True, required=False)
    class Meta:
        model = Patient #imported from reservations.models
        fields = ('user', 'patientImage', 'title', 'fname', 'lname', 'gender', 'Identification', 'dob', 'Nationality', 'Address', 'email', 'phone', 'created_at')

#Doctor Serializer
class DoctorSerializer(serializers.ModelSerializer):

    doctorImage = serializers.ImageField(max_length=None, use_url=True, required=False)
    class Meta:
        model = Doctor 
        fields = ('user', 'doctorImage', 'doctorFName', 'doctorLName', 'doctorGender', 'doctorNationality', 'doctorIdentification', 'Specialization', 'Qualifications', 'chargePerSession', 'email', 'doctorPhone', 'created_at')

#Staff Serializer
class StaffSerializer(serializers.ModelSerializer):
    
    sImage = serializers.ImageField(max_length=None, use_url=True, required=False)
    class Meta:
        model = Staff #imported from reservations.models
        fields = ('user', 'sImage', 'sTitle', 'sFname', 'sLname', 'sDesignation', 'sAddress', 'sPhone', 'email', 'created_at')

#Appointment Serializer
class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'

#WorkSchedule Serializer
class WorkScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkSchedule
        fields = '__all__'

#Prescription Serializer
class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'

#TreatmentPlan Serializer
class TreatmentPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = TreatmentPlan
        fields = '__all__'


