import { useEffect, useState } from "react"
import { API_URL } from "../api"
import { format } from "date-fns"

interface Role {
    _id: string
    serviceId: string
    name: string
}

interface Service {
    _id: string
    name: string
    date: string
    time: string
    status: string
    roles?: Role[]
}


export function UpcomingServicesMobile(){

    const [services, setServices] = useState<Service[] | null>(null)

    useEffect(() => {
        async function fetchServices() {
            const response = await fetch(`${API_URL}/api/services/with-roles`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data: Service[] = await response.json();
            setServices(data);
        }
        void fetchServices()
    }, [])

    return (
        <section className="pb-4">
            <h2 className="text-xl font-semibold text-slate-900 text-start pl-4 pt-5 pb-2">Upcoming Services</h2>
            <div className="flex flex-col gap-3">
                {services?.map((s) => (
                    <div key={s._id} className="rounded-lg shadow-lg border border-zinc-200 mx-4 flex flex-col gap-1 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-zinc-950 font-semibold">{s.name}</h3>
                                <h3 className="text-zinc-950">{format(new Date(s.date), 'd MMMM yyyy')}</h3>
                            </div>
                            <span className="text-zinc-950">{s.time}</span>
                        </div>
                        <div className="py-1">
                            <hr className="text-zinc-400" />
                        </div>
                        {s.roles?.map((r) => (
                            <span key={r._id} className="text-zinc-950 max-w-80 wrap-break-word">{r.name}</span>))}
                        <span className={`text-end -mt-7 ${s.status === "Roles Closed"
                                    ? "text-red-600"
                                    : "text-green-600"
                                    }`}>{s.status}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}
