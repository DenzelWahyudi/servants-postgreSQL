import React, { useEffect, useState } from "react"
import { UserPlus, UserMinus } from 'lucide-react'
import { API_URL } from "../api"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import { Heading } from "./Heading"
import { useAuth } from "../hooks/useAuth.ts";


type RoleFormProps = {
    userId?: string
    roleId: string
    serviceName: string
    roleName: string
    onClose: () => void
    token: string | null
}

type RolesCardProps = {
    serviceId: string
    serviceName:string
    serviceTime: string
    serviceDate: string
}

interface Assign {
    roleId: string
    serviceName: string
    roleName: string
}

interface RelieveUser {
    userId: string
    name: string
}

interface User {
    _id: string
    name: string
}

interface Role {
    _id: string
    name: string
    spotsTotal: number
    spotsFilled: number
    userNames: string[]
}


export function RolesCard({ serviceId, serviceName, serviceTime, serviceDate }: RolesCardProps){

    const [roles, setRoles] = useState<Role[] | null>(null)
    const [assignData, setAssignData] = useState<Assign | null>(null)
    const [relieveData, setRelieveData] = useState<Assign | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)
    const { token } = useAuth()

    useEffect(() => {
        async function fetchService() {
            
            const response = await fetch(`${API_URL}/api/roles/assignedusersforroles/${serviceId}`, {
                method: "GET",
                headers: { "Content-Type": "applicaton/json" }
            })
            const data: Role[] = await response.json()

            const sorted = data.sort((a, b) => a.name.localeCompare(b.name))
            setRoles(sorted)
        }
        void fetchService()

    }, [serviceId, refreshKey])

    if(!roles) return <div>Loading...</div>

    return (
        <div className="bg-white rounded-lg p-2.5">
            <table className="table-fixed w-full text-sm text-left text-zinc-300 rounded-lg overflow-hidden">
                <caption className="bg-slate-900 text-lg font-semibold text-zinc-100 text-left py-1.5 px-2.5">{serviceName} - {format(new Date(serviceDate), 'd MMMM yyyy')}, {serviceTime}</caption>
                <thead className="text-zinc-950 font-medium bg-zinc-200">
                    <tr>
                        <th className="w-[25%] px-2.5 py-2">Role</th>
                        <th className="w-[48%]">Assigned To</th>
                        <th className="w-[11%] text-center">Slots Filled</th>
                        <th className="w-[7%] text-center">Status</th>
                        <th className="w-[9%] text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {roles?.map((r) => (
                        <tr key={r._id} className="border-b border-zinc-200 text-zinc-900">
                            <td className="px-2.5 py-2 wrap-break-word">{r.name}</td>
                            <td className="py-2 wrap-break-word">{r.userNames?.join(", ") ?? "..."}</td>
                            <td className="text-center">{r.spotsFilled}/{r.spotsTotal}</td>
                            <td className="text-center">
                                <span className={`py-1 px-2.5 text-xs rounded-xl text-zinc-100 font-light shadow
                                ${r.spotsFilled >= r.spotsTotal ? "bg-red-600" : "bg-green-600"}`}>
                                    {r.spotsFilled >= r.spotsTotal ? "Filled" : "Open"}
                                </span>
                            </td>
                            <td>
                                <div className="flex gap-1 py-2 items-center justify-center">
                                    <button
                                    onClick={() => setRelieveData({
                                        roleId: r._id,
                                        serviceName: serviceName,
                                        roleName: r.name
                                    })}
                                    className="bg-zinc-100 px-1.5 py-1 rounded-lg border border-zinc-400 hover:bg-zinc-300 disabled:bg-red-300 trasition-colors"
                                    >
                                        <UserMinus size={16} className="text-slate-900"/>
                                    </button>  
                                    <button
                                    disabled={r.spotsFilled >= r.spotsTotal}
                                    onClick={() => setAssignData({
                                        roleId: r._id,
                                        serviceName: serviceName,
                                        roleName: r.name
                                    })}
                                    className="bg-zinc-100 px-1.5 py-1 rounded-lg border border-zinc-400 hover:bg-zinc-300 disabled:bg-red-300 trasition-colors"
                                    >
                                        <UserPlus size={16} className="text-slate-900"/>
                                    </button>    
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {assignData && (
                <div 
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setAssignData(null)}
                >
                    <div
                    onClick={(e) => e.stopPropagation()}
                    className="max-h-[90vh] overflow-y-auto"
                    >
                        <AssignRoleForm
                        roleId={assignData.roleId}
                        serviceName={assignData.serviceName}
                        roleName={assignData.roleName}
                        onClose={() => {
                            setAssignData(null)
                            setRefreshKey(k => k + 1)
                        }}
                        token={token}
                        />
                    </div>
                </div>
            )}
            {relieveData && (
                <div 
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setRelieveData(null)}
                >
                    <div
                    onClick={(e) => e.stopPropagation()}
                    className="max-h-[90vh] overflow-y-auto"
                    >
                        <RelieveRoleForm
                        roleId={relieveData.roleId}
                        serviceName={relieveData.serviceName}
                        roleName={relieveData.roleName}
                        onClose={() => {
                            setRelieveData(null)
                            setRefreshKey(k => k + 1)
                        }}
                        token={token}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}


function RelieveRoleForm({ roleId, serviceName, roleName, onClose, token }: RoleFormProps){

    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [users, setUsers] = useState<RelieveUser[] | null>(null)
    const [user, setUser] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchUsers(){
            const usersRes = await fetch(`${API_URL}/api/assignments/relieve/${roleId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            const usersData: RelieveUser[] = await usersRes.json()
            setUsers(usersData)
        }
        void fetchUsers()
    }, [roleId])

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>){
            setUser(e.target.value)
    }

    async function handleRemove(userId: string, roleId: string){
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/api/assignments/relieve`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userId, roleId })
        })
        const data = await response.json()
        if (!response.ok){
            setError( data.message || "Failed to relieve user")
            setLoading(false)
            return
        }

        setLoading(false)
        if (onClose) onClose()
    }

    return (
        <div className="flex flex-col gap-3 bg-slate-900 rounded-lg p-4.5 w-110 select-none">
            <div className="pb-2.5">
                <h1 className="text-4xl font-bold text-red-400">Relieve Role</h1>
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
                <span className="text-base text-left p-1 pl-2 border border-zinc-600 rounded w-full overflow-x-auto">
                    {roleName}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <h3 className="text-sm text-zinc-100 font-light">Remove Assignment</h3>
                <select
                    value={user}
                    onChange={handleChange}
                    className={`border border-zinc-600 focus:border-amber-400 outline-none text-base 
                    text-left p-1 pl-2 rounded w-full transition-colors ${user ? '' : 'text-zinc-500 font-medium'}`}>
                        <option value="" disabled>Select a user</option>
                        {users?.map((user) => (
                            <option key={user.userId} value={user.userId}>{user.name}</option>
                        ))}
                </select>
            </div>
            {error && <p className="text-red-600 text-sm -mb-6.5 pl-1">{error}</p>}
            <div className="flex gap-2 mt-10 justify-end">
                <button 
                onClick={() => onClose ? onClose() : navigate('/admin/roles')}
                className="bg-zinc-600 rounded-lg px-3 py-1.5 text-zinc-200 text-base hover:bg-zinc-700">
                    Cancel
                </button>
                <button
                onClick={() => handleRemove(user!, roleId)}
                disabled={!user || loading}
                className="bg-amber-400 rounded-lg px-3 py-1.5 text-slate-900 text-base hover:bg-amber-500 disabled:bg-zinc-500">
                    {loading ? "Removing..." : "Remove"}
                </button>
            </div>
        </div>
    )
}


function AssignRoleForm({ roleId, serviceName, roleName, onClose, token }: RoleFormProps){

    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [users, setUsers] = useState<User[] | null>(null)
    const [user, setUser] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchUsers(){
            const response = await fetch(`${API_URL}/api/users`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            const data: User[] = await response.json()
            setUsers(data)
        }
        void fetchUsers()
    }, [])

    async function handleAssign(userId: string, roleId: string){
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/assignments/admin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId,
                    roleId,
                    status: "confirmed"
                })
            });

            const data = await response.json()
            if (!response.ok){
                setError(data.message || "Assigning failed!")
                setLoading(false)
                return
            }

            setLoading(false)

            if (onClose) onClose()
            else navigate('/admin/roles')
        } catch {
            setError("Could not connect to server")
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>){
            setUser(e.target.value)
    }

    return (
        <div className="flex flex-col gap-3 bg-slate-900 rounded-lg p-4.5 w-110 select-none">
            <div className="pb-2.5">
                <Heading>Assign Role</Heading>
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
                <span className="text-base text-left p-1 pl-2 border border-zinc-600 rounded w-full overflow-x-auto">
                    {roleName}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <h3 className="text-sm text-zinc-100 font-light">Assign To</h3>
                <select
                    value={user}
                    onChange={handleChange}
                    className={`border border-zinc-600 focus:border-amber-400 outline-none text-base 
                    text-left p-1 pl-2 rounded w-full transition-colors ${user ? '' : 'text-zinc-500 font-medium'}`}>
                        <option value="" disabled>Select a user</option>
                        {users?.map((user) => (
                            <option key={user._id} value={user._id}>{user.name}</option>
                        ))}
                </select>
            </div>
            {error && <p className="text-red-600 text-sm -mb-6.5 pl-1">{error}</p>}
            <div className="flex gap-2 mt-10 justify-end">
                <button 
                onClick={() => onClose ? onClose() : navigate('/admin/roles')}
                className="bg-zinc-600 rounded-lg px-3 py-1.5 text-zinc-200 text-base hover:bg-zinc-700">
                    Cancel
                </button>
                <button
                onClick={() => handleAssign(user!, roleId)}
                disabled={!user || loading}
                className="bg-amber-400 rounded-lg px-3 py-1.5 text-slate-900 text-base hover:bg-amber-500 disabled:bg-zinc-500">
                    {loading ? "Assigning..." : "Assign"}
                </button>
            </div>
        </div>
    )
}