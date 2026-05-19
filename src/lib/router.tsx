import { useEffect, useState } from 'react'

const NAV_EVENT = 'fg:navigate'

export function navigate(to: string) {
  if (window.location.pathname === to && window.location.search === '') return
  window.history.pushState({}, '', to)
  window.dispatchEvent(new CustomEvent(NAV_EVENT))
}

export function useRoute(): string {
  const [path, setPath] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname
  )
  useEffect(() => {
    const update = () => setPath(window.location.pathname)
    window.addEventListener('popstate', update)
    window.addEventListener(NAV_EVENT, update)
    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener(NAV_EVENT, update)
    }
  }, [])
  return path
}

export function Link({
  to, className, children, onClick,
}: {
  to: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <a
      href={to}
      className={className}
      onClick={e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        navigate(to)
        onClick?.()
      }}
    >
      {children}
    </a>
  )
}
