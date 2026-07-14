export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-3 sm:p-4 sm:pt-0">
      <div className="grid auto-rows-min gap-4 grid-cols-1 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[60vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  )
}
