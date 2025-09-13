from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import CustomUser
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from .authentication import CookieJWTAuthentication
from rest_framework.permissions import AllowAny


def set_jwt_cookies(response, refresh_token: RefreshToken):
    response.set_cookie(
        key="access_token",
        value=str(refresh_token.access_token),
        httponly=True,
        samesite="Lax",
        secure=False,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=str(refresh_token),
        httponly=True,
        samesite="Lax",
        secure=False,
        path="/",
    )


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        response = Response(
            {"user": UserSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )
        set_jwt_cookies(response, refresh)
        return response


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        response = Response({"user": UserSerializer(user).data})
        set_jwt_cookies(response, refresh)
        return response


class LogoutView(APIView):
    authentication_classes = [CookieJWTAuthentication]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        response = Response(status=status.HTTP_205_RESET_CONTENT)

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError:
                pass

        response.delete_cookie("access_token", path="/")
        response.delete_cookie("refresh_token", path="/")
        response.data = {"detail": "Logout successful"}
        return response


class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response(
                {"detail": "No refresh token"}, status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            refresh = RefreshToken(refresh_token)
            new_access_token = refresh.access_token

            response = Response({"detail": "Access token refreshed"})
            response.set_cookie(
                key="access_token",
                value=str(new_access_token),
                httponly=True,
                samesite="Lax",
                secure=False,
                path="/",
            )
            return response

        except TokenError:
            return Response(
                {"detail": "Refresh token expired"}, status=status.HTTP_401_UNAUTHORIZED
            )


class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
