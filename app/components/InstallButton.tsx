'use client'
import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowButton(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShowButton(false)
    setDeferredPrompt(null)
  }

  if (!showButton) return null
  return (
    <button onClick={handleInstall} className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-green-600 transition">
      <Download size={16} /> Install App
    </button>
  )
}
