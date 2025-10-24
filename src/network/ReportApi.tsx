import axios from "axios";
import { Reports } from "../types/ReportsDTO";
import { Evidences } from "../types/EvidencesDTO";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface GetReportsParams {
    statusId?: number;
    categoryId?: number;
    userFilter?: 'onlyAnonymous' | 'onlyUsers';
    keyword?: string;
}

export async function getReports(params: GetReportsParams): Promise<Reports[]> {
    const response = await axios.get<Reports[]>(`${BASE_URL}/admin/reports`, { params });
    return response.data;
}

export async function updateReportStatus(reportId: number, statusId: number) {
    const response = await axios.put(`${BASE_URL}/admin/reports/${reportId}/status/${statusId}`);
    return response.data;
}

export async function getEvidencesByReport(reportId: number): Promise<Evidences[]> {
    const response = await axios.get<Evidences[]>(`${BASE_URL}/reports/${reportId}/evidences`);
    return response.data;
}

export async function deleteReport(reportId: number) {
    const response = await axios.delete(`${BASE_URL}/admin/reports/${reportId}`);
    return response.data;
}