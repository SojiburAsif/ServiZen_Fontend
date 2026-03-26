import {
  DashboardHeaderSkeleton,
  DashboardTableSkeleton,
  DashboardFormSkeleton,
} from "@/components/modules/dashboard/dashboard-loading";

export default function AdminSpecialtiesLoading() {
  return (
    <section className="space-y-6 p-6">
      <DashboardHeaderSkeleton descriptionLines={2} actionCount={2} />
      <DashboardFormSkeleton />
      <DashboardTableSkeleton rows={6} columns={4} />
    </section>
  );
}
