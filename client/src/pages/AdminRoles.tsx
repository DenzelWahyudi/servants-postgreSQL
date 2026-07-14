import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useEffect, useState } from "react";
import { Heading } from "../components/Heading";
import { RolesCard } from "../components/RolesCard";
import { API_URL } from "../api"

interface Service{
	id: string
	name: string
	date: string
	time: string
}

export function AdminRoles() {

	const [services, setServices] = useState<Service[] | null>(null)

	useEffect(() => {
		async function fetchServices(){
			const response = await fetch(`${API_URL}/api/services`, {
				method: "GET",
				headers: { "Content-Type": 'application/json'}
			})
			const data: Service[] = await response.json()
			const sorted = data.sort(
				(a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()
			)
			setServices(sorted)
		}
		void fetchServices()
	}, [])

	return (
		<div className="flex flex-col overflow-y-auto h-screen">
			<div className="px-6.5 py-4">
				<Header variant="admin"/>
			</div>
			<div className="flex flex-1">
				<Sidebar variant="roles" />
				<div className="flex flex-col bg-zinc-100/2 px-10 w-full h-full">
					<div className="flex justify-between py-7 items-center">
						<Heading>Manage Roles</Heading>
					</div>
					{services?.map((service) => 
						<div className="pb-4.5" key={service.id}>
							<RolesCard 
							serviceId={service.id} serviceName={service.name} serviceDate={service.date} serviceTime={service.time} 
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
