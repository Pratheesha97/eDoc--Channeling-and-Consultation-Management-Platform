from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from django.core.validators import MinLengthValidator 

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import ugettext_lazy as _


# Create your models here.
class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, last_name, first_name, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('You must provide an email address')
        if not first_name:
            raise ValueError('You must provide First Name')
        if not last_name:
            raise ValueError('You must provide Last Name')
        
        email = self.normalize_email(email)
        user = self.model(email=email, last_name=last_name, first_name=first_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, last_name, first_name, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, last_name, first_name, password, **extra_fields)

    def create_superuser(self, email, last_name, first_name, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must be assigned to is_superuser=True.')

        return self._create_user(email, last_name, first_name, password, **extra_fields)

class User(AbstractUser):
    """User model."""
    is_patient = models.BooleanField(default=False)
    is_doctor = models.BooleanField(default=False)
    is_hospStaff = models.BooleanField(default=False)

    username = None
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    # is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

class Patient(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE, related_name="user_patient", primary_key = True)
    #patientID = models.CharField(max_length=6, validators=[MinLengthValidator(6)], unique=True, null=False, blank=False, primary_key=True)
    patientImage = models.ImageField( null=True, max_length=300, blank=True, upload_to="patient_profile_images")
    title = models.CharField(max_length=10, blank=True)
    fname = models.CharField(max_length=100,null=False)
    lname = models.CharField(max_length=100,null=False)
    gender = models.CharField(max_length=10, blank=True, default="") 
    Identification = models.CharField (max_length=20, unique=True, blank=True, null=True) #NIC or Passport
    dob = models.CharField(max_length=300, null=True, blank=True) 
    Nationality = models.CharField(max_length=50, blank=True, default="")
    Address = models.CharField(max_length=500, blank=True, default="")
    email = models.EmailField(max_length=100, unique=True,null=False, default="")
    phone = models.CharField(blank=True, max_length=15, null=True)
    created_at = models.DateTimeField(auto_now_add=True) 

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE, related_name="user_doctor", primary_key = True)
    
    #doctorID = models.CharField(max_length=6, validators=[MinLengthValidator(6)], unique=True, null=False, blank=False, primary_key=True)
    doctorImage = models.ImageField(null=True, max_length=300, blank=True, upload_to="doctor_profile_images")
    doctorFName = models.CharField(max_length=100, null=False)
    doctorLName = models.CharField(max_length=100, null=False)
    doctorGender = models.CharField(max_length=10, default="-")
    doctorNationality = models.CharField(max_length=50)
    doctorIdentification = models.CharField (max_length=20, unique=True,null=True) #NIC or Passport
    Specialization = models.CharField(max_length=50,null=False)
    Qualifications = models.CharField(max_length=500, null=True)
    chargePerSession = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    email = models.EmailField(max_length=100, unique=True, null=False)
    doctorPhone = models.CharField( blank=True, max_length=15, null=True )
    created_at = models.DateTimeField(auto_now_add=True) 

class Staff(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE, related_name="user_staff", primary_key = True)
    sImage = models.ImageField(null=True, max_length=300, blank=True, upload_to="staff_profile_images")
    sTitle = models.CharField(max_length=10)
    sFname = models.CharField(max_length=100,null=False)
    sLname = models.CharField(max_length=100,null=False)
    sDesignation = models.CharField(max_length=100,null=False)
    sAddress = models.CharField(max_length=500, blank=True, default="")
    sPhone = models.CharField(blank=True,  max_length=15, default="")
    email = models.EmailField(max_length=100, unique=True,null=False)
    created_at = models.DateTimeField(auto_now_add=True) 
    

class WorkSchedule(models.Model):
    ID = models.AutoField(primary_key=True)
    doctorID = models.ForeignKey(User, db_column="doctorID", related_name="work_doctorID", on_delete=models.CASCADE)
    day = models.CharField(max_length=25) #Monday,Tuesday,Wednesday etc....
    timeSlot = models.CharField(max_length=25) #Morning, Afternoon, Evening, Night etc...
    time = models.CharField(max_length=25) #9.00am, 10.00am etc...
    appointmentLimit = models.CharField(max_length=3, blank=True)

class Appointment(models.Model):
    ReferenceID = models.CharField(max_length=6, validators=[MinLengthValidator(6)], unique=True, null=False, blank=False, primary_key=True)
    patientID = models.ForeignKey(Patient, db_column="patientID", related_name="appointment_patientID", on_delete=models.CASCADE)
    doctorID = models.ForeignKey(Doctor, db_column="doctorID", related_name="appointment_doctorID", on_delete=models.CASCADE)
    date = models.CharField(max_length=500)
    time = models.CharField(max_length=25)
    AppointmentNo = models.IntegerField()
    ChannellingFee =  models.DecimalField(max_digits=6, decimal_places=2, null=False)
    status = models.CharField(max_length=25)
    patientContactNum = models.CharField(blank=True, max_length=15, default="")
    created_at = models.DateTimeField(auto_now_add=True) 

class TreatmentPlan(models.Model):
   
    ReferenceID = models.OneToOneField(Appointment, to_field="ReferenceID", on_delete=models.CASCADE, primary_key=True, db_column="ReferenceID")
    patientID = models.ForeignKey(Patient, db_column="patientID", related_name="treatmentPlan_patientID", on_delete=models.CASCADE, default="")
    doctorID = models.ForeignKey(Doctor, db_column="doctorID", related_name="treatmentPlan_doctorID", on_delete=models.CASCADE, default="")
    presentingComplaint = models.TextField(max_length=5000, null=True, blank=True, default="None")
    investigationResults = models.TextField(max_length=5000, null=True, blank=True, default="None")
    testsToBeDone = models.TextField(max_length=5000, null=True, blank=True, default="None")
    medicalAdvices = models.TextField(max_length=5000, null=True, blank=True, default="None")
    treatDate = models.CharField(max_length=500, blank=True)

class Prescription(models.Model):
    ID = models.AutoField(primary_key=True)
    ReferenceID = models.ForeignKey(Appointment, db_column="ReferenceID", related_name="prescription_ReferenceID", on_delete=models.CASCADE, default="")
    PrescriptionID = models.CharField(max_length=8, validators=[MinLengthValidator(8)], null=False, blank=False)
    DrugName = models.CharField(max_length=80, blank=True)
    DurationCount = models.CharField(max_length=5)
    DurationType = models.CharField(max_length=10)
    DosageMorn = models.CharField(max_length=5)
    DosageAft = models.CharField(max_length=5)
    DosageEve = models.CharField(max_length=5)
    DosageNight = models.CharField(max_length=5)
    Instructions = models.CharField(max_length=25, blank=True)
    Notes = models.CharField(max_length=500, blank=True)
    


    


