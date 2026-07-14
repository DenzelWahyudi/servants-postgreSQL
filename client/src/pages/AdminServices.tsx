import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { ButtonLink } from "../components/ButtonLink";
import { Heading } from "../components/Heading";
import { UpcomingServicesAdmin } from "../components/UpcomingServicesAdmin";

export function AdminServices() {
	return (
		<div className="flex flex-col h-screen">
			<div className="px-6.5 py-4">
				<Header variant="admin"/>
			</div>
			<div className="flex flex-1 min-h-0">
				<Sidebar variant="services" />
				<div className="flex flex-col bg-zinc-100/2 px-10 w-full h-full">
					<div className="flex justify-between py-7 items-center">
						<Heading>Manage Services</Heading>
						<div className="w-47">
							<ButtonLink to='/admin/services/create' variant="card" className="text-lg text-semibold py-1.5 rounded-lg text-slate-900 select-none">
								+ Add New Service
							</ButtonLink>
						</div>
					</div>
					<div className="rounded-lg overflow-y-auto">
						<UpcomingServicesAdmin />
					</div>
				</div>
			</div>
		</div>
	)
}
