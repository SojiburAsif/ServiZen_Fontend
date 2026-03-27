export default function AdminProvidersLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="h-6 w-28 animate-pulse rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-10 w-72 animate-pulse rounded-xl bg-muted" />
            <div className="h-4 w-96 max-w-full animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
        <div className="h-24 w-full max-w-sm animate-pulse rounded-2xl bg-muted md:w-80" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="h-28 animate-pulse rounded-2xl bg-muted" />
        <div className="h-28 animate-pulse rounded-2xl bg-muted" />
        <div className="h-28 animate-pulse rounded-2xl bg-muted" />
        <div className="h-28 animate-pulse rounded-2xl bg-muted" />
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b bg-muted/30 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="h-6 w-40 animate-pulse rounded bg-muted" />
              <div className="h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:min-w-[540px]">
              <div className="h-10 flex-1 animate-pulse rounded-lg bg-muted" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-muted sm:w-28" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            <div className="h-14 animate-pulse rounded-xl bg-muted" />
            <div className="h-14 animate-pulse rounded-xl bg-muted" />
            <div className="h-14 animate-pulse rounded-xl bg-muted" />
            <div className="h-14 animate-pulse rounded-xl bg-muted" />
            <div className="h-14 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-4 w-44 animate-pulse rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
            <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
