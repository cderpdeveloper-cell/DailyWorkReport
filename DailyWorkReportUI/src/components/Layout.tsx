import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, FileText, ClipboardList, Tag, Settings, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export const Layout: React.FC = () => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const navItems = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "Reports", path: "/reports", icon: FileText },
        { name: "Project Master", path: "/projects", icon: ClipboardList },
        { name: "Status Master", path: "/statuses", icon: Tag },
        { name: "Email Config", path: "/emails", icon: Settings },
    ];

    const getPageTitle = () => {
        if (location.pathname.startsWith("/reports/create")) return "Create Report";
        if (location.pathname.startsWith("/reports/edit")) return "Edit Report";
        if (location.pathname.startsWith("/reports")) return "Work Reports";
        if (location.pathname.startsWith("/projects")) return "Project Master";
        if (location.pathname.startsWith("/statuses")) return "Status Master";
        if (location.pathname.startsWith("/emails")) return "Email Configuration";
        return "Dashboard";
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-blue-600 tracking-tight">DailyWorkReport</h1>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.path === "/"
                            ? location.pathname === "/"
                            : location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    isActive
                                        ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <Icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info & Logout at bottom of sidebar */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="h-9 w-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user?.username}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
                    <h2 className="text-lg font-medium text-gray-800">
                        {getPageTitle()}
                    </h2>
                </header>
                <div className="flex-1 overflow-y-auto p-8 text-black">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
