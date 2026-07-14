import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import {Footer} from "../components/Footer.tsx";

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCounter(target: number, duration = 1800) {
    const [count, setCount] = useState(0);
    const started = useRef(false);

    function start() {
        if (started.current) return;
        started.current = true;
        const startTime = performance.now();
        function step(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    return { count, start };
}

// ─── Intersection observer hook ───────────────────────────────────────────────
function useInView(threshold = 0.2) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);
    return { ref, inView };
}

// ─── Stat counter card ────────────────────────────────────────────────────────
function StatCard({ label, target, suffix = "" }: { label: string; target: number; suffix?: string }) {
    const { count, start } = useCounter(target);
    const { ref, inView } = useInView();

    useEffect(() => { if (inView) start(); }, [inView, start]);

    return (
        <div ref={ref} className="flex flex-col items-center gap-1">
            <span className="text-4xl sm:text-5xl font-extrabold text-amber-400 tabular-nums">
                {count.toLocaleString()}{suffix}
            </span>
            <span className="text-zinc-400 text-sm sm:text-base text-center">{label}</span>
        </div>
    );
}

// ─── Feature card ─────────────────────────────────────────────────────────────
type FeatureCardProps = {
    icon: string;
    title: string;
    description: string;
    delay: string;
    inView: boolean;
};
function FeatureCard({ icon, title, description, delay, inView }: FeatureCardProps) {
    return (
        <div
            className="group relative flex flex-col gap-4 p-6 sm:p-7 rounded-2xl border border-slate-700/60 bg-slate-800/50 backdrop-blur-sm
            hover:border-amber-400/50 hover:bg-slate-800/80 transition-all duration-500 overflow-hidden"
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 0.6s ease ${delay}, transform 0.6s ease ${delay}`,
            }}
        >
            {/* glow orb */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-amber-400/10 blur-2xl
            group-hover:bg-amber-400/20 group-hover:w-32 group-hover:h-32 transition-all duration-500" />
            <div className="text-4xl">{icon}</div>
            <h3 className="text-lg font-bold text-zinc-100 group-hover:text-amber-400 transition-colors duration-300">{title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

// ─── Step card ────────────────────────────────────────────────────────────────
function StepCard({ step, title, description, inView, delay }: { step: number; title: string; description: string; inView: boolean; delay: string }) {
    return (
        <div
            className="flex flex-col items-center text-center gap-4"
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.5s ease ${delay}, transform 0.5s ease ${delay}`,
            }}
        >
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-amber-400/15 border-2 border-amber-400/40">
                <span className="text-amber-400 text-xl font-bold">{step}</span>
                <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-md animate-pulse" />
            </div>
            <h3 className="text-zinc-100 font-semibold text-base">{title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-52">{description}</p>
        </div>
    );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function LandingNav({ scrolled }: { scrolled: boolean }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-12 py-4 transition-all duration-300 ${
                scrolled
                    ? "bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 shadow-lg"
                    : "bg-transparent"
            }`}
        >
            <div className="flex gap-3 items-center select-none">
                <img src={logo} alt="Servants Logo" className="w-7 h-9" />
                <span className="text-xl font-bold text-zinc-100">Servants</span>
            </div>

            {/* Desktop CTA */}
            <div className="hidden sm:flex items-center gap-3">
                <Link
                    to="/login"
                    className="text-zinc-300 hover:text-amber-400 font-medium px-4 py-2 transition-colors duration-200"
                >
                    Sign In
                </Link>
                <Link
                    to="/register"
                    className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-5 py-2 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-400/25 active:scale-[0.97]"
                >
                    Get Started
                </Link>
            </div>

            {/* Mobile hamburger */}
            <button
                className="sm:hidden flex flex-col gap-1.5 p-2 hover:bg-amber-400/20 rounded-lg transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>

            {menuOpen && (
                <div className="sm:hidden absolute top-full right-4 mt-2 bg-slate-800/95 backdrop-blur border border-slate-700 rounded-xl p-4 flex flex-col gap-3 min-w-44 shadow-2xl"
                    onClick={() => setMenuOpen(false)}>
                    <Link to="/login" className="text-zinc-200 hover:text-amber-400 font-medium py-1.5 px-2 transition-colors">Sign In</Link>
                    <Link to="/register" className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-2 px-4 rounded-xl text-center transition-all">Get Started</Link>
                </div>
            )}
        </nav>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function Landing() {
    const [scrolled, setScrolled] = useState(false);
    const [heroVisible, setHeroVisible] = useState(false);

    // Features section
    const featuresRef = useRef<HTMLDivElement>(null);
    const [featuresInView, setFeaturesInView] = useState(false);

    // Steps section
    const stepsRef = useRef<HTMLDivElement>(null);
    const [stepsInView, setStepsInView] = useState(false);

    // Stats section
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Hero entrance
        const t = setTimeout(() => setHeroVisible(true), 100);

        // Scroll detection
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);

        // Intersection observers
        const makeObserver = (setter: (v: boolean) => void, threshold = 0.15) =>
            new IntersectionObserver(([e]) => { if (e.isIntersecting) setter(true); }, { threshold });

        const obs1 = makeObserver(setFeaturesInView);
        const obs2 = makeObserver(setStepsInView);

        if (featuresRef.current) obs1.observe(featuresRef.current);
        if (stepsRef.current) obs2.observe(stepsRef.current);

        return () => {
            clearTimeout(t);
            window.removeEventListener("scroll", onScroll);
            obs1.disconnect();
            obs2.disconnect();
        };
    }, []);

    const features = [
        {
            icon: "📅",
            title: "Smart Scheduling",
            description: "View upcoming church services at a glance. See what's happening today, this week, and beyond — all in one organized timeline.",
        },
        {
            icon: "🙋",
            title: "Role Sign-Ups",
            description: "Browse open volunteer roles and sign up instantly. From worship team to hospitality, find where you fit and make a difference.",
        },
        {
            icon: "🔔",
            title: "Service Reminders",
            description: "Never miss your assigned service. Receive timely SMS reminders so you're always prepared and ready to serve.",
        },
        {
            icon: "💬",
            title: "Team Communication",
            description: "Stay connected with fellow servants through built-in group and direct messaging. Coordinate effortlessly, serve together joyfully.",
        },
        {
            icon: "📋",
            title: "Assignment Tracking",
            description: "Track your past and upcoming assignments in one place. Know your confirmed, pending, and completed services at a glance.",
        },
        {
            icon: "🤝",
            title: "Community First",
            description: "Built for church communities that believe in serving with purpose. Foster deeper connections and a culture of joyful contribution.",
        },
    ];

    const steps = [
        { step: 1, title: "Create Your Account", description: "Sign up with your name, email, and phone number to join your church's servant community." },
        { step: 2, title: "Browse Open Roles", description: "Explore available roles across upcoming services and choose where you'd like to contribute." },
        { step: 3, title: "Sign Up & Get Confirmed", description: "Submit your sign-up and get notified once you're confirmed by the admin team." },
        { step: 4, title: "Serve with Purpose", description: "Show up, serve your community, and grow together in faith and commitment." },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-zinc-100 overflow-x-hidden select-none">
            <LandingNav scrolled={scrolled} />

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center justify-center px-5 sm:px-12 pt-24 pb-16">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Large ambient orbs */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-400/6 blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-600/8 blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "1s" }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-slate-800/40 blur-3xl" />
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: "linear-gradient(rgba(251,191,36,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.5) 1px, transparent 1px)",
                            backgroundSize: "60px 60px",
                        }}
                    />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
                    {/* Badge */}
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-400 text-xs sm:text-sm font-medium"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? "translateY(0)" : "translateY(-16px)",
                            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
                        }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Church Volunteer Management Platform
                    </div>

                    {/* Headline */}
                    <h1
                        className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? "translateY(0)" : "translateY(24px)",
                            transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s",
                        }}
                    >
                        Serve Together,{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-300">
                            Grow Together
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p
                        className="text-zinc-400 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? "translateY(0)" : "translateY(24px)",
                            transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
                        }}
                    >
                        Servants is a platform built for church communities — making it simple to
                        schedule services, fill volunteer roles, and stay connected as a team.
                    </p>

                    {/* Quote */}
                    <blockquote
                        className="border-l-2 border-amber-400/50 pl-4 text-left max-w-lg"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                            transition: "opacity 0.7s ease 0.55s, transform 0.7s ease 0.55s",
                        }}
                    >
                        <p className="text-zinc-400 text-sm italic leading-relaxed">
                            "No one comes to help, no one comes to contribute, everybody comes to learn and to serve."
                        </p>
                        <footer className="text-amber-400 text-xs font-semibold mt-1">— Stephen Tong</footer>
                    </blockquote>

                    {/* CTA buttons */}
                    <div
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                            transition: "opacity 0.7s ease 0.7s, transform 0.7s ease 0.7s",
                        }}
                    >
                        <Link
                            to="/register"
                            id="hero-register-btn"
                            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-8 py-3.5 rounded-xl text-base transition-all duration-200 hover:shadow-xl hover:shadow-amber-400/20 active:scale-[0.97] text-center"
                        >
                            Join the Team →
                        </Link>
                        <Link
                            to="/login"
                            id="hero-login-btn"
                            className="bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur border border-slate-600 hover:border-amber-400/50 text-zinc-100 font-semibold px-8 py-3.5 rounded-xl text-base transition-all duration-200 text-center"
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* Scroll indicator */}
                    <div
                        className="mt-4 flex flex-col items-center gap-2 text-zinc-500 text-xs"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transition: "opacity 0.7s ease 1s",
                        }}
                    >
                        <span>Scroll to explore</span>
                        <div className="w-0.5 h-8 bg-linear-to-b from-zinc-500 to-transparent animate-bounce" />
                    </div>
                </div>
            </section>

            {/* ── Stats ────────────────────────────────────────────── */}
            <section
                ref={statsRef}
                className="relative py-16 sm:py-20 px-5 sm:px-12"
            >
                <div className="absolute inset-0 bg-linear-to-r from-amber-400/5 via-transparent to-indigo-600/5 pointer-events-none" />
                <div className="relative max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 border border-slate-700/50 rounded-2xl p-8 sm:p-12 bg-slate-800/30 backdrop-blur-sm">
                        <StatCard label="Services Organized" target={320} suffix="+" />
                        <StatCard label="Volunteers Served" target={150} suffix="+" />
                        <StatCard label="Roles Filled" target={1200} suffix="+" />
                        <StatCard label="Reminders Sent" target={4800} suffix="+" />
                    </div>
                </div>
            </section>

            {/* ── Features ─────────────────────────────────────────── */}
            <section ref={featuresRef} className="py-16 sm:py-24 px-5 sm:px-12">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <span
                            className="text-amber-400 text-sm font-semibold uppercase tracking-widest"
                            style={{
                                opacity: featuresInView ? 1 : 0,
                                transition: "opacity 0.5s ease 0.1s",
                            }}
                        >
                            Everything you need
                        </span>
                        <h2
                            className="text-3xl sm:text-4xl font-extrabold mt-3 text-zinc-100"
                            style={{
                                opacity: featuresInView ? 1 : 0,
                                transform: featuresInView ? "translateY(0)" : "translateY(16px)",
                                transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
                            }}
                        >
                            Built for Servant Hearts
                        </h2>
                        <p
                            className="text-zinc-400 mt-3 max-w-xl mx-auto text-sm sm:text-base"
                            style={{
                                opacity: featuresInView ? 1 : 0,
                                transition: "opacity 0.6s ease 0.3s",
                            }}
                        >
                            Everything your church team needs to coordinate, communicate, and serve with excellence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {features.map((f, i) => (
                            <FeatureCard
                                key={f.title}
                                {...f}
                                inView={featuresInView}
                                delay={`${0.1 + i * 0.1}s`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ──────────────────────────────────────── */}
            <section ref={stepsRef} className="py-16 sm:py-24 px-5 sm:px-12 relative">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-700 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-700 to-transparent" />
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <span
                            className="text-amber-400 text-sm font-semibold uppercase tracking-widest"
                            style={{ opacity: stepsInView ? 1 : 0, transition: "opacity 0.5s ease 0.1s" }}
                        >
                            Simple process
                        </span>
                        <h2
                            className="text-3xl sm:text-4xl font-extrabold mt-3 text-zinc-100"
                            style={{
                                opacity: stepsInView ? 1 : 0,
                                transform: stepsInView ? "translateY(0)" : "translateY(16px)",
                                transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
                            }}
                        >
                            Start Serving in Minutes
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 relative">
                        {/* connector line (desktop) */}
                        <div className="hidden sm:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5 bg-linear-to-r from-amber-400/30 via-amber-400/60 to-amber-400/30" />
                        {steps.map((s, i) => (
                            <StepCard
                                key={s.step}
                                {...s}
                                inView={stepsInView}
                                delay={`${0.1 + i * 0.15}s`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ───────────────────────────────────────── */}
            <section className="py-16 sm:py-24 px-5 sm:px-12">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="relative p-8 sm:p-14 rounded-3xl border border-amber-400/20 bg-linear-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm overflow-hidden">
                        {/* decorative orbs */}
                        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <div className="flex gap-3 items-center">
                                <img src={logo} alt="Servants Logo" className="w-8 h-10 opacity-90" />
                                <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-100">
                                    Ready to <span className="text-amber-400">Serve?</span>
                                </h2>
                            </div>
                            <p className="text-zinc-400 text-sm sm:text-base max-w-lg leading-relaxed">
                                Join hundreds of volunteers who are already making an impact through
                                Servants. Your church team is waiting for you.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                                <Link
                                    to="/register"
                                    id="cta-register-btn"
                                    className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-8 py-3.5 rounded-xl text-base transition-all duration-200 hover:shadow-xl hover:shadow-amber-400/25 active:scale-[0.97] text-center"
                                >
                                    Create Account
                                </Link>
                                <Link
                                    to="/login"
                                    id="cta-login-btn"
                                    className="border border-slate-600 hover:border-amber-400/60 text-zinc-300 hover:text-zinc-100 font-semibold px-8 py-3.5 rounded-xl text-base transition-all duration-200 text-center"
                                >
                                    I already have an account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────────────── */}
            <footer className="border-t border-slate-700/50 px-5 sm:px-12 py-10">
                <Footer />
            </footer>
        </div>
    );
}
