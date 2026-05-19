import { Link } from '@/lib/router'

export interface Crumb {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((c, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={c.label} className={isLast ? 'current' : ''}>
              {c.href && !isLast
                ? <Link to={c.href}>{c.label}</Link>
                : <span aria-current={isLast ? 'page' : undefined}>{c.label}</span>}
              {!isLast && <span className="sep" aria-hidden="true">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
