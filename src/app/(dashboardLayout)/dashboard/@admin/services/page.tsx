import { ServicesManager, type SpecialtyOption } from "@/components/modules/services/services-manager";
import { getAllSpecialties } from "@/services/specialties.service";

export default async function AdminServicesPage() {
	let specialtyOptions: SpecialtyOption[] = [];
	try {
		const response = await getAllSpecialties();
		specialtyOptions = (response.data ?? []).map((specialty) => ({
			id: specialty.id,
			title: specialty.title ?? "Untitled specialty",
		}));
	} catch (error) {
		console.error("Failed to load specialties", error);
	}

	return (
		<div className="space-y-8 p-6">
			<ServicesManager context="admin" specialtyOptions={specialtyOptions} />
		</div>
	);
}
