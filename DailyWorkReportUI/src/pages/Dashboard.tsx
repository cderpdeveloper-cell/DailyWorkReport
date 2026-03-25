import React, { useEffect, useState } from "react";
import { LayoutDashboard, FileText, CheckCircle2, Clock } from "lucide-react";
import { getDashboardStats } from "../api/dashboardApi";
import type { DashboardStats } from "../api/dashboardApi";
import toast from "react-hot-toast";

export const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        activeReports: 0,
        completedProjects: 0,
        totalHours: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await getDashboardStats();
                setStats(data);
            } catch (error) {
                toast.error("Failed to fetch dashboard stats");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statItems = [
        { label: "Active Reports", value: stats.activeReports.toString(), icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Completed Projects", value: stats.completedProjects.toString(), icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
        { label: "Total Hours", value: `${stats.totalHours}h`, icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
    ];

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statItems.map((stat, i) => (
                    <div key={i} className="card flex items-center gap-6 group hover:border-blue-200 transition-colors cursor-default">
                        <div className={`h-14 w-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card text-center py-20 bg-linear-to-br from-white to-blue-50">
                <LayoutDashboard size={64} className="mx-auto text-blue-200 mb-6" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to your Daily Work Report dashboard</h3>
                <p className="text-gray-500 max-w-md mx-auto">Track your daily tasks, manage projects, and analyze work patterns with ease.</p>
            </div>
        </div>
    );
};
