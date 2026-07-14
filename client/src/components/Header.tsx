import { useState, type ComponentProps } from 'react'
import logo from '../assets/logo.png'
import { Button } from './Button'
import { ButtonLink } from './ButtonLink'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

type Variant = "home" | "schedule" | "openings" | "chats" | "register" | "login" | "registeradmin" | "loginadmin" | "admin"

type HeaderProps = {
    variant?: Variant
} & ComponentProps<"header">

export function Header({
    variant = "home",
    ...props
}: HeaderProps) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    async function handleLogout(){
        setLoading(true);

        try {
            logout();
            navigate("/login");
        } finally {
            setLoading(false);
        }
    }

    async function handleLogoutAdmin(){
        setLoading(true);

        try {
            logout();
            navigate("/admin/login");
        } finally {
            setLoading(false);
        }
    }

    return (
        <header {...props} className="flex items-center justify-between w-full relative select-none">
            <div className="flex gap-3 items-center">
                <img src={logo} alt="Servants Logo" className="w-7.5 h-10" />
                <h1 className="text-2xl font-bold">Servants</h1>
            </div>
            <div className="hidden sm:flex">
                {getVariantStyles(variant, handleLogout, handleLogoutAdmin, loading)}
            </div>

            {/* mobile view */}
            <button
            className='sm:hidden flex flex-col gap-1.5 p-2 hover:bg-amber-400/70 rounded-lg'
            onClick={() => setMenuOpen(!menuOpen)}
            >
                <span className="block w-6 h-0.5 bg-white" />
                <span className="block w-6 h-0.5 bg-white" />
                <span className="block w-6 h-0.5 bg-white" />
            </button>

            {menuOpen && (
                <div className='md:hidden absolute top-full right-0 mt-2 bg-slate-900/80 border border-amber-400 rounded-lg p-4 flex flex-col z-50 min-w-37'
                onClick={() => setMenuOpen(false)}
                >
                    {getVariantStyles(variant, handleLogout, handleLogoutAdmin, loading, true)}
                </div>
            )}
        </header>
    )
}

function getVariantStyles(variant: Variant, onLogout: () => void, onLogoutAdmin: () => void, isLoading: boolean, isMobile: boolean = false) {
    const wrapperClass = isMobile
    ? "cursor-pointer flex flex-col gap-5 items-start"
    : "flex gap-4 items-center"
    switch (variant) {
        case "home":
            return (
                <div className={wrapperClass}>
                    <Button variant='secondary'>Home</Button>
                    <ButtonLink to="/schedule" variant='secondary'>Schedule</ButtonLink>
                    <ButtonLink to="/openings" variant='secondary'>Openings</ButtonLink>
                    <ButtonLink to="/chats" variant='secondary'>Chats</ButtonLink>
                    <button
                    onClick={onLogout}
                    disabled={isLoading}
                    className={isMobile ? `ml-2 text-red-400 px-2 py-0.5 border border-zinc-100 font-medium hover:bg-red-800/90 rounded disabled:opacity-30 disabled:cursor-not-allowed`
                        : `bg-slate-900 hover:bg-amber-400 border border-amber-400 py-1.5 px-4 transition-colors rounded-lg disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                        {isLoading ? "Logging out..." : "Logout"}
                    </button>
                </div>
            )
        case "schedule":
            return (
                <div className={wrapperClass}>
                    <ButtonLink to="/home" variant='secondary'>Home</ButtonLink>
                    <Button variant='secondary'>Schedule</Button>
                    <ButtonLink to="/openings" variant='secondary'>Openings</ButtonLink>
                    <ButtonLink to="/chats" variant='secondary'>Chats</ButtonLink>
                    <button
                    onClick={onLogout}
                    disabled={isLoading}
                    className="bg-slate-900 hover:bg-amber-400 border border-amber-400 py-1.5 px-4 transition-colors rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Logging out..." : "Logout"}
                    </button>
                </div>
            )
        case "openings":
            return (
                <div className={wrapperClass}>
                    <ButtonLink to="/home" variant='secondary'>Home</ButtonLink>
                    <ButtonLink to="/schedule" variant='secondary'>Schedule</ButtonLink>
                    <Button variant='secondary'>Openings</Button>
                    <ButtonLink to="/chats" variant='secondary'>Chats</ButtonLink>
                    <button
                    onClick={onLogout}
                    disabled={isLoading}
                    className="bg-slate-900 hover:bg-amber-400 border border-amber-400 py-1.5 px-4 transition-colors rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Logging out..." : "Logout"}
                    </button>
                </div>
            )
        case "chats":
            return (
                <div className={wrapperClass}>
                    <ButtonLink to="/home" variant='secondary'>Home</ButtonLink>
                    <ButtonLink to="/schedule" variant='secondary'>Schedule</ButtonLink>
                    <ButtonLink to="/openings" variant='secondary'>Openings</ButtonLink>
                    <Button variant='secondary'>Chats</Button>
                    <button
                    onClick={onLogout}
                    disabled={isLoading}
                    className="bg-slate-900 hover:bg-amber-400 border border-amber-400 py-1.5 px-4 transition-colors rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Logging out..." : "Logout"}
                    </button>
                </div>
            )
        case "register":
            return (
                <div className={wrapperClass}>
                    <ButtonLink to="/login" variant='primary'>Login</ButtonLink>
                </div>
            )
        case "login":
            return (
                <div className={wrapperClass}>
                    <ButtonLink to="/register" variant='primary'>Register</ButtonLink>
                </div>
            )
        case "registeradmin":
            return (
                <div className={wrapperClass}>
                    <ButtonLink to="/admin/login" variant='primary'>Login</ButtonLink>
                </div>
            )
        case "loginadmin":
            return (
                <div className={wrapperClass}>
                    <ButtonLink to="/admin/register" variant='primary'>Register</ButtonLink>
                </div>
            )
        case "admin":
            return (
                <div className={wrapperClass}>
                    <button
                    onClick={onLogoutAdmin}
                    disabled={isLoading}
                    className="bg-slate-900 hover:bg-amber-400 border border-amber-400 py-1.5 px-4 transition-colors rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Logging out..." : "Logout"}
                    </button>
                </div>
            )
        default:
            throw new Error(`Invalid variant: ${variant satisfies never}`)
    }
}
