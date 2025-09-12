from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Allow access only if the object's owner is the requesting user.
    """

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
