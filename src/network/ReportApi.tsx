import axios from "axios";
import { Reports } from "../types/ReportsDTO";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getReports(): Promise<Reports[]> {
    const response = await axios.get<Reports[]>(`${BASE_URL}/admin/reports`);
    return response.data;
}

export async function updateReportStatus(reportId: number, statusId: number) {
    const response = await axios.put(`${BASE_URL}/admin/reports/${reportId}/status/${statusId}`);
    return response.data;
}

export async function getReportStats() {
    const response = await axios.get(`${BASE_URL}/admin/reports/stats`);
    return response.data;
}
