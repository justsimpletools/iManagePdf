import { useRef, useState } from 'react'
import {
  ArrowRight, Check, ChevronDown, CloudUpload, Download, FileSpreadsheet, FileText,
  FileUp, FileType2, Github, Info, Menu, Plus, ShieldCheck, SlidersHorizontal, Sparkles, X, Zap,
} from 'lucide-react'
import { formats, useConverterStore } from './store'

const iconForType = (type) => {
  if (type === 'xls') return FileSpreadsheet
  if (type === 'ppt') return FileType2
  return FileText
}

const formatBytes = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

function Logo() {
  return <a className="flex items-center gap-2.5 text-white" href="/" aria-label="Paperform home">
    <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[#5645d4] shadow-[0_6px_18px_rgba(86,69,212,.35)]">
      <FileUp size={18} strokeWidth={2.5} />
    </span>
    <span className="text-[17px] font-semibold tracking-[-.03em]">paperform</span>
  </a>
}

function App() {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const { files, isConverting, watermark, setWatermark, addFiles, removeFile, clearFiles, convertFiles } = useConverterStore()

  const handleFiles = (selectedFiles) => addFiles(selectedFiles)
  const onDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    handleFiles(event.dataTransfer.files)
  }

  return <div className="min-h-screen overflow-hidden bg-[#fafaf9] text-[#1a1a1a]">
    <header className="relative z-10 bg-[#0a1530]">
      <nav className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-6 lg:px-8">
        <Logo />
        <div className="hidden items-center gap-8 text-[13px] text-[#b8c2d8] md:flex">
          <a className="transition-colors hover:text-white" href="#how-it-works">How it works</a>
          <a className="transition-colors hover:text-white" href="#history">Your files</a>
          <button className="flex items-center gap-1 transition-colors hover:text-white">Resources <ChevronDown size={14} /></button>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden px-3 py-2 text-[13px] font-medium text-[#d9dff0] sm:block">Sign in</button>
          <button className="hidden rounded-lg bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0a1530] transition-transform hover:-translate-y-0.5 sm:block">Create free account</button>
          <button className="rounded-lg p-2 text-white sm:hidden" aria-label="Open menu"><Menu size={21} /></button>
        </div>
      </nav>
      <div className="hero-grid relative">
        <span className="absolute left-[8%] top-12 h-2 w-2 rounded-full bg-[#ff64c8]" />
        <span className="absolute right-[14%] top-20 h-3 w-3 rounded-sm bg-[#f5d75e] rotate-12" />
        <span className="absolute bottom-8 left-[17%] h-2.5 w-2.5 rounded-full bg-[#2a9d99]" />
        <div className="relative mx-auto max-w-[800px] px-6 pb-[188px] pt-[74px] text-center sm:pt-[92px]">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-[#304263] bg-[#152342] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.14em] text-[#c5bfff]">
            <Sparkles size={13} /> Simple document conversion
          </div>
          <h1 className="text-[46px] font-semibold leading-[1.05] tracking-[-.055em] text-white sm:text-[68px]">Your files,<br /><span className="text-[#c5bfff]">perfectly portable.</span></h1>
          <p className="mx-auto mt-6 max-w-[510px] text-[16px] leading-7 text-[#b8c2d8]">Turn Word, Excel, and PowerPoint files into polished PDFs in seconds. No software to install, no complicated settings.</p>
        </div>
      </div>
    </header>

    <main className="relative mx-auto -mt-[148px] max-w-[1040px] px-5 pb-20 sm:px-8">
      <section className="relative rounded-2xl border border-[#e5e3df] bg-white p-3 shadow-[0_24px_48px_-8px_rgba(15,15,15,.2)] sm:p-5" aria-labelledby="upload-title">
        <div
          className={`upload-zone flex min-h-[310px] flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${dragging ? 'border-[#5645d4] bg-[#f5f2ff]' : 'border-[#c8c4be] bg-[#fcfcfb]'}`}
          onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[#e6e0f5] text-[#5645d4]"><CloudUpload size={27} strokeWidth={1.8} /></div>
          <h2 id="upload-title" className="text-[22px] font-semibold tracking-[-.025em]">Drop your files here</h2>
          <p className="mt-2 text-[14px] text-[#787671]">or choose files from your computer</p>
          <input ref={inputRef} className="hidden" type="file" multiple accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx" onChange={(event) => handleFiles(event.target.files)} />
          <button onClick={() => inputRef.current?.click()} className="mt-6 flex items-center gap-2 rounded-lg bg-[#5645d4] px-5 py-3 text-[14px] font-medium text-white shadow-[0_6px_12px_rgba(86,69,212,.2)] transition-all hover:-translate-y-0.5 hover:bg-[#4534b3]"><Plus size={17} /> Select files</button>
          <p className="mt-5 text-[11px] text-[#a4a097]">DOC, DOCX, XLS, XLSX, PPT, PPTX · Up to 50 MB per file</p>
        </div>
        {files.length > 0 && <div className="mt-3 space-y-2 border-t border-[#ede9e4] pt-4">
          <WatermarkPanel watermark={watermark} setWatermark={setWatermark} />
          {files.map((item) => {
            const Icon = iconForType(item.type)
            const meta = formats[item.type]
            return <div className="flex items-center gap-3 rounded-lg bg-[#fafaf9] px-3 py-3" key={item.id}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: meta.bg, color: meta.color }}><Icon size={20} /></span>
              <div className="min-w-0 flex-1 text-left"><p className="truncate text-[13px] font-medium">{item.file.name}</p><p className="mt-0.5 text-[11px] text-[#a4a097]">{formatBytes(item.file.size)} · {meta.label} {item.status === 'converted' ? `· ${watermark.enabled ? 'Watermarked · ' : ''}Ready to download` : ''}</p></div>
              {item.status === 'converted' ? <button className="flex items-center gap-1.5 rounded-md bg-[#e7f6ed] px-3 py-2 text-[12px] font-semibold text-[#17834b]"><Download size={14} /> PDF</button> : <button onClick={() => removeFile(item.id)} className="rounded-md p-2 text-[#a4a097] hover:bg-[#f0eeec] hover:text-[#37352f]" aria-label={`Remove ${item.file.name}`}><X size={16} /></button>}
            </div>
          })}
          <div className="flex items-center justify-between pt-2">
            <button onClick={clearFiles} className="text-[12px] font-medium text-[#787671] hover:text-[#1a1a1a]">Clear all</button>
            <button disabled={isConverting} onClick={convertFiles} className="flex items-center gap-2 rounded-lg bg-[#0a1530] px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#1a2a52] disabled:cursor-wait disabled:opacity-70">{isConverting ? 'Converting…' : 'Convert to PDF'} <ArrowRight size={15} /></button>
          </div>
        </div>}
      </section>

      <section id="how-it-works" className="py-20">
        <div className="mb-9 text-center"><p className="mb-3 text-[11px] font-semibold uppercase tracking-[.16em] text-[#5645d4]">Made for momentum</p><h2 className="text-[30px] font-semibold tracking-[-.04em] sm:text-[36px]">A better way to share work</h2><p className="mx-auto mt-3 max-w-[500px] text-[15px] leading-6 text-[#787671]">Everything you need to get from editable file to finished PDF, without the busywork.</p></div>
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard icon={<Zap size={21} />} color="bg-[#ffe8d4] text-[#dd5b00]" title="Fast by default" copy="Convert files in seconds, not minutes. Your work keeps moving at your pace." />
          <FeatureCard icon={<ShieldCheck size={21} />} color="bg-[#d9f3e1] text-[#17834b]" title="Private & secure" copy="Files are encrypted in transit and automatically removed after conversion." />
          <FeatureCard icon={<Check size={21} />} color="bg-[#e6e0f5] text-[#5645d4]" title="Always polished" copy="Get high-quality PDFs that preserve your layout, fonts, and formatting." />
        </div>
      </section>

      <section id="history" className="border-t border-[#e5e3df] py-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-[20px] font-semibold tracking-[-.02em]">Your recent conversions</h2><p className="mt-1 text-[13px] text-[#787671]">Files converted in this session appear here.</p></div><div className="flex items-center gap-2 text-[12px] text-[#787671]"><Info size={15} /> Nothing is stored permanently</div></div>
        <div className="mt-5 flex items-center justify-center rounded-xl border border-dashed border-[#c8c4be] bg-white py-10 text-center"><div><div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#f0eeec] text-[#a4a097]"><FileText size={18} /></div><p className="text-[13px] font-medium text-[#5d5b54]">No conversions yet</p><p className="mt-1 text-[12px] text-[#a4a097]">Your converted files will show up here.</p></div></div>
      </section>
    </main>
    <footer className="border-t border-[#e5e3df] bg-white"><div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-4 px-6 py-7 text-[12px] text-[#a4a097] sm:flex-row lg:px-8"><Logo /><span>© 2025 Paperform. Built for better work.</span><a className="flex items-center gap-1.5 hover:text-[#5645d4]" href="#privacy"><Github size={14} /> Open source spirit</a></div></footer>
  </div>
}

function WatermarkPanel({ watermark, setWatermark }) {
  const positionLabels = { top: 'Top', center: 'Center', bottom: 'Bottom' }
  return <div className="rounded-xl border border-[#e5e3df] bg-[#fafaf9] p-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#e6e0f5] text-[#5645d4]"><SlidersHorizontal size={17} /></span>
        <div><h3 className="text-[13px] font-semibold">Add a watermark</h3><p className="mt-1 text-[11px] leading-5 text-[#787671]">Apply a light text overlay to each converted PDF.</p></div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={watermark.enabled}
        aria-label="Toggle watermark"
        onClick={() => setWatermark({ enabled: !watermark.enabled })}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${watermark.enabled ? 'bg-[#5645d4]' : 'bg-[#c8c4be]'}`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${watermark.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
    {watermark.enabled && <div className="mt-4 grid gap-4 border-t border-[#e5e3df] pt-4 sm:grid-cols-[1.4fr_1fr_1fr]">
      <label className="text-[11px] font-medium text-[#5d5b54]">Watermark text
        <input value={watermark.text} maxLength={40} onChange={(event) => setWatermark({ text: event.target.value })} className="mt-1.5 h-9 w-full rounded-md border border-[#c8c4be] bg-white px-3 text-[12px] outline-none focus:border-[#5645d4] focus:ring-2 focus:ring-[#e6e0f5]" placeholder="e.g. CONFIDENTIAL" />
      </label>
      <label className="text-[11px] font-medium text-[#5d5b54]">Position
        <select value={watermark.position} onChange={(event) => setWatermark({ position: event.target.value })} className="mt-1.5 h-9 w-full rounded-md border border-[#c8c4be] bg-white px-2 text-[12px] outline-none focus:border-[#5645d4]">
          {Object.entries(positionLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
      </label>
      <label className="text-[11px] font-medium text-[#5d5b54]">Opacity · {watermark.opacity}%
        <input type="range" min="10" max="80" step="5" value={watermark.opacity} onChange={(event) => setWatermark({ opacity: Number(event.target.value) })} className="mt-3 w-full accent-[#5645d4]" />
      </label>
      <label className="text-[11px] font-medium text-[#5d5b54]">Size · {watermark.size}px
        <input type="range" min="14" max="48" step="2" value={watermark.size} onChange={(event) => setWatermark({ size: Number(event.target.value) })} className="mt-3 w-full accent-[#5645d4]" />
      </label>
      <div className="watermark-preview relative flex h-16 items-center justify-center overflow-hidden rounded-md border border-[#e5e3df] bg-white sm:col-span-3" aria-label="Watermark preview">
        <span className={`watermark-position-${watermark.position} absolute text-[#0a1530]`} style={{ opacity: watermark.opacity / 100, fontSize: `${watermark.size}px` }}>{watermark.text || 'YOUR TEXT'}</span>
        <span className="text-[10px] text-[#c8c4be]">PDF preview</span>
      </div>
    </div>}
  </div>
}

function FeatureCard({ icon, color, title, copy }) {
  return <article className="rounded-xl border border-[#e5e3df] bg-white p-6 transition-shadow hover:shadow-[0_4px_12px_rgba(15,15,15,.08)]"><div className={`mb-7 grid h-10 w-10 place-items-center rounded-lg ${color}`}>{icon}</div><h3 className="text-[17px] font-semibold">{title}</h3><p className="mt-2 text-[13px] leading-6 text-[#787671]">{copy}</p></article>
}

export default App
