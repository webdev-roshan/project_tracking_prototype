"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLogout, useMe } from "@/hooks/useAuth";
import { 
    FolderOpen, 
    LayoutDashboard, 
    FolderPlus, 
    CheckSquare, 
    LogOut, 
    User,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";

export default function Navigation() {
    const router = useRouter();
    const pathname = usePathname();
    const { data: user } = useMe();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { mutate: logout, isPending: isLoggingOut } = useLogout({
        onSuccess: () => {
            router.push("/login");
        },
    });

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Projects", href: "/dashboard/projects", icon: FolderPlus },
    ];

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                        >
                            <FolderOpen className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">ProjectTracker</span>
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => router.push(item.href)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        isActive(item.href)
                                            ? "bg-blue-100 text-blue-700"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-700">
                            <User className="h-4 w-4" />
                            <span>
                                {user?.first_name && user?.last_name
                                    ? `${user.first_name} ${user.last_name}`
                                    : user?.email || "User"}
                            </span>
                        </div>
                        <button
                            onClick={() => logout()}
                            disabled={isLoggingOut}
                            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <div className="space-y-2">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            router.push(item.href);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            isActive(item.href)
                                                ? "bg-blue-100 text-blue-700"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center space-x-2 text-sm text-gray-700 mb-3">
                                <User className="h-4 w-4" />
                                <span>
                                    {user?.first_name && user?.last_name
                                        ? `${user.first_name} ${user.last_name}`
                                        : user?.email || "User"}
                                </span>
                            </div>
                            <button
                                onClick={() => logout()}
                                disabled={isLoggingOut}
                                className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
