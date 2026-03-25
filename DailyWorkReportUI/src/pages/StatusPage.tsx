import React, { useEffect, useState } from "react";
import { getStatuses, createStatus, updateStatus } from "../api/statusApi";
import type { Status } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Edit2, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export const StatusPage: React.FC = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatuses = async () => {
    try {
      const { data } = await getStatuses();
      setStatuses(data);
    } catch (error) {
      toast.error("Failed to load statuses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        await updateStatus(editingId, { name, isActive: true });
        toast.success("Status updated");
      } else {
        await createStatus({ name, isActive: true });
        toast.success("Status created");
      }
      setName("");
      setEditingId(null);
      fetchStatuses();
    } catch (error) {
      toast.error("Error saving status");
    }
  };

  const handleToggle = async (status: Status) => {
    try {
      await updateStatus(status.id, { name: status.name, isActive: !status.isActive });
      fetchStatuses();
    } catch (error) {
      toast.error("Error toggling status visibility");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-bold">Manage Status Masters</h3>
            <span className="text-xs text-gray-500 font-normal">(Running, Testing, Completed, etc.)</span>
        </div>
        <form onSubmit={handleSave} className="flex gap-4">
          <Input 
            placeholder="Status name (e.g. In Progress)..." 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <Button type="submit">
            {editingId ? "Update" : "Create"}
          </Button>
          {editingId && (
            <Button variant="secondary" onClick={() => { setEditingId(null); setName(""); }}>
              Cancel
            </Button>
          )}
        </form>
      </div>

      <div className="space-y-4">
        {statuses.map((status) => (
          <div key={status.id} className="card flex items-center justify-between p-4 bg-linear-to-r from-white to-gray-50/30">
            <div className="flex items-center gap-4">
               {status.isActive ? (
                <CheckCircle2 className="text-green-500" size={20} />
              ) : (
                <XCircle className="text-gray-400" size={20} />
              )}
              <span className={`font-medium ${!status.isActive ? 'text-gray-400 line-through' : ''}`}>
                {status.name}
              </span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                title="Edit"
                className="p-2 h-10 w-10 text-blue-600 shadow-none border-none bg-transparent hover:bg-white" 
                onClick={() => { setEditingId(status.id); setName(status.name); }}
              >
                <Edit2 size={20} />
              </Button>
              <Button 
                variant={status.isActive ? "danger" : "primary"} 
                className="p-1 px-3 text-sm h-9"
                onClick={() => handleToggle(status)}
              >
                {status.isActive ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </div>
        ))}
        {statuses.length === 0 && !loading && (
             <div className="text-center py-10 text-gray-400">No statuses defined yet.</div>
        )}
      </div>
    </div>
  );
};
