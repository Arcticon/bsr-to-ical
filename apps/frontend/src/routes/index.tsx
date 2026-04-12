import { Field } from '@base-ui/react/field'
import { Input } from '@base-ui/react/input'
import { createFileRoute } from '@tanstack/react-router'
import {
  Check,
  Copy,
  ExternalLink,
  Filter,
  Hash,
  MapPin,
  Navigation,
  Sparkles,
} from 'lucide-react'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/')({ component: App })

const categoryLabels: Record<string, string> = {
  HM: 'Hausmüll',
  BI: 'Biogut',
  WS: 'Wertstoffe',
  WB: 'Weihnachtsbaum',
}

const allCategoryKeys = Object.keys(categoryLabels)

function App() {
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [copied, setCopied] = useState(false)
  const [categories, setCategories] = useState<Set<string>>(
    new Set(allCategoryKeys)
  )

  const toggleCategory = (key: string) => {
    setCategories((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const webcalUrl = useMemo(() => {
    if (!street || !number || !zipcode.startsWith('1')) {
      return ''
    }
    const params = new URLSearchParams({
      street,
      number,
      zipcode,
      categories: allCategoryKeys
        .filter((key) => categories.has(key))
        .join(','),
    })
    const s = `webcal://${import.meta.env.VITE_BACKEND_URL}/ical?${params.toString()}`
    return encodeURIComponent(s)
  }, [street, number, zipcode, categories])

  function handleCopy() {
    navigator.clipboard.writeText(decodeURIComponent(webcalUrl))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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

            {/* Zipcode Input */}
            <Field.Root className="order-4 w-32 flex flex-col gap-2.5 transition-all duration-500">
              <Field.Label className="flex items-center gap-2 text-[11px] font-bold text-black uppercase tracking-[0.2em] ml-1">
                <Navigation
                  size={12}
                  strokeWidth={2.5}
                  className="text-orange-500"
                />
                Zipcode
              </Field.Label>
              <Input
                value={zipcode}
                onValueChange={(value) =>
                  setZipcode(value.replace(/\D/g, '').slice(0, 5))
                }
                placeholder="10115"
                inputMode="numeric"
                className="w-full px-4 py-3.5 bg-orange-50/30 border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white outline-none transition-all duration-300 placeholder:text-slate-400 text-black font-medium text-center"
              />
            </Field.Root>
          </div>

          {/* Category Selection */}
          <div className="flex flex-col gap-2.5">
            <span className="flex items-center gap-2 text-[11px] font-bold text-black uppercase tracking-[0.2em] ml-1">
              <Filter size={12} strokeWidth={2.5} className="text-orange-500" />
              Categories
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleCategory(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    categories.has(key)
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
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
            Add to Google calendar
            <Sparkles size={16} className="text-orange-200" />
          </a>

          {/* Copy URL */}
          <button
            onClick={handleCopy}
            disabled={!webcalUrl}
            className={`flex w-full items-center justify-center gap-2.5 rounded-2xl border py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer ${
              !webcalUrl
                ? 'pointer-events-none border-slate-100 text-slate-300'
                : copied
                  ? 'border-green-200 bg-green-50 text-green-600'
                  : 'border-slate-200 text-slate-500 hover:border-orange-300 hover:text-orange-500'
            }`}
          >
            {copied ? (
              <Check size={14} strokeWidth={2.5} />
            ) : (
              <Copy size={14} strokeWidth={2.5} />
            )}
            {copied ? 'Copied!' : 'Copy calendar URL'}
          </button>
        </div>
      </div>
    </main>
  )
}
