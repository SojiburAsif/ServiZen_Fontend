export default function AdminBookingsLoading() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Skeleton */}
      <div className="rounded-3xl border bg-gradient-to-br from-background to-muted/30 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-96 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="h-10 w-24 bg-muted animate-pulse rounded"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border bg-card/80 p-5 shadow-sm backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-muted animate-pulse rounded"></div>
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="h-12 w-12 bg-muted animate-pulse rounded-2xl"></div>
            </div>
            <div className="mt-3 h-3 w-24 bg-muted animate-pulse rounded"></div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="h-6 w-40 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
              <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
              <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="border-t">
            <div className="p-4 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border-b last:border-b-0">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-8 bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
            <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
