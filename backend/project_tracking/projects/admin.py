from django.contrib import admin
from .models import Project, Task


class TaskInline(admin.TabularInline):
    model = Task
    extra = 0
    readonly_fields = ("created_by", "updated_by", "created_at", "updated_at")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "owner",
        "categories",
        "is_owner",
        "created_by",
        "updated_by",
        "created_at",
        "updated_at",
    )
    list_filter = ("categories", "is_owner", "created_at", "updated_at")
    search_fields = ("name", "description", "owner__email", "created_by__email")
    ordering = ("-created_at",)
    readonly_fields = ("created_by", "updated_by", "created_at", "updated_at")
    inlines = [TaskInline]

    fieldsets = (
        (None, {"fields": ("name", "description", "categories", "owner", "is_owner")}),
        (
            "Audit Info",
            {"fields": ("created_by", "updated_by", "created_at", "updated_at")},
        ),
    )


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "project",
        "owner",
        "status",
        "due_date",
        "created_by",
        "updated_by",
        "created_at",
        "updated_at",
    )
    list_filter = ("status", "due_date", "project", "owner")
    search_fields = ("title", "description", "owner__email", "project__name")
    ordering = ("-created_at",)
    readonly_fields = ("created_by", "updated_by", "created_at", "updated_at")
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "title",
                    "description",
                    "status",
                    "due_date",
                    "project",
                    "owner",
                )
            },
        ),
        (
            "Audit Info",
            {"fields": ("created_by", "updated_by", "created_at", "updated_at")},
        ),
    )
