import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Heading } from "../components/Heading";
import { Sidebar } from "../components/Sidebar";
import { API_URL } from "../api";
import { format } from "date-fns";
import { useAuth } from "../hooks/useAuth.ts";


type AdmitCardProps = {
    _id: string
    roleId: string
    userName: string
    roleName: string
    serviceName: string
    date: string
    time: string
    onSave: () => void
    token: string | null
}

interface Assignment {
    _id: string
    userName: string
    roleId: string
    roleName: string
    serviceName: string
    date: string
    time: string
}


export function AdminAdmissions(){

    const [assignments, setAssignments] = useState<Assignment[] | null>(null)
    const { token } = useAuth();

    useEffect(() => {
        async function fetchPendingAssignments() {
            const response = await fetch(`${API_URL}/api/assignments/pendingstatus`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data: Assignment[] = await response.json()
            setAssignments(Array.isArray(data) ? data : [])
        }
        void fetchPendingAssignments()
    }, [])

    async function fetchPendingAssignments() {
        const response = await fetch(`${API_URL}/api/assignments/pendingstatus`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data: Assignment[] = await response.json()
        setAssignments(Array.isArray(data) ? data : [])
    }

    return (
        <div className="flex flex-col overflow-y-auto h-screen">
        <div className="px-6.5 py-4">
            <Header variant="admin"/>
        </div>
        <div className="flex flex-1">
            <Sidebar variant="admissions" />
            <div className="flex flex-col bg-zinc-100/2 px-10 w-full h-full">
                <div className="flex justify-between py-7 items-center">
                    <Heading>Manage Admissions</Heading>
                </div>
                <div className="flex flex-wrap gap-4">
                    {assignments?.map((a) =>
                        <div key={a._id}>
                            <AdmitCard _id={a._id} userName={a.userName} roleId={a.roleId} roleName={a.roleName}
                                       serviceName={a.serviceName} date={a.date} time={a.time}
                                       onSave={() => {void fetchPendingAssignments()}} token={token}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>
    )
}


function AdmitCard({ _id, userName, roleId, roleName, serviceName, date, time, onSave, token }:AdmitCardProps){

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [declineLoading, setDeclineLoading] = useState(false)

    async function handleUpdateStatus(assigmentId: string, status: string){
        if (status === "declined") setDeclineLoading(true)
        else setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/api/assignments/updatestatus/${assigmentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status, roleId })
            })
        const data = await response.json()

        if (!response.ok){
            setError(data)
            setLoading(false)
            setDeclineLoading(false)
            return
        }

        setLoading(false)
        setDeclineLoading(false)

        onSave()
    }

    return (
            <div className="flex flex-col gap-2  bg-zinc-100  text-slate-900 w-55 h-57 rounded-lg p-3.5 select-none">
                <h2 className="font-semibold">{ serviceName }</h2>
                <div className="flex flex-col gap-1">
                    <h2>{format(date, 'dd MMMM yyyy')}</h2>
                    <h2>{ time }</h2>
                </div>
                <h2 className="font-semibold">{ roleName.length > 17 ? roleName.slice(0, 17) + "...": roleName}</h2>
                <h2 className="font-semibold">{ userName.length > 19 ? userName.slice(0, 17) + "...": userName}</h2>
                <div className="flex justify-between mt-auto">
                    <button
                    onClick={() => {
                        void handleUpdateStatus(_id, "declined")
                        onSave()
                    }}
                    disabled={declineLoading}
                    className="bg-zinc-500 text-zinc-100 text-sm font px-2 py-1 rounded-lg w-22
                    mt-auto hover:bg-zinc-600 flex justify-center transition-colors"
                    >
                        {declineLoading ? "Loading" : "Decline"}
                    </button>
                    <button
                    onClick={() => { void handleUpdateStatus(_id, "confirmed")}}
                    disabled={loading}
                    className="bg-amber-400 text-slate-900 text-sm font-medium px-2 py-1 rounded-lg w-22
                    mt-auto hover:bg-amber-500 flex justify-center transition-colors"
                    >
                        {loading ? "Loading" : "Confirm"}
                    </button>
                </div>
                { error && ( <p className="text-red-400 text-sm text-center w-full">{error}</p>) }
            </div>
        )
}