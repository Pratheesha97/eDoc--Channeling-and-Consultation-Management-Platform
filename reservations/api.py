from reservations.models import User, Patient, Doctor, Staff, Appointment, WorkSchedule, Prescription, TreatmentPlan
from rest_framework import viewsets, permissions
from .serializers import UserSerializer, PatientSerializer, DoctorSerializer, StaffSerializer, AppointmentSerializer, WorkScheduleSerializer, PrescriptionSerializer, TreatmentPlanSerializer
from rest_framework.parsers import MultiPartParser, FormParser

#User Viewset
class UserViewSet (viewsets.ModelViewSet):
    
    permission_classes = [
        permissions.IsAuthenticated 
    ]
    serializer_class = UserSerializer

    def get_object(self, queryset=None):
        return self.request.user

#User Non Auth Viewset
class UserNonAuthViewSet (viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [
        permissions.AllowAny 
    ]
    serializer_class = UserSerializer

#Patient Viewset
class PatientViewSet (viewsets.ModelViewSet):
    parser_classes = (MultiPartParser, FormParser)
    
    
    permission_classes = [
       
        permissions.IsAuthenticated 
    ]
    serializer_class = PatientSerializer

    def get_queryset(self):
        return Patient.objects.filter(user=self.request.user)
        
    def perform_create(self,serializer):
        serializer.save(owner=self.request.user)

#Patient NonAuthViewset
class PatientNonAuthViewSet (viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    permission_classes = [
        permissions.AllowAny 
    ]
    serializer_class = PatientSerializer

#Doctor Viewset
class DoctorViewSet (viewsets.ModelViewSet):
    
    permission_classes = [
        permissions.IsAuthenticated 
    ]
    serializer_class = DoctorSerializer

    def get_queryset(self):
        return Doctor.objects.filter(user=self.request.user)

    def perform_create(self,serializer):
        serializer.save(owner=self.request.user)

#Doctor NonAuthViewset
class DoctorNonAuthViewSet (viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    permission_classes = [
        permissions.AllowAny 
    ]
    serializer_class = DoctorSerializer

#Staff Viewset
class StaffViewSet (viewsets.ModelViewSet):
    
    permission_classes = [
        permissions.IsAuthenticated 
    ]
    serializer_class = StaffSerializer

    def get_queryset(self):
        return Staff.objects.filter(user=self.request.user)

    def perform_create(self,serializer):
        serializer.save(owner=self.request.user)

#Staff NonAuthViewset
class StaffNonAuthViewSet (viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    permission_classes = [
        permissions.AllowAny 
    ]
    serializer_class = StaffSerializer

#Appointment Viewset
class AppointmentViewSet (viewsets.ModelViewSet):
    
    permission_classes = [
        permissions.IsAuthenticated 
    ]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        return self.request.user.appointment_patientID.all()

    def perform_create(self,serializer):
        serializer.save(doctorID=self.request.user)

#Appointment NonAuthViewset
class AppointmentNonAuthViewSet (viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    permission_classes = [
        permissions.AllowAny 
    ]
    serializer_class = AppointmentSerializer


#WorkSchedule Viewset
class WorkScheduleViewSet (viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated 
    ]
    serializer_class = WorkScheduleSerializer
    def get_queryset(self):
        return self.request.user.work_doctorID.all()
    def perform_create(self,serializer):
        serializer.save(doctorID=self.request.user) 


#WorkSchedule NonAuthViewset
class WorkScheduleNonAuthViewSet (viewsets.ModelViewSet):
    queryset = WorkSchedule.objects.all()
    permission_classes = [
        permissions.AllowAny 
    ]
    serializer_class = WorkScheduleSerializer

#Prescription Viewset
class PrescriptionViewSet (viewsets.ModelViewSet):
    
    permission_classes = [
        permissions.IsAuthenticated 
    ]
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        return self.request.user.reservations.all()

    def perform_create(self,serializer):
        serializer.save(owner=self.request.user)

#Prescription NonAuthViewset
class PrescriptionNonAuthViewSet (viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    permission_classes = [
        permissions.AllowAny 
    ]
    serializer_class = PrescriptionSerializer

#TreatmentPlan Viewset
class TreatmentPlanViewSet (viewsets.ModelViewSet):
   
    permission_classes = [
        permissions.IsAuthenticated 
    ]
    serializer_class = TreatmentPlanSerializer

    def get_queryset(self):
        return self.request.user.reservations.all()

    def perform_create(self,serializer):
        serializer.save(owner=self.request.user)

#TreatmentPlan NonAuthViewset
class TreatmentPlanNonAuthViewSet (viewsets.ModelViewSet):
    queryset = TreatmentPlan.objects.all()
    permission_classes = [
        permissions.AllowAny 
    ]
    serializer_class = TreatmentPlanSerializer





    
