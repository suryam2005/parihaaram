import { createClient } from "@/lib/supabase";

export interface ConsultationRequest {
    id: string;
    user_id: string;
    horoscope_id: string | null;
    categories: string[];
    comments: string;
    status: 'pending' | 'reviewing' | 'pending_admin' | 'completed';
    report_content: string | null;
    assigned_astrologer_id: string | null;
    created_at: string;
    horoscopes?: {
        id: string;
        name: string;
        dob: string;
        tob: string;
        pob: string;
        lat: number;
        lon: number;
    };
    users?: {
        full_name: string;
        email: string;
    };
}

export const consultationService = {
    async submitRequest(data: { horoscope_id: string | null; categories: string[]; comments: string }) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Please log in to submit a request.");

        const { error } = await supabase
            .from('consultations')
            .insert({
                user_id: user.id,
                horoscope_id: data.horoscope_id,
                categories: data.categories,
                comments: data.comments,
                status: 'pending'
            });

        if (error) throw error;
    },

    async getMyConsultations() {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return [];

        const { data, error } = await supabase
            .from('consultations')
            .select(`
                *,
                horoscopes (
                    id,
                    name,
                    dob,
                    tob,
                    pob,
                    lat,
                    lon
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as ConsultationRequest[];
    },

    // Astrologer Specific: Get tasks assigned to me
    async getAssignedTasks() {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('consultations')
            .select(`
                *,
                horoscopes (
                    id,
                    name,
                    dob,
                    tob,
                    pob,
                    lat,
                    lon
                ),
                users:user_id (full_name, email)
            `)
            .eq('assigned_astrologer_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as ConsultationRequest[];
    },

    // Admin Specific: Get everything
    async getAllConsultations() {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('consultations')
            .select(`
                *,
                horoscopes (
                    id,
                    name,
                    dob,
                    tob,
                    pob,
                    lat,
                    lon
                ),
                users:user_id (full_name, email),
                astrologer:assigned_astrologer_id (full_name)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as any[];
    },

    async assignAstrologer(consultationId: string, astrologerId: string) {
        const supabase = createClient();
        const { error } = await supabase
            .from('consultations')
            .update({
                assigned_astrologer_id: astrologerId,
                status: 'reviewing'
            })
            .eq('id', consultationId);

        if (error) throw error;
    },

    async submitReport(consultationId: string, content: string) {
        const supabase = createClient();
        const { error } = await supabase
            .from('consultations')
            .update({
                report_content: content,
                status: 'pending_admin'
            })
            .eq('id', consultationId);

        if (error) throw error;
    },

    async publishReport(consultationId: string, finalContent: string) {
        const supabase = createClient();
        const { error } = await supabase
            .from('consultations')
            .update({
                report_content: finalContent,
                status: 'completed'
            })
            .eq('id', consultationId);

        if (error) throw error;
    }
};
