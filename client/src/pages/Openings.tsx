import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Heading } from "../components/Heading";
import { useAuth } from "../hooks/useAuth";
import { API_URL } from "../api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";


type SignUpCardProps = {
    userId: string
    roleId: string
    serviceName: string
    roleName: string
    date: string
    onClose: () => void
    onSave: () => void
}

type OpeningsCardProp = {
    serviceName: string,
    date: string,
    time: string,
    role: string,
    roleId: string,
    userId: string
    onSave: () => void
}

interface SignUp {
    roleId: string
    serviceName: string
    roleName: string
}

interface Service {
    _id: string
    name: string
    date: string
    time: string
    status: string
}

interface Role {
    _id: string
    serviceId: string
    name: string
    spotsTotal: number
    spotsFilled: number
}


export function Openings() {

    const [services, setServices] = useState<Service[] | null>(null)
    const [roles, setRoles] = useState<Role[] | null>(null)
    const [userId, setUserId] = useState("")
    const { token } = useAuth();

    useEffect(() => {
        async function fetchRoles() {
            const roles = await fetch(`${API_URL}/api/roles`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            const rolesData = await roles.json()
            setRoles(rolesData)

            const services = await fetch(`${API_URL}/api/services`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const servicesData = await services.json()
            setServices(servicesData)
        }
        async function fetchUser() {
            const response = await fetch(`${API_URL}/api/users/id`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            const data = await response.json()
            setUserId(data)
        }
        if (token) {
            void fetchUser()
        }
        void fetchRoles()
    }, [token])

    async function fetchRoles() {
        const roles = await fetch(`${API_URL}/api/roles`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        const rolesData = await roles.json()
        setRoles(rolesData)

        const services = await fetch(`${API_URL}/api/services`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const servicesData = await services.json()
        setServices(servicesData)
    }
    
    return(
        <div className="mx-auto p-4 sm:px-12 py-5 flex flex-col gap-13">
            <Header variant="openings" />
            <div className="-mt-8">
                <Heading>Openings</Heading>
            </div>
            <div className="min-h-130">
                <div className="-mt-7 flex flex-wrap gap-2 sm:gap-4 ">
                    {roles?.map((role) => {
                        if (role.spotsFilled < role.spotsTotal){
                            const service = services?.find(s => s._id === role.serviceId && s.status == "Roles Open")
                            if (!service) return null

                            return (
                                <OpeningsCard key={role._id} serviceName={service.name} 
                                date={format(new Date(service.date), 'd MMMM yyyy')} 
                                time={service.time} 
                                role={role.name} 
                                roleId={role._id}
                                userId={userId}
                                onSave={() => {void fetchRoles()}}
                                />
                            )
                        }
                    })}
                </div>
            </div>
            <Footer />
        </div>
    )
}


function SignUpCard({ userId, roleId, serviceName, roleName, date, onClose, onSave }: SignUpCardProps){

    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleAssign(userId: string, roleId: string){
        setError(null);
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/api/assignments`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    userId,
                    roleId,
                    status: "pending"
                })
            });

            const data = await response.json()
            if (!response.ok){
                setError(data.message || "Sign Up failed!")
                return
            }

            if (onSave) onSave()
            else navigate('/openings')
        } catch {
            setError("Could not connect to server")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-3 bg-slate-900 rounded-lg p-4.5 w-85 sm:w-110 text-zinc-100">
            <div className="pb-2.5">
                <Heading>Sign Up</Heading>
            </div>
            <hr className="-mx-4.5 border-0 h-0.5 bg-amber-400"/>
            <div className="flex flex-col gap-1">
                <h3 className="text-sm text-zinc-100 font-light mt-3.5">Service</h3>
                <span className="text-base text-left p-1 pl-2 border border-zinc-600 rounded w-full">
                    {serviceName}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <h3 className="text-sm text-zinc-100 font-light">Role</h3>
                <span className="text-base text-left p-1 pl-2 border border-zinc-600 rounded w-full">
                    { roleName.length > 30 ? roleName.slice(0, 30) + "...": roleName}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <h3 className="text-sm text-zinc-100 font-light">Date</h3>
                <span className="text-base text-left p-1 pl-2 border border-zinc-600 rounded w-full">
                    {date}
                </span>
            </div>
            {error && <p className="text-red-600 text-sm -mb-6.5 pl-1">{error}</p>}
            <div className="flex gap-2 mt-10 justify-end">
                <button 
                onClick={() => onClose ? onClose() : navigate('/openings')}
                className="bg-zinc-600 rounded-lg px-3 py-1.5 text-zinc-200 text-base hover:bg-zinc-700">
                    Cancel
                </button>
                <button
                onClick={() => handleAssign(userId, roleId)}
                disabled={loading}
                className="bg-amber-400 rounded-lg px-3 py-1.5 text-slate-900 text-base hover:bg-amber-500">
                    {loading ? "Loading..." : "Sign Up"}
                </button>
            </div>
        </div>
    )
}

function OpeningsCard({ serviceName, date, time, role, roleId, userId, onSave }: OpeningsCardProp){

    const [signUpData, setSignUpData] = useState<SignUp | null>(null)

    return (
        <div className="flex flex-col gap-3 bg-zinc-100  text-slate-900 w-43 sm:w-55 h-52 rounded-lg p-3 sm:p-3.5 select-none">
            <h2 className="hidden sm:block font-semibold">{ serviceName }</h2>
            <h2 className="sm:hidden font-semibold">{ serviceName.length > 13 ? serviceName.slice(0, 11) + " ...": serviceName }</h2>
            <div className="flex flex-col gap-1">
                <h2>{ date }</h2>
                <h2>{ time }</h2>
            </div>
            <h2 className="hidden sm:block font-semibold">{ role.length > 17 ? role.slice(0, 17) + "...": role }</h2>
            <h2 className="sm:hidden font-semibold">{ role.length > 12 ? role.slice(0, 12) + "...": role }</h2>
            <div className="flex justify-center mt-auto">
                <button
                onClick={() => setSignUpData({
                    roleId,
                    serviceName,
                    roleName: role
                })}
                className="bg-amber-400 text-blue-950 text-sm font-medium px-2 py-1 rounded-lg w-full
                mt-auto hover:bg-amber-500 flex justify-center transition-colors"
                >
                    Sign Up
                </button>
            </div>
            {signUpData && (
                <div 
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setSignUpData(null)}
                >
                    <div
                    onClick={(e) => e.stopPropagation()}
                    className="max-h-[90vh] overflow-y-auto"
                    >
                        <SignUpCard 
                        userId={userId}
                        roleId={signUpData.roleId}
                        serviceName={signUpData.serviceName}
                        roleName={signUpData.roleName}
                        date={date}
                        onClose={() => {
                            setSignUpData(null)
                        }}
                        onSave={() => { 
                            onSave() 
                            setSignUpData(null)
                        }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}