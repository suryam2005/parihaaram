"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Compass, Sparkles, History, User,
    Briefcase, ShieldCheck, Users, LogOut, Menu, X
} from "lucide-react";
import Link from 'next/link';
import { createClient } from "@/lib/supabase";
import AuthModal from "./AuthModal";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                import("@/lib/services/profile").then(({ profileService }) => {
                    profileService.getProfile().then(p => setRole(p?.role || 'customer'));
                });
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                import("@/lib/services/profile").then(({ profileService }) => {
                    profileService.getProfile().then(p => setRole(p?.role || 'customer'));
                });
            } else {
                setRole(null);
            }
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    const navLinks = {
        guest: [
            { id: 'home', label: 'Home', icon: Compass, href: '/' },
            { id: 'features', label: 'Features', icon: Sparkles, href: '#features' },
            { id: 'trust', label: 'Trust', icon: ShieldCheck, href: '#trust' },
        ],
        admin: [
            { id: 'ops', label: 'Operations Hub', icon: ShieldCheck, href: '/admin/dashboard' },
        ],
        astrologer: [
            { id: 'jobs', label: 'Job Dashboard', icon: Briefcase, href: '/astrologer/dashboard' },
        ],
        customer: [
            { id: 'analysis', label: 'Horoscope', icon: Compass, href: '/?dashboard=true' },
            { id: 'expertise', label: 'Consult', icon: Sparkles, href: '/consultation' },
            { id: 'history', label: 'Readings', icon: History, href: '/consultation/history' },
        ],
    };

    const currentLinks = !user ? navLinks.guest : role === 'admin' ? navLinks.admin : role === 'astrologer' ? navLinks.astrologer : navLinks.customer;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${isScrolled ? 'py-4' : 'py-8'}`}>
            <div className="max-w-[1400px] mx-auto px-6">
                <div className={`relative px-8 h-18 rounded-[2rem] border transition-all duration-700 flex items-center justify-between ${isScrolled ? 'bg-white/80 backdrop-blur-2xl border-slate-200/50 shadow-2xl shadow-indigo-500/5' : 'bg-transparent border-transparent'}`}>

                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:bg-indigo-600 transition-all duration-500 group-hover:rotate-6">
                            <Compass className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black tracking-[0.3em] uppercase text-slate-900 leading-none">Pariharam</span>
                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-indigo-600/60 mt-1">Ancient Vedic Wisdom</span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center gap-1 p-1.5 bg-slate-100/50 backdrop-blur-md rounded-2xl border border-slate-200/40">
                        {currentLinks.map((link) => (
                            <Link
                                key={link.id}
                                href={link.href}
                                className="group relative flex items-center gap-2.5 px-6 py-2.5 rounded-xl transition-all duration-500 hover:bg-white hover:shadow-sm"
                            >
                                <link.icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Profile & Auth */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden lg:flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{user?.user_metadata?.full_name || 'User'}</span>
                                    <span className="text-[9px] font-medium text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Session Active
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    title="End Session"
                                    className="p-2.5 rounded-full bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all border border-slate-200/50"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthOpen(true)}
                                className="flex items-center gap-4 pl-6 pr-2 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-full transition-all duration-500 shadow-xl shadow-indigo-500/10"
                            >
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden sm:block">Sign In</span>
                                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                    <User className="w-4 h-4" />
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </nav>
    );
}
