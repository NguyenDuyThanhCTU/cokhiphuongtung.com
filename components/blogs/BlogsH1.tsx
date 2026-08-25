import { MapPinned } from "lucide-react";

export default function BlogsH1({ Content, description }: { Content: string; description?: string }) {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-14 text-white d:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(245,184,0,0.28),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(245,184,0,0.12),transparent_30%)]" />
      <div className="relative mx-auto w-full max-w-[1200px] px-4 text-center sm:px-6 d:px-0">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-400 text-slate-950"><MapPinned size={24} /></span>
        <h1 className="mt-5 text-3xl font-black uppercase tracking-tight sm:text-4xl d:text-5xl">{Content}</h1>
        {description ? <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{description}</p> : null}
      </div>
    </section>
  );
}
