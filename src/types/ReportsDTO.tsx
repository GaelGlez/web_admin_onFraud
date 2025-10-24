export interface Reports {
    id: number;
    user_id: number | null;
    title: string;
    url?: string;
    description?: string;
    category_id: number;
    status_id: number;
    created_at: string;
    updated_at: string;

    // campos traídos con JOIN
    user_name?: string;
    category_name?: string;
    status_name?: string;
}


export interface ReportStats {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
}

export interface ReportsByCategory {
    category: string;
    count: number;
}