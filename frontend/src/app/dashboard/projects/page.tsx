"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit3, Save, X, Plus, FolderOpen, CheckSquare } from "lucide-react";
import Navigation from "@/components/Navigation";
import {
    useCreateProject,
    useGetProjects,
    useUpdateProject,
    useDeleteProject,
    Project,
} from "@/hooks/useProject";

export default function ProjectManager() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState("personal");

    const createMutation = useCreateProject();
    const updateMutation = useUpdateProject();
    const deleteMutation = useDeleteProject();

    const CATEGORY_CHOICES = [
        { value: "personal", label: "Personal", color: "bg-blue-100 text-blue-800", icon: "👤" },
        { value: "work", label: "Work", color: "bg-green-100 text-green-800", icon: "💼" },
        { value: "hobby", label: "Hobby", color: "bg-purple-100 text-purple-800", icon: "🎨" },
        { value: "other", label: "Other", color: "bg-gray-100 text-gray-800", icon: "📦" },
    ];

    const getCategoryInfo = (category: string) => {
        return CATEGORY_CHOICES.find(cat => cat.value === category) || CATEGORY_CHOICES[3];
    };

    const handleCreate = () => {
        if (!name.trim()) return;
        createMutation.mutate({ name, description, categories });
        setName("");
        setDescription("");
        setCategories("personal");
    };

    const { data: projects, isLoading, isError } = useGetProjects();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editCategory, setEditCategory] = useState("personal");

    const startEdit = (project: Project) => {
        setEditingId(project.id);
        setEditName(project.name);
        setEditDescription(project.description);
        setEditCategory(project.categories);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const saveEdit = (id: number) => {
        updateMutation.mutate({
            id,
            name: editName,
            description: editDescription,
            categories: editCategory,
        });
        setEditingId(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600 text-lg">Loading projects...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <X className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error loading projects</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>Unable to fetch your projects. Please try again later.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <FolderOpen className="mr-3 h-8 w-8 text-blue-600" />
                        Project Manager
                    </h1>
                    <p className="mt-2 text-gray-600">Organize and manage your projects efficiently</p>
                </div>

                {/* Projects Grid */}
                <div className="mb-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Projects</h2>
                    {projects && projects.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => {
                                const categoryInfo = getCategoryInfo(project.categories);
                                return (
                                    <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                        {editingId === project.id ? (
                                            // Edit form
                                            <div className="space-y-4">
                                                <input
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    placeholder="Project Name"
                                                />
                                                <textarea
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                    rows={3}
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    placeholder="Description"
                                                />
                                                <select
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    value={editCategory}
                                                    onChange={(e) => setEditCategory(e.target.value)}
                                                >
                                                    {CATEGORY_CHOICES.map((cat) => (
                                                        <option key={cat.value} value={cat.value}>
                                                            {cat.icon} {cat.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => saveEdit(project.id)}
                                                        disabled={updateMutation.isPending}
                                                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 flex items-center justify-center"
                                                    >
                                                        <Save className="w-4 h-4 mr-2" />
                                                        {updateMutation.isPending ? "Saving..." : "Save"}
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center"
                                                    >
                                                        <X className="w-4 h-4 mr-2" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Display mode
                                            <div>
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                                                        <span className="mr-1">{categoryInfo.icon}</span>
                                                        {categoryInfo.label}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>

                                                <div className="pt-4 border-t border-gray-100">
                                                    <button
                                                        onClick={() => router.push(`/dashboard/projects/tasks?projectId=${project.id}`)}
                                                        className="w-full bg-green-50 text-green-700 px-3 py-2 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center text-sm font-medium mb-2"
                                                    >
                                                        <CheckSquare className="w-4 h-4 mr-2" />
                                                        View Tasks
                                                    </button>
                                                    {project.is_owner && (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => startEdit(project)}
                                                                className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center text-sm font-medium"
                                                            >
                                                                <Edit3 className="w-4 h-4 mr-2" />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => deleteMutation.mutate(project.id)}
                                                                disabled={deleteMutation.isPending}
                                                                className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center text-sm font-medium"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
                            <p className="mt-2 text-gray-500">Get started by creating your first project below.</p>
                        </div>
                    )}
                </div>

                {/* Create New Project Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <Plus className="mr-2 h-5 w-5 text-blue-600" />
                        Create New Project
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Name *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter project name..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                placeholder="Describe your project..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                value={categories}
                                onChange={(e) => setCategories(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {CATEGORY_CHOICES.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.icon} {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={handleCreate}
                            disabled={createMutation.isPending}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center font-medium"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            {createMutation.isPending ? "Creating..." : "Create Project"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}