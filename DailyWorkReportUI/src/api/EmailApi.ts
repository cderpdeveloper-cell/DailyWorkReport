import { api as API } from "./axios";
import type { EmailRecipient, EmailSetting } from "../types";

export const getRecipients = async () => {
    return API.get<EmailRecipient[]>('/EmailSettings/recipients');
};

export const addRecipient = async (recipient: EmailRecipient) => {
    return API.post<EmailRecipient>('/EmailSettings/recipients', recipient);
};

export const updateRecipient = async (id: number, recipient: EmailRecipient) => {
    return API.put(`/EmailSettings/recipients/${id}`, recipient);
};

export const deleteRecipient = async (id: number) => {
    return API.delete(`/EmailSettings/recipients/${id}`);
};

export const getSmtpSettings = async () => {
    return API.get<EmailSetting>('/EmailSettings/smtp');
};

export const saveSmtpSettings = async (settings: EmailSetting) => {
    return API.post<EmailSetting>('/EmailSettings/smtp', settings);
};
