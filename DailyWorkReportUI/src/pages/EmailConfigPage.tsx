import React, { useEffect, useState } from "react";
import { getRecipients, addRecipient, deleteRecipient, updateRecipient, getSmtpSettings, saveSmtpSettings } from "../api/EmailApi";
import type { EmailRecipient, EmailSetting } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Trash, Mail, Plus, User, Info, Server, Key, Shield, HardDrive, Check } from "lucide-react";
import toast from "react-hot-toast";

const EmailConfigPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"recipients" | "smtp">("recipients");
  
  // Recipients State
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [loadingRecipients, setLoadingRecipients] = useState(true);
  const [recipientForm, setRecipientForm] = useState<EmailRecipient>({
    email: "",
    name: "",
    recipientType: "To",
    isActive: true,
  });

  // SMTP State
  const [smtpSettings, setSmtpSettings] = useState<EmailSetting>({
    smtpServer: "",
    port: 587,
    senderName: "",
    senderEmail: "",
    password: "",
    isActive: true,
  });
  const [loadingSmtp, setLoadingSmtp] = useState(true);
  const [savingSmtp, setSavingSmtp] = useState(false);

  useEffect(() => {
    loadRecipients();
    loadSmtpSettings();
  }, []);

  const loadRecipients = async () => {
    try {
      const { data } = await getRecipients();
      setRecipients(data);
    } catch (error) {
      toast.error("Failed to load recipients");
    } finally {
      setLoadingRecipients(false);
    }
  };

  const loadSmtpSettings = async () => {
    try {
      const { data } = await getSmtpSettings();
      if (data && data.smtpServer) {
        setSmtpSettings(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSmtp(false);
    }
  };

  const handleAddRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientForm.email) return toast.error("Email is required");

    try {
      await addRecipient(recipientForm);
      toast.success("Recipient added successfully");
      setRecipientForm({ email: "", name: "", recipientType: "To", isActive: true });
      loadRecipients();
    } catch (error) {
      toast.error("Failed to add recipient");
    }
  };

  const handleDeleteRecipient = async (id: number) => {
    if (!confirm("Are you sure you want to delete this recipient?")) return;
    try {
      await deleteRecipient(id);
      toast.success("Recipient deleted");
      loadRecipients();
    } catch (error) {
      toast.error("Failed to delete recipient");
    }
  };

  const toggleRecipientStatus = async (recipient: EmailRecipient) => {
    try {
      const updated = { ...recipient, isActive: !recipient.isActive };
      await updateRecipient(recipient.id!, updated);
      loadRecipients();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSmtp(true);
    try {
      const { data } = await saveSmtpSettings(smtpSettings);
      setSmtpSettings(data);
      toast.success("SMTP Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save SMTP settings");
    } finally {
      setSavingSmtp(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Email Configuration</h2>
        <p className="text-gray-500 mt-1">Manage SMTP server and report recipients.</p>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "recipients" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("recipients")}
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Recipients List
          </div>
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "smtp" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("smtp")}
        >
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            SMTP Server
          </div>
        </button>
      </div>

      {activeTab === "recipients" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Section */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold">New Recipient</h3>
              </div>
              
              <form onSubmit={handleAddRecipient} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Manager Name..."
                  icon={<User className="w-4 h-4" />}
                  value={recipientForm.name}
                  onChange={(e) => setRecipientForm({ ...recipientForm, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="example@company.com"
                  icon={<Mail className="w-4 h-4" />}
                  value={recipientForm.email}
                  onChange={(e) => setRecipientForm({ ...recipientForm, email: e.target.value })}
                  required
                />
                <Select
                  label="Recipient Type"
                  value={recipientForm.recipientType}
                  onChange={(e) => setRecipientForm({ ...recipientForm, recipientType: e.target.value as any })}
                  options={[
                    { value: "To", label: "Direct (To)" },
                    { value: "CC", label: "Carbon Copy (CC)" },
                  ]}
                />
                <Button type="submit" className="w-full mt-2 h-11">
                  Add Recipient
                </Button>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-2 px-1">
              <Info className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Active Recipients</p>
            </div>

            {loadingRecipients ? (
              <div className="card flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : recipients.length === 0 ? (
              <div className="card text-center py-16 bg-gray-50/50 border-dashed border-2">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-gray-900 font-medium">No recipients configured</h4>
                <p className="text-gray-500 text-sm max-w-xs mx-auto mt-1">
                  Add recipients to start sending your daily work reports automatically.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipients.map((recipient) => (
                  <div key={recipient.id} className={`card group hover:scale-[1.02] transition-all duration-300 ${!recipient.isActive ? 'opacity-60 bg-gray-50' : 'bg-white'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className={`p-3 rounded-xl ${recipient.recipientType === 'To' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                          {recipient.recipientType}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 leading-tight">{recipient.name || 'Unnamed'}</h4>
                          <p className="text-sm text-gray-500 mt-0.5">{recipient.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="danger"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 h-10 w-10 text-red-500 bg-red-50"
                        onClick={() => recipient.id && handleDeleteRecipient(recipient.id)}
                      >
                        <Trash className="w-5 h-5" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${recipient.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {recipient.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button 
                        onClick={() => toggleRecipientStatus(recipient)}
                        className="text-sm text-blue-600 font-medium hover:underline"
                      >
                        {recipient.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "smtp" && (
        <div className="card max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">SMTP Credentials</h3>
              <p className="text-sm text-gray-500">Configure your email provider to send reports.</p>
            </div>
          </div>
          
          {loadingSmtp ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSaveSmtp} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Sender Name"
                  placeholder="Daily Report Bot"
                  icon={<User className="w-4 h-4" />}
                  value={smtpSettings.senderName}
                  onChange={(e) => setSmtpSettings({...smtpSettings, senderName: e.target.value})}
                  required
                />
                <Input
                  label="Sender Email Address"
                  type="email"
                  placeholder="bot@company.com"
                  icon={<Mail className="w-4 h-4" />}
                  value={smtpSettings.senderEmail}
                  onChange={(e) => setSmtpSettings({...smtpSettings, senderEmail: e.target.value})}
                  required
                />
                <div className="md:col-span-2">
                  <Input
                    label="Email Password / App Password"
                    type="password"
                    placeholder="••••••••••••"
                    icon={<Key className="w-4 h-4" />}
                    value={smtpSettings.password}
                    onChange={(e) => setSmtpSettings({...smtpSettings, password: e.target.value})}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-1">For Gmail, use an App Password instead of your real password.</p>
                </div>
                <Input
                  label="SMTP Server Host"
                  placeholder="smtp.gmail.com"
                  icon={<HardDrive className="w-4 h-4" />}
                  value={smtpSettings.smtpServer}
                  onChange={(e) => setSmtpSettings({...smtpSettings, smtpServer: e.target.value})}
                  required
                />
                <Input
                  label="SMTP Port"
                  type="number"
                  placeholder="587"
                  icon={<Server className="w-4 h-4" />}
                  value={smtpSettings.port || ""}
                  onChange={(e) => setSmtpSettings({...smtpSettings, port: parseInt(e.target.value) || 587})}
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="relative flex cursor-pointer items-center rounded-full p-3" htmlFor="is-active">
                  <input
                    type="checkbox"
                    className="peer relative h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:border-indigo-600 checked:bg-indigo-600 hover:scale-105"
                    id="is-active"
                    checked={smtpSettings.isActive}
                    onChange={(e) => setSmtpSettings({...smtpSettings, isActive: e.target.checked})}
                  />
                  <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </div>
                </label>
                <div>
                  <label htmlFor="is-active" className="font-medium text-gray-900 cursor-pointer">Enable Email Sending</label>
                  <p className="text-sm text-gray-500">Toggle whether the system should send out emails.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <Button type="submit" loading={savingSmtp} className="w-full sm:w-auto h-11 px-8 bg-indigo-600 hover:bg-indigo-700">
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailConfigPage;
