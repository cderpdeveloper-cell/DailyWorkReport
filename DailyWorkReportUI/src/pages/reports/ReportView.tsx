import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReportById, sendReportEmail } from "../../api/reportApi";
import type { Report } from "../../types";
import { Button } from "../../components/ui/Button";
import { ArrowLeft, Printer, Mail } from "lucide-react";
import toast from "react-hot-toast";

export const ReportView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState<Report | null>(null);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const loadReport = async () => {
            try {
                const { data } = await getReportById(Number(id));
                setReport(data);
            } catch (error) {
                toast.error("Failed to load report");
            }
        };
        loadReport();
    }, [id]);

    if (!report) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    const handlePrint = () => {
        window.print();
    };

    const handleSendEmail = async () => {
        if (!id) return;
        setSending(true);
        try {
            await sendReportEmail(Number(id));
            toast.success("Email sent successfully");
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to send email";
            toast.error(message);
        } finally {
            setSending(false);
        }
    };

    const getStatusStyle = (work: any) => {
        if (work.status?.color) return { color: work.status.color };
        const s = work.status?.name?.toLowerCase() || "";
        if (s.includes("run")) return { color: "#ea580c" }; // orange-600
        if (s.includes("test")) return { color: "#2563eb" }; // blue-600
        if (s.includes("comp")) return { color: "#16a34a" }; // green-600
        return { color: "#4b5563" }; // gray-600
    };

    const getProjectStyle = (work: any) => {
        if (work.project?.color) return { color: work.project.color };
        return { color: "#16a34a" }; // green-600
    };

    const formatTime = (time: string | undefined) => {
        if (!time) return "";
        return time.replace(/\s?[aApP][mM]\s?/, "").trim();
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center no-print">
                <Button variant="secondary" onClick={() => navigate("/reports")}>
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Button>
                <div className="flex gap-4">
                    <Button 
                        variant="secondary" 
                        onClick={handleSendEmail} 
                        disabled={sending}
                    >
                        {sending ? (
                            <span className="animate-spin mr-2">/</span>
                        ) : (
                            <Mail size={20} className="mr-2" />
                        )}
                        Send Mail
                    </Button>
                    <Button onClick={handlePrint} variant="primary">
                        <Printer size={20} className="mr-2" /> Print Report
                    </Button>
                </div>
            </div>

            <div className="bg-white p-8 shadow-sm border border-gray-200 rounded-lg print:shadow-none print:border-none">
                <div className="text-2xl font-bold mb-8">Daily Work Report of {new Date(report.reportDate).toLocaleDateString("en-GB")}</div>

                <div className="mb-6">
                    <p>Dear sir,</p>
                    <p>Please find below-mentioned tasks done today.</p>
                </div>

                <table className="w-full border-collapse border border-black">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border border-black px-2 py-2 text-left w-12">SR</th>
                            <th className="border border-black px-2 py-2 text-left">Work</th>
                            <th className="border border-black px-2 py-2 text-left w-20">Start</th>
                            <th className="border border-black px-2 py-2 text-left w-20">End</th>
                            <th className="border border-black px-2 py-2 text-left w-20">Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.works.map((work, index) => (
                            <React.Fragment key={work.id}>
                                {work.timeLogs.map((log, logIndex) => (
                                    <tr key={log.id}>
                                        {logIndex === 0 && (
                                            <>
                                                <td className="border border-black px-2 py-2 align-top text-center font-bold" rowSpan={work.timeLogs.length}>
                                                    {index + 1}
                                                </td>
                                                <td className="border border-black px-2 py-2 align-top" rowSpan={work.timeLogs.length}>
                                                    <div className="font-bold">
                                                        {work.title} 
                                                        <span style={getProjectStyle(work)} className="ml-1">({work.project?.name})</span>
                                                        <span style={getStatusStyle(work)} className="ml-1">
                                                            ({work.status?.name})
                                                        </span>
                                                    </div>
                                                    {work.description && (
                                                        <ul className="list-disc ml-5 mt-2">
                                                            {work.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                                                <li key={i}>{line.trim().replace(/^[•*-]\s*/, '')}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </td>
                                            </>
                                        )}
                                        <td className="border border-black px-2 py-2 text-center">{formatTime(log.inTime)}</td>
                                        <td className="border border-black px-2 py-2 text-center">{formatTime(log.outTime)}</td>
                                        <td className="border border-black px-2 py-2 text-center font-bold">
                                            {log.hours}:{String(log.minutes).padStart(2, '0')}
                                        </td>
                                    </tr>
                                ) )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
