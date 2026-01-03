"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Moon, Star, RefreshCcw, Sparkles, Map, Calendar, Info,
    BookOpen, ChevronRight, ChevronDown, Bookmark, Loader2, Check,
    MessageSquare, History
} from "lucide-react";
import {
    AstrologyResults, Mahadasha, NAKSHATRAS_TAMIL
} from "@/lib/astrology";
import SouthIndianChart from "./SouthIndianChart";
import { horoscopeService } from "@/lib/services/horoscope";
import { createClient } from "@/lib/supabase";

interface HoroscopeResultProps {
    results: AstrologyResults;
    onReset: () => void;
    inputData: { dob: string; tob: string; pob: string; lat: number; lon: number };
    language?: 'en' | 'ta';
    onLanguageChange?: (lang: 'en' | 'ta') => void;
}

const TRANSLATIONS = {
    en: {
        report: "Precision",
        insights: "Analysis",
        desc: "High-density astronomical data computed for your specific coordinates.",
        ascendant: "Ascendant",
        moonSign: "Moon Sign",
        nakshatra: "Nakshatra",
        mainChart: "Primary Grid (D1)",
        divisionalChart: "Strength Grid (D9)",
        structural: "Hardware",
        internalStrength: "Deep Logic",
        analysis: "Analytical Output",
        periods: "Computational Timeline",
        newSearch: "New Calculation",
        store: "Archive Report",
        stored: "Archived",
        processing: "Syncing...",
        starting: "Starting",
        quickActions: "Quick Actions",
        requestExpert: "Expert Guidance",
        viewHistory: "View History"
    },
    ta: {
        report: "துல்லிய",
        insights: "ஆய்வு",
        desc: "உங்கள் இருப்பிடத்திற்காக கணக்கிடப்பட்ட உயர் அடர்த்தி வானியல் தகவல்கள்.",
        ascendant: "லக்னம்",
        moonSign: "ராசி",
        nakshatra: "நட்சத்திரம்",
        mainChart: "பிரிமரி கிரிட் (D1)",
        divisionalChart: "ஸ்ட்ரென்த் கிரிட் (D9)",
        structural: "அமைப்பு",
        internalStrength: "உள் பகுப்பாய்வு",
        analysis: "ஆய்வு முடிவுகள்",
        periods: "காலவரிசை",
        newSearch: "புதிய கணக்கீடு",
        store: "ஆவணப்படுத்து",
        stored: "ஆவணப்படுத்தப்பட்டது",
        processing: "இணைக்கப்படுகிறது...",
        starting: "தொடக்கம்",
        quickActions: "விரைவு இணைப்புகள்",
        requestExpert: "நிபுணர் ஆலோசனை",
        viewHistory: "வரலாறு"
    }
};

export default function HoroscopeResult({ results, onReset, inputData, language = 'en', onLanguageChange }: HoroscopeResultProps) {
    const [user, setUser] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const t = TRANSLATIONS[language];

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        checkUser();
    }, []);

    const handleSave = async () => {
        if (!user) return;

        const name = prompt(language === 'ta' ? "இந்த பதிவிற்கு ஒரு பெயரை உள்ளிடவும்:" : "Enter a name for this analytical record:", "Report_" + new Date().getTime());
        if (!name) return;

        setSaving(true);
        try {
            await horoscopeService.saveHoroscope({
                name,
                ...inputData
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-full px-6 md:px-12 space-y-16 pb-32 text-left relative"
        >
            {/* Quick Navigation Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-200 pb-8">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.quickActions}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href="/consultation"
                        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-all"
                    >
                        <MessageSquare className="w-3.5 h-3.5" /> {t.requestExpert}
                    </Link>
                    <Link
                        href="/consultation/history"
                        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all"
                    >
                        <History className="w-3.5 h-3.5" /> {t.viewHistory}
                    </Link>

                    {/* Language Switch moved here for better "Easy" UX */}
                    <div className="bg-slate-100 border border-slate-200 rounded-full p-0.5 flex">
                        <button
                            onClick={() => onLanguageChange?.('en')}
                            className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all ${language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => onLanguageChange?.('ta')}
                            className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all ${language === 'ta' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            தமிழ்
                        </button>
                    </div>
                </div>
            </div>

            {/* Header Info */}
            <div className="text-center space-y-4 pb-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    {language === 'ta' ? 'பரிகாரம் ஆய்வறிக்கை' : 'PARIHARAM ANALYTICAL REPORT'}
                </motion.div>
                <h2 className={`text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-none uppercase ${language === 'ta' ? 'font-tamil' : ''}`}>
                    {t.report} <span className="text-indigo-600">{t.insights}</span>
                </h2>
                <p className="text-slate-500 text-sm font-medium">{t.desc}</p>
            </div>

            {/* Metric Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1200px] mx-auto">
                <MetricCard
                    icon={<Map className="w-5 h-5" />}
                    label={t.ascendant}
                    value={language === 'ta' ? results.lagna.name_ta : results.lagna.name}
                />
                <MetricCard
                    icon={<Moon className="w-5 h-5" />}
                    label={t.moonSign}
                    value={language === 'ta' ? results.moon_sign.name_ta : results.moon_sign.name}
                />
                <MetricCard
                    icon={<Star className="w-5 h-5" />}
                    label={t.nakshatra}
                    value={language === 'ta' ? NAKSHATRAS_TAMIL[results.nakshatra.idx] : results.nakshatra.name}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-10">
                    <section className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">{t.mainChart}</h3>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t.structural}</span>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <SouthIndianChart
                                title={language === 'ta' ? "ராசி கட்டம்" : "Rasi Chart"}
                                lagnaIdx={results.lagna.idx}
                                planets={results.planets.map(p => ({ name: p.name, rasi_idx: p.rasi_idx }))}
                                language={language}
                            />
                        </div>
                    </section>

                    {results.navamsa_chart && (
                        <section className="space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">{t.divisionalChart}</h3>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t.internalStrength}</span>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                <SouthIndianChart
                                    title={language === 'ta' ? "நவாம்ச கட்டம்" : "Navamsa Chart"}
                                    lagnaIdx={results.navamsa_chart.lagna.rasi_idx}
                                    planets={results.navamsa_chart.planets.map(p => ({ name: p.planet, rasi_idx: p.rasi_idx }))}
                                    language={language}
                                />
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-12">
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{t.analysis}</h3>
                        </div>
                        <div className="space-y-6">
                            {results.predictions.map((p, i) => (
                                <div key={i} className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{p.title}</p>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{p.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{t.periods}</h3>
                        </div>
                        <div className="space-y-3">
                            {results.mahadashas.map((m) => (
                                <MahadashaNode key={m.planet + m.start_date} m={m} language={language} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-10 flex flex-wrap justify-center gap-4">
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-8 py-3 rounded-full bg-white border border-slate-200 text-slate-900 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                    <RefreshCcw className="w-4 h-4 text-indigo-600" /> {t.newSearch}
                </button>

                {user && (
                    <button
                        onClick={handleSave}
                        disabled={saving || saved}
                        className={`flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md ${saved ? 'bg-indigo-900 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4 text-indigo-400" />}
                        {saving ? t.processing : saved ? t.stored : t.store}
                    </button>
                )}
            </div>
        </motion.div>
    );
}

function MahadashaNode({ m, language }: { m: Mahadasha, language: 'en' | 'ta' }) {
    const [isOpen, setIsOpen] = useState(m.is_current);
    const planetMap: Record<string, string> = {
        "Sun": "சூரியன்", "Moon": "சந்திரன்", "Mars": "செவ்வாய்",
        "Mercury": "புதன்", "Jupiter": "குரு", "Venus": "சுக்கிரன்",
        "Saturn": "சனி", "Rahu": "ராகு", "Ketu": "கேது"
    };

    const getPlanetName = (name: string) => language === 'ta' ? (planetMap[name] || name) : name;

    return (
        <div className="border border-slate-100 bg-slate-50 rounded-xl overflow-hidden transition-all">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-1.5 h-1.5 rounded-full ${m.is_current ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300'}`} />
                    <span className={`text-xs font-bold uppercase ${m.is_current ? 'text-indigo-600' : 'text-slate-700'}`}>
                        {getPlanetName(m.planet)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{m.start_date} — {m.end_date}</span>
                </div>
                {isOpen ? <ChevronDown className="w-4 h-4 text-slate-300" /> : <ChevronRight className="w-4 h-4 text-slate-300" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-white border-t border-slate-100 p-4 space-y-2">
                        {m.bhuktis.map(b => (
                            <div key={b.planet + b.start_date} className="flex items-center justify-between text-[11px] font-medium text-slate-500 py-1 border-b border-slate-50 last:border-0 pl-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-1 h-1 rounded-full ${b.is_current ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                                    <span>{getPlanetName(b.planet)}</span>
                                </div>
                                <span>{language === 'ta' ? 'தொடக்கம்' : 'Starting'} {b.start_date}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MetricCard({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-2">
                <div className="text-indigo-600 opacity-60 group-hover:opacity-100 transition-opacity">{icon}</div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
            <p className="text-xl font-bold text-slate-900">{value}</p>
        </div>
    );
}
