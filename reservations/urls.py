from rest_framework import routers
from .api import UserViewSet, UserNonAuthViewSet, PatientViewSet, PatientNonAuthViewSet, DoctorViewSet, DoctorNonAuthViewSet, StaffViewSet, StaffNonAuthViewSet, AppointmentViewSet, AppointmentNonAuthViewSet, WorkScheduleViewSet, WorkScheduleNonAuthViewSet,  PrescriptionViewSet, PrescriptionNonAuthViewSet, TreatmentPlanViewSet, TreatmentPlanNonAuthViewSet

router = routers.DefaultRouter()

router.register('api/user', UserViewSet, 'user')
router.register('api/userNonAuth', UserNonAuthViewSet, 'userNonAuth')
router.register('api/patient', PatientViewSet, 'patient')
router.register('api/patientNonAuth', PatientNonAuthViewSet,'patientNonAuth')
router.register('api/doctor', DoctorViewSet,'doctor')
router.register('api/doctorNonAuth', DoctorNonAuthViewSet,'doctorNonAuth')
router.register('api/staff', StaffViewSet,'staff')
router.register('api/staffNonAuth', StaffNonAuthViewSet,'staffNonAuth')
router.register('api/appointment', AppointmentViewSet, 'appointment')
router.register('api/appointmentNonAuth', AppointmentNonAuthViewSet, 'appointmentNonAuth')
router.register('api/workSchedule', WorkScheduleViewSet, 'workSchedule')
router.register('api/workScheduleNonAuth', WorkScheduleNonAuthViewSet, 'workScheduleNonAuth')
router.register('api/prescription', PrescriptionViewSet, 'prescription')
router.register('api/prescriptionNonAuth', PrescriptionNonAuthViewSet, 'prescriptionNonAuth')
router.register('api/treatmentPlan', TreatmentPlanViewSet, 'treatmentPlan')
router.register('api/treatmentPlanNonAuth', TreatmentPlanNonAuthViewSet, 'treatmentPlanNonAuth')


urlpatterns = router.urls

