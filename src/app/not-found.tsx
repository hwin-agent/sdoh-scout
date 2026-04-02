import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-6">
      <div className="max-w-md">
        <p className="font-mono text-[11px] text-terracotta mb-3 tracking-wide">
          404
        </p>
        <h1 className="font-serif text-3xl text-slate mb-4">
          Page not found
        </h1>
        <p className="font-sans text-base text-slate/60 mb-8">
          The page you&apos;re looking for doesn&apos;t exist. Head back to SDOH
          Scout to see what the EHR misses.
        </p>
        <Link
          href="/"
          className="font-sans text-sm font-medium bg-teal text-white px-6 py-3 rounded-[6px] hover:bg-[#0a5c5c] transition-colors inline-block"
        >
          Back to SDOH Scout
        </Link>
      </div>
    </main>
  );
}
