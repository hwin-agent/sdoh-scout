export default function Loading() {
  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-teal risk-pulse" />
        <span className="font-sans text-sm text-slate/60">Loading...</span>
      </div>
    </main>
  );
}
