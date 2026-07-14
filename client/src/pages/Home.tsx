import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { UpcomingServices } from "../components/UpcomingServices"
import bell from '../assets/icons/bell.svg'
import calendar from '../assets/icons/calendar.svg'
import user from '../assets/icons/user.svg'
import React, { useEffect, useState } from 'react'
import { useAuth } from "../hooks/useAuth"
import { startOfToday, isEqual, startOfDay, format } from "date-fns"
import { API_URL } from "../api"
import { UpcomingServicesMobile } from "../components/UpcomingServicesMobile"
import { ButtonLink } from "../components/ButtonLink"


type StatsCardProps = {
	icon: React.ReactNode
	title: string
	buttonLabel: string
	linkTo?: string
	onClick?: () => void
	onDisabled?: boolean
}

interface Schedule {
    roleName: string
    serviceName: string
    date: Date
    time: string
}

interface Role {
    spotsTotal: number
    spotsFilled: number
}

interface Assignment {
	_id: string
	serviceName: string
	roleName: string
	date: string
	time: string
	status: string
}


export function Home() {

	const [userName, setUserName] = useState<string | null>(null)
	const [schedule, setSchedule] = useState<Schedule[] | null>(null)
	const [roles, setRoles] = useState<Role[] | null>(null)
	const [assignments, setAssignments] = useState<Assignment[] | null>(null)
	const { token } = useAuth();
	const [loading, setLoading] = useState(false)

	const todayServiceCount = schedule?.filter((s) => {
		const serviceDate = startOfDay(new Date(s.date))
		return isEqual(serviceDate, startOfToday())
	}).length ?? 0

	const openRoles = roles?.filter((r) => {
		if (r.spotsFilled < r.spotsTotal) return true
	}).length ?? null

	useEffect(() => {
		async function fetchUser() {
			const response = await fetch(`${API_URL}/api/users/name`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			})
			const data = await response.json()
			setUserName(data)
		}
		async function fetchSchedule() {
			const response = await fetch(`${API_URL}/api/assignments/schedule`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			})
			const data: Schedule[] = await response.json()
			setSchedule(Array.isArray(data) ? data : [])
		}
		async function fetchRoles() {
			const roles = await fetch(`${API_URL}/api/roles`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				},
			})
			const rolesData = await roles.json()
			setRoles(rolesData)
		}
		if (token) {
			void fetchUser()
			void fetchSchedule()
		}
		void fetchRoles()
	}, [token])

	async function getAssignments(){
		setLoading(true)
		const response = await fetch(`${API_URL}/api/assignments/all`, {
			method: "GET",
			headers: { 
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json"
			}
		})
		const data: Assignment[] = await response.json()
		setAssignments(data)
		setLoading(false)
	}

	return (
		<div className="mx-auto px-4 sm:px-12 py-5 flex flex-col gap-15 select-none">
			<Header variant="home"/>

			<header className="hidden sm:flex flex-col gap-5 items-center justify-center w-full">
				<div className="flex gap-2 items-center">
					<h1 className="text-4xl font-bold">Home</h1>
					<h1 className="text-4xl font-semibold"> - </h1>
					<h1 className="text-4xl font-bold text-amber-400">Welcome Back, {userName ?? '...'}</h1>
				</div>
				<div className="flex gap-4 items-center">
					<StatsCard linkTo="/schedule" icon={<img src={bell} width={40}  alt=""/>} title={`${todayServiceCount} Service Reminders Sent Today`} buttonLabel="View Schedule" ></StatsCard>
					<StatsCard onClick={getAssignments} icon={<img src={user} width={40}  alt=""/>} title="Pending Sign-ups" buttonLabel="Review Now" ></StatsCard>
					<StatsCard linkTo="/openings" icon={<img src={calendar} width={40}  alt=""/>} title={`Open Recruitment: ${openRoles}`} buttonLabel="Fill Remaining Roles" ></StatsCard>
				</div>
			</header>

			<div className="sm:hidden flex flex-col items-center gap-6">
				<h1 className="text-3xl text-amber-400 font-semibold">Hello, <span className="text-zinc-100">{userName ?? '...'}</span></h1>
				<div className="flex gap-2">
					<StatsCard linkTo="/schedule" icon={<img src={bell} width={40} alt=""/>} title={`${todayServiceCount} Service Reminders Today`} buttonLabel="View Schedule" ></StatsCard>
					<StatsCard onClick={getAssignments} icon={<img src={user} width={40} alt=""/>} title="Pending Sign-ups" buttonLabel="Review Now" onDisabled={loading}></StatsCard>
				</div>
				<div className="min-h-130 bg-white w-screen">
					<UpcomingServicesMobile />
				</div>
			</div>

			<div className="hidden sm:block lg:hidden bg-white -mx-12 -my-8 min-h-130">
					<UpcomingServicesMobile />
			</div>

			<div className="hidden lg:block bg-white -mx-12 -my-8 px-12 pb-10 min-h-90">
					<UpcomingServices />
			</div>
			<Footer />
			{assignments && (
				<div
				className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setAssignments(null)}
				>
					<div
					onClick={(e) => e.stopPropagation()}
					className="max-h-[90vh] overflow-y-auto"
					>
						<div className="rounded-lg overflow-hidden shadow-lg border border-slate-900">
                <table className="hidden sm:table w-150 table-fixed text-sm text-left text-zinc-200 bg-slate-800">
                    <thead className="text-zinc-100 border-amber-400 border-b-2 border-t-2">
                        <tr>
                            <th className="px-3 py-3 w-[23%]">Service</th>
                            <th className="px-3 w-[18%]">Date</th>
                            <th className="px-3 w-[13%]">Time</th>
                            <th className="px-3 w-[26%]">Role</th>
                            <th className="px-3 w-[20%] text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments?.map((a) => (
                            <tr key={a._id} className="border-b border-zinc-500 text-zinc-100">
                                <td className="px-3 py-3 font-medium wrap-break-word">{a.serviceName}</td>
                                <td className="px-3">{format(new Date(a.date), 'd MMM yyyy')}</td>
                                <td className="px-3 wrap-break-word">{a.time}</td>
                                <td className="px-3 py-2 wrap-break-word">{a.roleName}</td>
                                <td className="px-3 text-center">
                                    <span className={`px-3 py-0.5 rounded font-semibold text-zinc-950 inline-block w-23 ${
										a.status === "confirmed"
                                    	? "bg-green-200" :
										a.status === "pending" ?
										"bg-zinc-300"
                                    	: "bg-red-200"
                                    }`}>
                                        {a.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
				<table className="sm:hidden w-85 table-fixed text-xs text-left text-zinc-200 bg-slate-800">
                    <thead className="text-zinc-100 bg-slate-900/60">
                        <tr>
                            <th className="px-1 py-3 w-[23%]">Service</th>
                            <th className="px-1 w-[23%]">Date</th>
                            <th className="px-1 w-[15%]">Time</th>
                            <th className="px-1 w-[25%]">Role</th>
                            <th className="px-1 w-[14%] text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments?.map((a) => (
                            <tr key={a._id} className="border-b border-zinc-500 text-zinc-100">
                                <td className="px-1 py-2 font-medium wrap-break-word">{a.serviceName}</td>
                                <td className="px-1">{format(new Date(a.date), 'd MMM yyyy')}</td>
                                <td className="px-1 wrap-break-word">{a.time}</td>
                                <td className="px-1 py-2 wrap-break-word">{a.roleName}</td>
                                <td className="px-1 text-center">
                                    <span className={`px-1.5 py-1.7 rounded font-semibold text-zinc-950 inline-block ${
										a.status === "confirmed"
                                    	? "bg-green-200" :
										a.status === "pending" ?
										"bg-zinc-300"
                                    	: "bg-red-200"
                                    }`}>
                                        {a.status === "confirmed"
                                    	? "OK" :
										a.status === "pending" ?
										"..."
                                    	: "NO"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
					</div>
				</div>
			)}
		</div>
	)
}


function StatsCard({ icon, title, buttonLabel, linkTo, onClick, onDisabled }: StatsCardProps) {
	return (
		<div className="bg-zinc-100 rounded-lg p-3 flex flex-col w-45.5 sm:w-50 h-35">
			<div>{icon}</div>
			<h3 className="text-slate-900 font-semibold">{title}</h3>
			{
				linkTo ? 
					<ButtonLink to={linkTo} variant="card">
						{buttonLabel}
					</ButtonLink>
				:
					<button
					onClick={() => onClick?.()}
					disabled={onDisabled}
					className="bg-amber-400 text-blue-950 text-xs font-medium py-1 px-2 rounded w-full mt-auto hover:bg-amber-500 flex justify-center
					transition-colors disabled:bg-amber-500 disabled:cursor-not-allowed"
					>
						{buttonLabel}
					</button>
			}
		</div>
	)
}