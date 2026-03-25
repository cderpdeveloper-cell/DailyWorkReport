import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReports, deleteReport } from "../../api/reportApi";
import type { Report } from "../../types";
import { Button } from "../../components/ui/Button";
import { Plus, Edit2, Trash, Eye, Calendar, Clock } from "lucide-react";
import toast from "react-hot-toast";

export const ReportList: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const { data } = await getReports();
      setReports(data);
    } catch (error) {
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteReport(id);
        toast.success("Report deleted successfully");
        fetchReports();
      } catch (error) {
        toast.error("Failed to delete report");
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading reports...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Work Reports</h2>
          <p className="text-gray-500">Manage your daily work entries and time logs</p>
        </div>
        <Link to="/reports/create">
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            Create Report
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {reports.length === 0 ? (
          <div className="card text-center py-12 text-gray-500">
            No reports found. Create your first report to get started!
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="card hover:shadow-md transition-shadow flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{new Date(report.reportDate).toLocaleDateString()}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {report.works?.length || 0} Entries
                    </span>
                    <span>•</span>
                    <span>Created: {new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/reports/view/${report.id}`}>
                    <Button variant="secondary" title="View Report" className="p-3 h-12 w-12 text-emerald-600 border-emerald-100 hover:bg-emerald-50">
                        <Eye className="w-6 h-6" />
                    </Button>
                </Link>
                <Link to={`/reports/edit/${report.id}`}>
                  <Button variant="secondary" title="Edit Report" className="p-3 h-12 w-12 text-blue-600 border-blue-100 hover:bg-blue-50">
                    <Edit2 className="w-6 h-6" />
                  </Button>
                </Link>
                <Button variant="danger" title="Delete Report" className="p-3 h-12 w-12 text-red-600 bg-red-50 hover:bg-red-100 border-none" onClick={() => handleDelete(report.id)}>
                  <Trash className="w-6 h-6" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
