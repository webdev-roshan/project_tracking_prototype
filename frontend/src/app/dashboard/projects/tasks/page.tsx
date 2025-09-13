"use client"

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Trash2, Edit3, Save, X, Plus, CheckSquare, Clock, Calendar, ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import {
    useCreateTask,
    useGetTasks,
    useUpdateTask,
    useDeleteTask,
    Task,
} from "@/hooks/useTask";
import { useGetProjects } from "@/hooks/useProject";

export default function TaskManager() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const projectId = parseInt(searchParams.get('projectId') || '0');
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("todo");
    const [dueDate, setDueDate] = useState("");

    const createMutation = useCreateTask(projectId);
    const updateMutation = useUpdateTask(projectId);
    const deleteMutation = useDeleteTask(projectId);

    const { data: projects } = useGetProjects();
    const currentProject = projects?.find(p => p.id === projectId);

    const STATUS_CHOICES = [
        { value: "todo", label: "To Do", color: "bg-gray-100 text-gray-800", icon: "📋" },
        { value: "in_progress", label: "In Progress", color: "bg-blue-100 text-blue-800", icon: "🔄" },
        { value: "done", label: "Done", color: "bg-green-100 text-green-800", icon: "✅" },
    ];

    const getStatusInfo = (status: string) => {
        return STATUS_CHOICES.find(s => s.value === status) || STATUS_CHOICES[0];
    };

    const handleCreate = () => {
        if (!title.trim()) return;
        createMutation.mutate({ 
            title, 
            description, 
            status,
            due_date: dueDate || undefined
        });
        setTitle("");
        setDescription("");
        setStatus("todo");
        setDueDate("");
    };

    const { data: tasks, isLoading, isError } = useGetTasks(projectId);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editStatus, setEditStatus] = useState("todo");
    const [editDueDate, setEditDueDate] = useState("");

    const startEdit = (task: Task) => {
        setEditingId(task.id);
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditStatus(task.status);
        setEditDueDate(task.due_date || "");
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const saveEdit = (id: number) => {
        updateMutation.mutate({
            id,
            title: editTitle,
            description: editDescription,
            status: editStatus,
            due_date: editDueDate || undefined,
        });
        setEditingId(null);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString();
    };

    const isOverdue = (dueDate: string) => {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
    };

    if (!projectId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <X className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">No Project Selected</h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>Please select a project to view its tasks.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600 text-lg">Loading tasks...</span>
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
                            <h3 className="text-sm font-medium text-red-800">Error loading tasks</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>Unable to fetch tasks. Please try again later.</p>
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
                    <div className="flex items-center mb-4">
                        <button
                            onClick={() => router.push('/dashboard/projects')}
                            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                        >
                            <ArrowLeft className="h-5 w-5 mr-1" />
                            Back to Projects
                        </button>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <CheckSquare className="mr-3 h-8 w-8 text-blue-600" />
                        Task Manager
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Manage tasks for: <span className="font-semibold text-blue-600">{currentProject?.name}</span>
                    </p>
                </div>

                {/* Tasks Grid */}
                <div className="mb-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Tasks</h2>
                    {tasks && tasks.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {tasks.map((task) => {
                                const statusInfo = getStatusInfo(task.status);
                                const overdue = task.due_date ? isOverdue(task.due_date) : false;
                                return (
                                    <div key={task.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                        {editingId === task.id ? (
                                            // Edit form
                                            <div className="space-y-4">
                                                <input
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    placeholder="Task Title"
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
                                                    value={editStatus}
                                                    onChange={(e) => setEditStatus(e.target.value)}
                                                >
                                                    {STATUS_CHOICES.map((status) => (
                                                        <option key={status.value} value={status.value}>
                                                            {status.icon} {status.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="date"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    value={editDueDate}
                                                    onChange={(e) => setEditDueDate(e.target.value)}
                                                />
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => saveEdit(Number(task.id))}
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
                                                    <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                        <span className="mr-1">{statusInfo.icon}</span>
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mb-4 leading-relaxed">{task.description}</p>

                                                {task.due_date && (
                                                    <div className="flex items-center mb-4">
                                                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className={`text-sm ${overdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                                                            Due: {task.due_date ? formatDate(task.due_date) : 'No due date'}
                                                            {overdue && <span className="ml-1">(Overdue)</span>}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex space-x-2 pt-4 border-t border-gray-100">
                                                    <button
                                                        onClick={() => startEdit(task)}
                                                        className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center text-sm font-medium"
                                                    >
                                                        <Edit3 className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteMutation.mutate(Number(task.id))}
                                                        disabled={deleteMutation.isPending}
                                                        className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center text-sm font-medium"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks yet</h3>
                            <p className="mt-2 text-gray-500">Get started by creating your first task below.</p>
                        </div>
                    )}
                </div>

                {/* Create New Task Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <Plus className="mr-2 h-5 w-5 text-blue-600" />
                        Create New Task
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Task Title *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter task title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                placeholder="Describe your task..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status *
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {STATUS_CHOICES.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.icon} {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleCreate}
                            disabled={createMutation.isPending}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center font-medium"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            {createMutation.isPending ? "Creating..." : "Create Task"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
