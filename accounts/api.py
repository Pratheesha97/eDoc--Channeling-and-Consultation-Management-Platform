from rest_framework import generics, permissions
from rest_framework.response import Response 
from knox.models import AuthToken 
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, PatientRegisterSerializer, DoctorRegisterSerializer, StaffRegisterSerializer,  PatientLoginSerializer, DoctorLoginSerializer, StaffLoginSerializer, PasswordChangeSerializer#import the serializers we just created. 

from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import GenericAPIView

#Register API.
class RegisterAPI(generics.GenericAPIView): 
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs): 
        serializer = self.get_serializer(data=request.data)   
        serializer.is_valid(raise_exception=True) 
        user = serializer.save()
        return Response({ 
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

#Login API
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer #imported

    def post(self, request, *args, **kwargs): 
        serializer = self.get_serializer(data=request.data)    
        serializer.is_valid(raise_exception=True) 
        user = serializer.validated_data
        return Response({ 
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
            
        })

#========================================================================== REGISTER APIs ==============================================================================================================       

#Patient Register API.
class PatientRegisterAPI(generics.GenericAPIView): 
    serializer_class = PatientRegisterSerializer

    def post(self, request, *args, **kwargs): 
        serializer = self.get_serializer(data=request.data)    
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        return Response({ 
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]     
        })

#Doctor Register API.
class DoctorRegisterAPI(generics.GenericAPIView): 
    serializer_class = DoctorRegisterSerializer

    def post(self, request, *args, **kwargs): 
        serializer = self.get_serializer(data=request.data)   
        serializer.is_valid(raise_exception=True) 
        user = serializer.save()
        return Response({ 
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

#Staff Register API.
class StaffRegisterAPI(generics.GenericAPIView):
    serializer_class = StaffRegisterSerializer

    def post(self, request, *args, **kwargs):  
        serializer = self.get_serializer(data=request.data)   
        serializer.is_valid(raise_exception=True) 
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })



#========================================================================== LOGIN APIs ==============================================================================================================       

#Patient Login API
class PatientLoginAPI(generics.GenericAPIView):
    serializer_class = PatientLoginSerializer #imported

    def post(self, request, *args, **kwargs): 
        serializer = self.get_serializer(data=request.data)    
        serializer.is_valid(raise_exception=True) 
        user = serializer.validated_data
        return Response({ 
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
            
        })

#DoctorLogin API
class DoctorLoginAPI(generics.GenericAPIView):
    serializer_class = DoctorLoginSerializer #imported

    def post(self, request, *args, **kwargs): 
        serializer = self.get_serializer(data=request.data)    
        serializer.is_valid(raise_exception=True) 
        user = serializer.validated_data
        return Response({ 
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
            
        })

#StaffLogin API
class StaffLoginAPI(generics.GenericAPIView):
    serializer_class = StaffLoginSerializer #imported

    def post(self, request, *args, **kwargs): 
        serializer = self.get_serializer(data=request.data)    
        serializer.is_valid(raise_exception=True) 
        user = serializer.validated_data
        return Response({ 
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
            
        })

#==================================================================== User API ====================================================================================

#Get User API
class UserAPI(generics.RetrieveAPIView): 
    permission_classes=[
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self): 
        return self.request.user

#==================================================== Password Change API =============================================================
class PasswordChangeView(GenericAPIView):

    """
    Calls Django Auth SetPasswordForm save method.
    Accepts the following POST parameters: new_password1, new_password2
    Returns the success/fail message.
    """

    serializer_class = PasswordChangeSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": "New password has been saved."})