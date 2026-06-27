import { useEffect, useRef } from 'react'

export default function Particules() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particules = Array.from({ length: 25 }, (_, i) => {
      const el = document.createElement('div')
      el.className = 'particule'
      const taille = 4 + Math.random() * 8
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${taille}px;
        height: ${taille}px;
        animation-delay: ${Math.random() * 8}s;
        animation-duration: ${5 + Math.random() * 6}s;
        background: ${Math.random() > 0.5 ? '#D4AF37' : '#C45C26'};
        opacity: ${0.3 + Math.random() * 0.5};
      `
      container.appendChild(el)
      return el
    })

    return () => particules.forEach(p => p.remove())
  }, [])

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex: 1}} />
}
