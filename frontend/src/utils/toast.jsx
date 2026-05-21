import { createRoot } from 'react-dom/client'

let container = null

function getContainer() {
  if (!container) {
    container = document.createElement('div')
    container.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 9999;
      display: flex; flex-direction: column; gap: 10px;
      pointer-events: none;
    `
    document.body.appendChild(container)
  }
  return container
}

export function toast(message, type = 'success') {
  const wrap = document.createElement('div')
  getContainer().appendChild(wrap)
  const root = createRoot(wrap)

  const colors = {
    success: { bg: '#f0fdf4', border: '#86efac', color: '#15803d', icon: '✅' },
    error:   { bg: '#fef2f2', border: '#fca5a5', color: '#b91c1c', icon: '❌' },
    info:    { bg: '#eff6ff', border: '#93c5fd', color: '#1d4ed8', icon: 'ℹ️'  },
    cart:    { bg: '#f0fdf4', border: '#86efac', color: '#15803d', icon: '🛒' },
  }
  const c = colors[type] || colors.success

  root.render(
    <div style={{
      background: c.bg, border: `1.5px solid ${c.border}`, color: c.color,
      borderRadius: 12, padding: '12px 18px', fontSize: 14, fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      pointerEvents: 'auto', minWidth: 220, maxWidth: 340,
      animation: 'slideIn 0.25s ease',
    }}>
      <span>{c.icon}</span>
      <span>{message}</span>
      <style>{`@keyframes slideIn { from { transform: translateX(60px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }`}</style>
    </div>
  )

  setTimeout(() => {
    root.unmount()
    wrap.remove()
  }, 3000)
}