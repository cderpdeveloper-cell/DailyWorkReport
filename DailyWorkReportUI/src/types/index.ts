export interface Project {
  id: number;
  name: string;
  isActive: boolean;
  color?: string;
}

export interface Status {
  id: number;
  name: string;
  isActive: boolean;
  color?: string;
}

export interface TimeLog {
  id?: number;
  inTime: string;
  outTime: string;
  is30MinBreak?: boolean;
  totalMinutes?: number;
  decimalHours?: number;
  hours?: number;
  minutes?: number;
}

export interface WorkEntry {
  id?: number;
  srNo: number;
  title: string;
  projectId: number;
  statusId: number;
  description?: string;
  project?: Project;
  status?: Status;
  timeLogs: TimeLog[];
}

export interface Report {
  id: number;
  reportDate: string;
  works: WorkEntry[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReportDto {
  reportDate: string;
  works: {
    srNo: number;
    title: string;
    projectId: number;
    statusId: number;
    description?: string;
    timeLogs: {
      inTime: string;
      outTime: string;
      is30MinBreak: boolean;
    }[];
  }[];
}

export interface EmailRecipient {
  id?: number;
  email: string;
  name?: string;
  recipientType: 'To' | 'CC';
  isActive: boolean;
}

export interface EmailSetting {
  emailSettingsId?: number;
  smtpServer: string;
  port: number;
  senderName: string;
  senderEmail: string;
  password?: string;
  isActive: boolean;
}
