import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getProjects } from "../../api/projectApi";
import { getStatuses } from "../../api/statusApi";
import { createReport, updateReport, getReportById } from "../../api/reportApi";
import type { Project, Status, CreateReportDto } from "../../types";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Plus, Trash, ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import { calculateDuration } from "../../utils/timeHelper";

export const ReportForm: React.FC = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, watch, reset, formState: { errors } } = useForm<CreateReportDto>({
    defaultValues: {
      reportDate: new Date().toISOString().split('T')[0],
      works: [{ srNo: 1, title: '', projectId: 0, statusId: 0, timeLogs: [{ inTime: '', outTime: '', is30MinBreak: false }] }]
    }
  });

  const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({
    control,
    name: "works"
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching master data...");
        const [projRes, statRes] = await Promise.all([getProjects(), getStatuses()]);
        console.log("Master loaded:", { projects: projRes.data.length, statuses: statRes.data.length });
        
        setProjects(projRes.data);
        setStatuses(statRes.data);

        if (isEdit) {
          console.log(`Fetching report ${id}...`);
          const { data: report } = await getReportById(Number(id));
          console.log("Report data received:", report);

          const formattedReport = {
            reportDate: report.reportDate.split('T')[0],
            works: report.works.map(w => ({
              srNo: w.srNo,
              title: w.title,
              projectId: Number(w.projectId || w.project?.id || 0),
              statusId: Number(w.statusId || w.status?.id || 0),
              description: w.description || '',
              timeLogs: w.timeLogs.map(t => ({
                inTime: t.inTime,
                outTime: t.outTime,
                is30MinBreak: t.is30MinBreak === true || (t as any).Is30MinBreak === true
              }))
            }))
          };
          
          console.log("Mapping successful, resetting form...", formattedReport);
          // Using a small timeout to ensure options are rendered
          setTimeout(() => reset(formattedReport), 100);
        }
      } catch (error) {
        console.error("DEBUG: Error in loadData:", error);
        toast.error("Failed to load data");
      }
    };
    loadData();
  }, [id, reset, isEdit]);

  const onSubmit = async (data: CreateReportDto) => {
    setLoading(true);
    try {
      if (isEdit) {
        await updateReport(Number(id), data);
        toast.success("Report updated successfully");
      } else {
        await createReport(data);
        toast.success("Report created successfully");
      }
      navigate("/reports");
    } catch (error: any) {
      toast.error(error.response?.data?.Message || "Failed to save report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" className="p-2" onClick={() => navigate("/reports")}>
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-2xl font-bold">{isEdit ? "Edit Report" : "Create New Report"}</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="card">
          <Input 
            label="Report Date" 
            type="date" 
            {...register("reportDate", { required: "Date is required" })}
            error={errors.reportDate?.message}
          />
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Plus size={20} className="text-blue-600" />
              Work Entries
            </h3>
            <Button 
                type="button" 
                variant="secondary" 
                onClick={() => appendWork({ 
                    srNo: workFields.length + 1, 
                    title: '', 
                    projectId: 0, 
                    statusId: 0, 
                    timeLogs: [{ inTime: '', outTime: '', is30MinBreak: false }] 
                })}
            >
              Add Work Entry
            </Button>
          </div>

          {workFields.map((work, index) => (
            <WorkEntryItem 
              key={work.id}
              index={index}
              remove={() => removeWork(index)}
              register={register}
              control={control}
              projects={projects}
              statuses={statuses}
              watch={watch}
            />
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="secondary" type="button" onClick={() => navigate("/reports")}>Cancel</Button>
          <Button type="submit" loading={loading} className="flex items-center gap-2">
            <Save size={18} />
            {isEdit ? "Update Report" : "Save Report"}
          </Button>
        </div>
      </form>
    </div>
  );
};

const WorkEntryItem = ({ index, remove, register, control, projects, statuses, watch }: any) => {
  const { fields: logFields, append: appendLog, remove: removeLog } = useFieldArray({
    control,
    name: `works.${index}.timeLogs`
  });

  return (
    <div className="card border-l-4 border-l-blue-500 space-y-4">
      <div className="flex justify-between items-start">
        <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-lg text-sm">#{index + 1}</span>
        <Button variant="danger" title="Delete Entry" className="text-red-600 bg-red-50 hover:bg-red-100 border-none p-2 h-11 w-11 rounded-xl" onClick={remove} type="button">
          <Trash className="w-6 h-6" strokeWidth={2.5} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Title" {...register(`works.${index}.title`, { required: true })} placeholder="Task title..." />
        <div className="grid grid-cols-2 gap-4">
          <Select 
            label="Project" 
            options={projects.map((p: any) => ({ label: p.name, value: p.id }))} 
            {...register(`works.${index}.projectId`, { required: true, valueAsNumber: true })}
          />
          <Select 
            label="Status" 
            options={statuses.map((s: any) => ({ label: s.name, value: s.id }))} 
            {...register(`works.${index}.statusId`, { required: true, valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="label">Description</label>
        <textarea 
          {...register(`works.${index}.description`)} 
          placeholder="Enter task details (press Enter for multiple points)..."
          className="input min-h-[100px] py-3 text-sm leading-relaxed"
          rows={3}
        ></textarea>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Time Logs</span>
          <Button type="button" variant="secondary" className="text-xs py-1" onClick={() => appendLog({ inTime: '', outTime: '', is30MinBreak: false })}>
            Add Log
          </Button>
        </div>

        {logFields.map((log, logIndex) => {
          const inTime = watch(`works.${index}.timeLogs.${logIndex}.inTime`);
          const outTime = watch(`works.${index}.timeLogs.${logIndex}.outTime`);
          const isBreak = watch(`works.${index}.timeLogs.${logIndex}.is30MinBreak`);
          const duration = calculateDuration(inTime, outTime, isBreak);

          return (
            <div key={log.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-4">
                <Input label="In Time" {...register(`works.${index}.timeLogs.${logIndex}.inTime`)} placeholder="e.g. 09:00 am" />
              </div>
              <div className="md:col-span-4">
                <Input label="Out Time" {...register(`works.${index}.timeLogs.${logIndex}.outTime`)} placeholder="e.g. 11:30 am" />
              </div>
              <div className="md:col-span-2 pb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register(`works.${index}.timeLogs.${logIndex}.is30MinBreak`)} className="rounded text-blue-600" />
                  <span className="text-xs text-gray-600">30m Break</span>
                </label>
              </div>
              <div className="md:col-span-1 pb-2">
                 <Button variant="danger" title="Remove Log" className="text-red-400 bg-transparent hover:bg-red-50 border-none p-2 h-10 w-10" onClick={() => removeLog(logIndex)} type="button">
                  <Trash className="w-5 h-5" strokeWidth={2.5} />
                </Button>
              </div>
              <div className="md:col-span-1 pb-2 text-right">
                {duration && (
                  <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                    {duration.hours}h {duration.minutes}m
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
