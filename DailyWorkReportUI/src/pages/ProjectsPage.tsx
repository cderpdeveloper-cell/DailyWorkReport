import React, { useEffect, useState } from "react";
import { getProjects, createProject, updateProject, deleteProject } from "../api/projectApi";
import type { Project } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Edit2, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const { data } = await getProjects();
      setProjects(data);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        await updateProject(editingId, { name, color, isActive: true });
        toast.success("Project updated");
      } else {
        await createProject({ name, color, isActive: true });
        toast.success("Project created");
      }
      setName("");
      setColor("#000000");
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      toast.error("Error saving project");
    }
  };

  const handleToggle = async (project: Project) => {
    try {
      await updateProject(project.id, { name: project.name, isActive: !project.isActive });
      fetchProjects();
    } catch (error) {
      toast.error("Error toggling project status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      toast.success("Project deleted");
      fetchProjects();
    } catch (error) {
      toast.error("Error deleting project. It might be in use.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="card">
        <h3 className="text-lg font-bold mb-4">{editingId ? "Edit Project" : "Add New Project"}</h3>
        <form onSubmit={handleSave} className="flex gap-4">
          <Input 
            placeholder="Project name..." 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)} 
            className="h-10 w-14 p-1 rounded-md border border-gray-300 cursor-pointer"
            title="Choose Project Color"
          />
          <Button type="submit">
            {editingId ? "Update" : "Create"}
          </Button>
          {editingId && (
            <Button variant="secondary" onClick={() => { setEditingId(null); setName(""); setColor("#000000"); }}>
              Cancel
            </Button>
          )}
        </form>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="card flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
               {project.isActive ? (
                <CheckCircle2 className="text-green-500" size={20} />
              ) : (
                <XCircle className="text-gray-400" size={20} />
              )}
              <span 
                className={`font-medium ${!project.isActive ? 'text-gray-400 line-through' : ''}`}
                style={{ color: project.isActive && project.color ? project.color : undefined }}
              >
                {project.name}
              </span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                title="Edit"
                className="p-2 h-10 w-10 text-blue-600" 
                onClick={() => { setEditingId(project.id); setName(project.name); setColor(project.color || "#000000"); }}
              >
                <Edit2 size={20} />
              </Button>
              <Button 
                variant="secondary" 
                title="Delete"
                className="p-2 h-10 w-10 text-red-600 hover:bg-red-50" 
                onClick={() => handleDelete(project.id)}
              >
                <Trash2 size={20} />
              </Button>
              <Button 
                variant={project.isActive ? "danger" : "primary"} 
                className="p-1 px-3 text-sm"
                onClick={() => handleToggle(project)}
              >
                {project.isActive ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
