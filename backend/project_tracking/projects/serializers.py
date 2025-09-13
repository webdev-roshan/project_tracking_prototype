from rest_framework import serializers
from .models import Project, Task


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "owner",
            "name",
            "description",
            "categories",
            "is_owner",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
        ]
        read_only_fields = [
            "id",
            "owner",
            "is_owner",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
        ]


class TaskSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "project",
            "owner",
            "title",
            "description",
            "status",
            "due_date",
            "created_by",
            "updated_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "owner",
            "created_by",
            "updated_by",
            "created_at",
            "updated_at",
        ]
