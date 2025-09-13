"use client"

import { useMe } from "@/hooks/useAuth"
import { useGetProjects } from "@/hooks/useProject"
import { useRouter } from "next/navigation"
import Navigation from "@/components/Navigation"
import { 
    FolderOpen, 
    CheckSquare, 
    Plus, 
    TrendingUp, 
    Calendar,
    ArrowRight,
    BarChart3
} from "lucide-react"

export default function Dashboard() {
    const { data: user, isLoading: userLoading, isError: userError } = useMe()
    const { data: projects, isLoading: projectsLoading } = useGetProjects()
    const router = useRouter()

    if (userLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600 text-lg">Loading dashboard...</span>
                </div>
            </div>
        )
    }

    if (userError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
                    <p className="mt-2 text-sm text-red-700">Unable to load your dashboard. Please try again later.</p>
                </div>
            </div>
        )
    }

    const totalProjects = projects?.length || 0
    const totalTasks = 0 // TODO: Implement task counting when tasks are available
    const recentProjects = projects?.slice(0, 3) || []

    const stats = [
        {
            name: "Total Projects",
            value: totalProjects,
            icon: FolderOpen,
            color: "bg-blue-500",
            change: "+12%",
            changeType: "positive"
        },
        {
            name: "Total Tasks",
            value: totalTasks,
            icon: CheckSquare,
            color: "bg-green-500",
            change: "+8%",
            changeType: "positive"
        },
        {
            name: "Completed Tasks",
            value: Math.floor(totalTasks * 0.7), // Mock data
            icon: TrendingUp,
            color: "bg-purple-500",
            change: "+15%",
            changeType: "positive"
        },
        {
            name: "Active Projects",
            value: Math.floor(totalProjects * 0.8), // Mock data
            icon: BarChart3,
            color: "bg-orange-500",
            change: "+5%",
            changeType: "positive"
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.first_name || "User"}! 👋
                    </h1>
                    <p className="text-gray-600">
                        Here's what's happening with your projects today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-full ${stat.color}`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center">
                                    <span className={`text-sm font-medium ${
                                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {stat.change}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Projects */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
                                    <button
                                        onClick={() => router.push('/dashboard/projects')}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                                    >
                                        View all
                                        <ArrowRight className="h-4 w-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                {projectsLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : recentProjects.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentProjects.map((project) => (
                                            <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <FolderOpen className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                                                        <p className="text-sm text-gray-500">{project.description}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => router.push(`/dashboard/projects/tasks?projectId=${project.id}`)}
                                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                >
                                                    View Tasks
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
                                        <p className="mt-2 text-gray-500">Get started by creating your first project.</p>
                                        <button
                                            onClick={() => router.push('/dashboard/projects')}
                                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Create Project
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <button
                                    onClick={() => router.push('/dashboard/projects')}
                                    className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Plus className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-medium text-gray-900">Create Project</h3>
                                        <p className="text-sm text-gray-500">Start a new project</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => router.push('/dashboard/projects')}
                                    className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckSquare className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-medium text-gray-900">View Tasks</h3>
                                        <p className="text-sm text-gray-500">Manage your tasks</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => router.push('/dashboard/projects')}
                                    className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <BarChart3 className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-medium text-gray-900">View Analytics</h3>
                                        <p className="text-sm text-gray-500">Track your progress</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Upcoming Tasks */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
                            </div>
                            <div className="p-6">
                                <div className="text-center py-8">
                                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No upcoming tasks</h3>
                                    <p className="mt-2 text-gray-500">Create some tasks to see them here.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
