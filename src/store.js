import { create } from 'zustand'

export const formats = {
  doc: { label: 'Word', color: '#2763c7', bg: '#eaf2ff', extensions: ['.doc', '.docx'] },
  xls: { label: 'Excel', color: '#17834b', bg: '#e7f6ed', extensions: ['.xls', '.xlsx'] },
  ppt: { label: 'PowerPoint', color: '#dd5b00', bg: '#fff0e4', extensions: ['.ppt', '.pptx'] },
}

const getType = (name) => {
  const extension = name.slice(name.lastIndexOf('.')).toLowerCase()
  return Object.entries(formats).find(([, format]) => format.extensions.includes(extension))?.[0]
}

export const useConverterStore = create((set) => ({
  files: [],
  isConverting: false,
  watermark: {
    enabled: false,
    text: 'CONFIDENTIAL',
    position: 'center',
    opacity: 35,
    size: 28,
  },
  setWatermark: (changes) => set((state) => ({
    watermark: { ...state.watermark, ...changes },
  })),
  addFiles: (fileList) => set((state) => ({
    files: [
      ...state.files,
      ...Array.from(fileList)
        .map((file) => ({ file, id: `${file.name}-${file.lastModified}`, type: getType(file.name), status: 'ready' }))
        .filter((item) => item.type && !state.files.some((existing) => existing.id === item.id)),
    ],
  })),
  removeFile: (id) => set((state) => ({ files: state.files.filter((file) => file.id !== id) })),
  clearFiles: () => set({ files: [] }),
  convertFiles: () => {
    set({ isConverting: true })
    window.setTimeout(() => set((state) => ({
      isConverting: false,
      files: state.files.map((file) => ({ ...file, status: 'converted' })),
    })), 1200)
  },
}))
