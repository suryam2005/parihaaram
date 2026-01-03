"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";

interface HoroscopeFormProps {
    onCalculate: (data: { dob: string; tob: string; pob: string }) => void;
    loading: boolean;
    language?: 'en' | 'ta';
}

const TRANSLATIONS = {
    en: {
        dob: "Date of Birth",
        tob: "Time of Birth",
        pob: "Place of Birth",
        pobPlaceholder: "City, State / Country",
        calculate: "Calculate Birth Chart",
        computation: "Real-Time Computation",
        engine: "HIGH-PRECISION ENGINE"
    },
    ta: {
        dob: "பிறந்த தேதி",
        tob: "பிறந்த நேரம்",
        pob: "பிறந்த இடம்",
        pobPlaceholder: "நகரம் / நாடு",
        calculate: "ஜாதகம் கணக்கிடுக",
        computation: "நேரடி கணக்கீடு",
        engine: "துல்லியமான இயந்திரம்"
    }
};

export default function HoroscopeForm({ onCalculate, loading, language = 'en' }: HoroscopeFormProps) {
    const [formData, setFormData] = useState({ dob: "", tob: "", pob: "" });
    const t = TRANSLATIONS[language];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl mx-auto bg-white border border-slate-200 rounded-xl p-8 md:p-10 relative overflow-hidden shadow-xl text-left"
        >
            <div className="absolute top-0 right-0 p-6 flex items-center gap-2 opacity-30 select-none">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{t.computation}</span>
            </div>

            <div className="space-y-6 relative z-10 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="w-full">
                        <label className="divine-label">{t.dob}</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                                <Calendar className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            </div>
                            <input
                                type="date"
                                className="divine-input !pl-12"
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="divine-label">{t.tob}</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                                <Clock className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            </div>
                            <input
                                type="time"
                                className="divine-input !pl-12"
                                onChange={(e) => setFormData({ ...formData, tob: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <label className="divine-label">{t.pob}</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                            <MapPin className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder={t.pobPlaceholder}
                            className="divine-input !pl-12"
                            onChange={(e) => setFormData({ ...formData, pob: e.target.value })}
                        />
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={loading || !formData.dob || !formData.tob || !formData.pob}
                    onClick={() => onCalculate(formData)}
                    className="divine-button w-full h-12 flex items-center justify-center gap-3 mt-4"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            <span className={`text-sm font-bold uppercase tracking-widest ${language === 'ta' ? 'font-tamil' : ''}`}>{t.calculate}</span>
                        </>
                    )}
                </motion.button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center opacity-30">
                <span className="text-[10px] font-bold tracking-[0.1em] text-slate-600 uppercase">{t.engine}</span>
                <span className="text-[10px] font-bold tracking-[0.1em] text-slate-600 text-right">VERSION 2.4.0</span>
            </div>
        </motion.div>
    );
}
