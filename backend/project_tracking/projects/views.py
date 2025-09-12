from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer
from .permissions import IsOwner


class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(
            owner=self.request.user,
            created_by=self.request.user,
            updated_by=self.request.user,
        )


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    queryset = Project.objects.all()

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs["project_id"]
        return Task.objects.filter(
            project__id=project_id, project__owner=self.request.user
        )

    def perform_create(self, serializer):
        project_id = self.kwargs["project_id"]
        project = get_object_or_404(Project, id=project_id, owner=self.request.user)
        serializer.save(
            project=project,
            owner=self.request.user,
            created_by=self.request.user,
            updated_by=self.request.user,
        )


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    queryset = Task.objects.all()

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
