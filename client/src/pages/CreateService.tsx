import { Header } from "../components/Header";
import { useNavigate } from "react-router-dom";
import { ButtonLink } from "../components/ButtonLink";
import { Form } from "../components/Form";
import { Heading } from "../components/Heading";
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { API_URL } from "../api"
import {useAuth} from "../hooks/useAuth.ts";

type Role = {
    id: number;
    name: string;
    spotsTotal: number | string;
}

export function CreateService() {

    const navigate = useNavigate();
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        date: "",
        time: "",
        status: 'Roles Open',
    });

    const [roles, setRoles] = useState<Role[]>(() => [
        { id: Date.now(), name: "", spotsTotal:"" },
    ]);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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

    function handleRoleChange(id: number, field: keyof Omit<Role, "id">, value: string){
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
            const response = await fetch(`${API_URL}/api/services/create`, {
                method: "POST",
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
                setError(data.message || "Failed to create service. Please try again.");
                return;
            }

            navigate("/admin/services");

        } catch {
            setError("Could not connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    }
    return(
        <div className="mx-auto px-12 py-5 flex flex-col gap-15 items-center select-none">
            <Header variant="admin" />
            <div className="flex flex-col gap-3 p-7 bg-slate-800 items-center rounded-xl w-130">
                <div className="mt-2 mr-auto">
                    <Heading>Create New Service</Heading>
                </div>
                <div className="-mt-2 mb-3 mr-auto">
                    <h2 className="text-zinc-400 text-sm">Fill out the details to define the service schedule and roles</h2>
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
                    {loading ? "Creating..." : "Create Service"}
                </button>

                <div className="flex items-center mt-1">
                    <ButtonLink to='/admin/services' variant="secondary" className="text-amber-400 text-sm">← Back to Services</ButtonLink>
                </div>
            </div>
        </div>
    )
}
