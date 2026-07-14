import React, { useEffect, useState } from "react";
import { Trash2, Pencil } from 'lucide-react';
import { API_URL } from "../api"
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Form } from "./Form";
import { Heading } from "./Heading";
import {useAuth} from "../hooks/useAuth.ts";


type Role2 = {
    id: number
    name: string
    spotsTotal: number | string
}

type SavedRole = {
    id: string
    serviceId: string
    name: string
}

type EditServiceFormProps = {
    id: string
    onClose?: () => void
    onSave?: (updated: Service & { roles: SavedRole[] }) => void
    token: string | null
}

interface Service {
    id: string
    name: string
    date: string
    time: string
    status: string
}

interface RoleInterface {
    name: string
    spotsTotal: string
}

interface Role {
    id: string
    serviceId: string
    name: string,
}

interface Service {
    id: string,
    name: string,
    date: string,
    time: string,
    status: string,
    roles?: Role[]
}


export function UpcomingServicesAdmin(){

    const [services, setServices] = useState<Service[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [toBeDelete, setToBeDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth()
    
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

    async function handleDelete(serviceId: string){
        setLoading(true)
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/services/delete/${serviceId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.message || "Deletion failed. Please try again");
                return;
            }

            setServices(prev => prev?.filter(s => s.id !== serviceId) ?? null)
            setLoading(false)
        } catch {
            setError("Could not connect to the server. Please try again.")
        }
    }

    function handleStatusChange(serviceId: string){
        return async (e: React.ChangeEvent<HTMLSelectElement>) => {
            setError(null)
            const newStatus = e.target.value
            const response = await fetch(`${API_URL}/api/services/updatestatus/${serviceId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            })
            if (!response.ok){
                setError("Failed to update service status")
                return
            }
            setServices((prev) => 
            prev?.map((s) => s.id === serviceId ? { ...s, status: newStatus} : s) ?? null)
        }
    }

    return (
        <section className="bg-white py-4 border-b border-zinc-200">
            <h2 className="text-3xl font-semibold text-slate-900 text-center mb-3">Upcoming Services</h2>
            <table className="w-full table-fixed text-sm text-left text-zinc-300">
                <thead className="text-zinc-950 border-amber-400 border-b-2 border-t-2">
                    <tr>
                        <th className="w-[18%] pl-3 py-2">Upcoming Service</th>
                        <th className="w-[14%]">Date</th>
                        <th className="w-[13%]">Time</th>
                        <th className="w-[33%]">Roles Needed</th>
                        <th className="w-[11%] text-center">Status</th>
                        <th className="w-[11%] text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {services?.map((s, index) => (
                        <tr key={s.id} className="border-b border-zinc-400 text-zinc-950">
                            <td className="pl-3 font-medium wrap-break-word">{s.name}</td>
                            <td>{format(new Date(s.date), 'dd MMMM yyyy')}</td>
                            <td>{s.time}</td>
                            <td className="py-3 pr-4 wrap-break-word">{s.roles?.map(r => r.name).join(", ") ?? "..."}</td>
                            <td>
                                <div className="flex items-center justify-center">
                                    <select value={s.status} onChange={handleStatusChange(s.id)}
                                    className={`py-1 rounded font-semibold text-[13.5px] inline-block w-27 text-center ${s.status === "Roles Closed"
                                    ? "bg-red-200"
                                    : "bg-green-200"
                                    }`}
                                    >
                                        <option value="Roles Open">Roles Open</option>
                                        <option value="Roles Closed">Roles Closed</option>
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div className="flex gap-1 items-center justify-center">
                                    <button
                                    onClick={() => setEditingId(s.id)}
                                    className="bg-zinc-100 px-2 py-1.5 rounded-lg border border-zinc-400 hover:bg-zinc-300 transition-colors">
                                        <Pencil size={15} className="text-slate-900" />
                                    </button>
                                    <div className="relative">
                                        <button
                                        onClick={() => setToBeDelete(s.id)}
                                        className="bg-red-100 px-2 py-1.5 rounded-lg border border-zinc-400 hover:bg-red-300 transition-colors">
                                            <Trash2 size={15} className="text-red-900" />
                                        </button>
                                        {toBeDelete === s.id && (
                                            <>
                                                <div 
                                                className="fixed inset-0 z-40"
                                                onClick={() => setToBeDelete(null)}
                                                />
                                                    <div className={`absolute ${index < services.length-1 ? "top-full mt-1" : "bottom-full mb-1" } right-0 w-24 z-50 
                                                    flex flex-col gap-1 items-center bg-slate-800 text-white text-xs rounded-lg p-2 shadow-lg`}>
                                                        <span>Are you sure?</span>
                                                        <div className="flex gap-3 items-center">
                                                            <button 
                                                            disabled={loading}
                                                            onClick={() => handleDelete(toBeDelete)}
                                                            className="hover:text-amber-400 disabled:text-amber-400">
                                                                Yes
                                                            </button>
                                                            <button 
                                                            onClick={() => setToBeDelete(null)}
                                                            className="hover:text-amber-400">
                                                                No
                                                            </button>
                                                        </div>
                                                    </div>
                                            </>
                                        )}
                                    </div>
                                    {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        {editingId && (
            <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
                <div 
                onClick={(e) => e.stopPropagation()}
                className="max-h-[90vh] overflow-y-auto"
                >
                    <EditServiceForm 
                    id={editingId} 
                    onClose={() =>{setEditingId(null)}}
                    onSave={(updated) => {
                        setServices(prev => prev?.map(s => s.id === updated.id ? { ...s, ...updated, roles: updated.roles } : s)?? null)
                    }}
                    token={token}
                    />
                </div>
            </div>
        )}
        </section>
    )
}


function EditServiceForm({ id, onClose, onSave, token }: EditServiceFormProps){
    
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        date: "",
        time: "",
        status: 'Roles Open',
    });

    const [roles, setRoles] = useState<Role2[]>(() => [
        { id: Date.now(), name: "", spotsTotal:"" },
    ]);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchService(){
            const response = await fetch(`${API_URL}/api/services/${id}/with-roles`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const service = await response.json();

            setFormData({
                name: service.name,
                date: service.date.split("T")[0],
                time: service.time,
                status: service.status
            });

            setRoles(
                service.roles.map((r: RoleInterface) => ({
                    id: Date.now() + Math.random(),
                    name: r.name,
                    spotsTotal: r.spotsTotal
                }))
            );
        }
        void fetchService();
    },[id, token]);
    

    function handleChange(field: keyof typeof formData){
        return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setFormData((prev) => ({ ...prev, [field]: e.target.value}))
    }

    function handleNameChange(field: keyof typeof formData){
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, [field]: e.target.value.length > 20 ? prev[field] : e.target.value}))
    }

    function handleTimeChange(field: keyof typeof formData){
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, [field]: e.target.value.length > 13 ? prev[field] : e.target.value}))
    }

    function handleRoleChange(id: number, field: keyof Omit<Role2, "id">, value: string){
        setRoles((prev) =>
            prev.map((role) =>
                role.id === id
                    ? { ...role, [field]: field === "spotsTotal" 
                        ? value === "" ? "" : Number(value) < 0 ? 0 : Number(value) : value}
                    : role
            )
        );
    }

    function addRole(){
        setRoles((prev) => [...prev, { id: Date.now(), name:"", spotsTotal: ""}])
    }

    function removeRole(id: number){
        setRoles((prev) => prev.filter((role) => role.id != id));
    }

    async function handleSubmit(){
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/services/update/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    ...formData, 
                    roles: roles.map(role => ({
                        ...role,
                        spotsTotal: role.spotsTotal === "0" ? 0 : Number(role.spotsTotal)
                    }))
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to update service. Please try again.");
                return;
            }

            if (onClose) onClose();
            if (onSave) onSave({id: id, ...formData, roles: roles.map(({ name }) => ({
                id: "",
                serviceId: id,
                name
                }))
            });
            else navigate("/admin/services");

        } catch {
            setError("Could not connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-3 p-7 bg-slate-800 items-center rounded-xl w-130">
            <div className="mt-2 mr-auto">
                <Heading>Update Service</Heading>
            </div>
            <div className="-mt-2 mr-auto">
                <h2 className="text-zinc-400 text-sm">Fill out the details to define the service schedule and roles</h2>
            </div>
            <div className="-mt-2.5 mb-3 mr-auto">
                <h2 className="text-red-400 text-sm">Updating this service will remove all current role assignments.</h2>
            </div>

            <Form label="Service Name"  value={formData.name}   onChange={handleNameChange("name")} placeholder="e.g., Sunday Sevice (max 30 chars)" />
            <div className="flex gap-10 w-full justify-between">
                <div className="flex flex-col gap-1 flex-1">
                    <h3 className="text-sm text-zinc-300">Date</h3>
                    <input type="date"  value={formData.date}   onChange={handleChange("date")}  
                    className="bg-slate-700 border border-slate-600 focus:border-amber-400 outline-none 
                    text-zinc-400 text-sm rounded-lg px-3 py-2 transition-colors"/>
                </div>
                <div className="flex-1">
                    <Form label="Time"  value={formData.time}   onChange={handleTimeChange("time")} placeholder="🕖  09:00"/>
                </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
                <h3 className="text-base text-zinc-300">Roles & Spots</h3>

                <div className="flex gap-3 w-full">
                    <h4 className="text-sm text-zinc-400 flex-1">Role Name</h4>
                    <h4 className="text-sm text-zinc-400 w-24">Total Spots</h4>
                    <div className="w-5" />
                </div>

                {roles.map((role) => (
                    <div key={role.id} className="flex gap-3 items-center w-full">
                        <input 
                        type="text"
                        placeholder="e.g., Worship Leader"
                        value={role.name}
                        onChange={(e) => handleRoleChange(role.id, "name", e.target.value)}
                        className="flex-1 bg-slate-700 border border-slate-600 focus:border-amber-400 outline-none text-zinc-100 text-sm rounded-lg px-3 py-2 transition-colors"
                        />
                        <input 
                        type="number"
                        placeholder="0"
                        value={role.spotsTotal}
                        onChange={(e) => handleRoleChange(role.id, "spotsTotal", e.target.value)}
                        className="w-24 bg-slate-700 border border-slate-600 focus:border-amber-400 outline-none text-zinc-100 text-sm rounded-lg px-3 py-2 transition-colors"
                        />
                        <button
                        onClick={() => removeRole(role.id)}
                        className="text-zinc-400 hover:text-red-400 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}

                <button
                onClick={addRole}
                className="mt-1 w-full border border-dashed border-slate-600 hover:border-amber-400 text-zinc-400 hover:text-amber-400 text-sm rounded-lg py-2 transition-colors"
                >
                    + Add Role
                </button>
            </div>

            <div className="flex flex-col gap-1 flex-1 mr-auto mb-3">
                <h3 className="text-sm text-zinc-300">Status</h3>
                <select                  value={formData.status}  onChange={handleChange("status")}
                className="bg-slate-700 border border-slate-600 focus:border-amber-400 outline-none text-zinc-100 text-sm rounded-lg px-3 py-2 transition-colors"
                >
                    <option value="Roles Open">Roles Open</option>
                    <option value="Roles Closed">Roles Closed</option>
                </select>
            </div>

            {error && (
                <p className="text-red-400 text-sm text-center w-full">{error}</p>
            )}

            <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-amber-400 text-blue-950 text-base font-semibold py-1.5 rounded-lg w-full mt-auto hover:bg-amber-500 flex justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? "Updating..." : "Update Service"}
            </button>

            <div className="flex items-center mt-1">
                <button
                onClick={() => onClose ? onClose() : navigate("admin/services")}
                className="text-amber-400 text-sm"
                >
                    ← Back to Services
                </button>
            </div>
        </div>
    )
}
