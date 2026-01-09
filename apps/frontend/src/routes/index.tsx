import { Field } from '@base-ui/react/field'
import { Input } from '@base-ui/react/input'
import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink, Hash, MapPin, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')

  const webcalUrl = useMemo(() => {
    if (!street || !number) {
      return ''
    }
    const s = `webcal://${import.meta.env.VITE_BACKEND_URL}/ical?street=${encodeURIComponent(street)}&number=${encodeURIComponent(number)}`
    return encodeURIComponent(s)
  }, [street, number])

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050505] p-6 selection:bg-orange-500/30">
      <div className="w-full max-w-150 bg-white backdrop-blur-2xl border border-white shadow-[0_20px_50px_rgba(255,138,0,0.08)] rounded-[2.5rem] p-10 space-y-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-end gap-3 relative">
            <Field.Root className="flex-1 flex flex-col gap-2.5 transition-all duration-500">
              <Field.Label className="flex items-center gap-2 text-[11px] font-bold text-black uppercase tracking-[0.2em] ml-1">
                <MapPin
                  size={12}
                  strokeWidth={2.5}
                  className="text-orange-500"
                />
                Street
              </Field.Label>
              <Input
                value={street}
                onValueChange={setStreet}
                placeholder="Kurfürstendamm"
                className="w-full px-5 py-3.5 bg-orange-50/30 border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white outline-none transition-all duration-300 placeholder:text-slate-400 text-black font-medium"
              />
            </Field.Root>

            {/* Number Input */}
            <Field.Root className="order-3 w-24 flex flex-col gap-2.5 transition-all duration-500">
              <Field.Label className="flex items-center gap-2 text-[11px] font-bold text-black uppercase tracking-[0.2em] ml-1">
                <Hash size={12} strokeWidth={2.5} className="text-orange-500" />
                No.
              </Field.Label>
              <Input
                value={number}
                onValueChange={setNumber}
                placeholder="12"
                className="w-full px-4 py-3.5 bg-orange-50/30 border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white outline-none transition-all duration-300 placeholder:text-slate-400 text-black font-medium text-center"
              />
            </Field.Root>
          </div>

          {/* Styled Link Component */}
          <a
            href={`https://www.google.com/calendar/render?cid=${webcalUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl py-6 text-sm font-black uppercase tracking-[0.2em] transition-all duration-500 no-underline active:scale-95 ${
              !webcalUrl ? 'pointer-events-none opacity-20 grayscale' : ''
            } bg-orange-600 text-white hover:bg-orange-500 hover:shadow-[0_0_30px_-5px_rgba(234,88,12,0.5)]`}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            <ExternalLink size={18} strokeWidth={3} />
            Add to calendar
            <Sparkles size={16} className="text-orange-200" />
          </a>
        </div>
      </div>
    </main>
  )
}
