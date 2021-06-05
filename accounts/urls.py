from django.urls import path, include
from .api import RegisterAPI, PatientRegisterAPI, DoctorRegisterAPI, StaffRegisterAPI, LoginAPI, UserAPI, PatientLoginAPI, DoctorLoginAPI, StaffLoginAPI,PasswordChangeView
from knox import views as knox_views

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('api/auth/user', UserAPI.as_view()),
    path('api/auth/register', RegisterAPI.as_view()), 
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/patient_register', PatientRegisterAPI.as_view()),
    path('api/auth/doctor_register', DoctorRegisterAPI.as_view()),
    path('api/auth/staff_register', StaffRegisterAPI.as_view()),
    path('api/auth/patient_login', PatientLoginAPI.as_view()),
    path('api/auth/doctor_login', DoctorLoginAPI.as_view()),
    path('api/auth/staff_login', StaffLoginAPI.as_view()),
    path('api/auth/password/change', PasswordChangeView.as_view(),
        name='rest_password_change'),
    path('api/auth/logout', knox_views.LogoutView.as_view(), name = 'knox_logout') #LogoutAllView - Logout All users. instead we use LogoutView. We're gonna give a name as well. 
    #The above line will Invalidate (Destroy - Can't use again) the Token (simply logout). So they will have to log in again to get a new Token. 
]
