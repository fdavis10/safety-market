import { useEffect, useMemo, useRef, useState } from 'react'
import { flagUrl } from '../data/countries'

export default function CountrySelect({
  countries,
  value,
  onChange,
  placeholder = 'Выберите страну',
  required = false,
  showDial = false,
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef(null)
  const searchRef = useRef(null)
  const selected = countries.find((item) => item.code === value)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return countries
    return countries.filter((item) => {
      const dial = item.dial ? `+${item.dial}` : ''
      return (
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        dial.includes(q.replace(/\s/g, ''))
      )
    })
  }, [countries, query])

  useEffect(() => {
    function onDoc(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      window.setTimeout(() => searchRef.current?.focus(), 20)
    }
  }, [open])

  return (
    <div className="country-select" ref={rootRef}>
      <button type="button" className="country-select-btn" onClick={() => setOpen((v) => !v)}>
        {selected ? (
          <>
            <img src={flagUrl(selected.code)} alt="" />
            <span>
              {showDial ? `+${selected.dial}` : selected.name}
            </span>
          </>
        ) : (
          <span className="country-placeholder">{placeholder}</span>
        )}
        <b>▾</b>
      </button>
      {required && (
        <input className="sr-only" required value={selected?.name || ''} onChange={() => {}} tabIndex={-1} />
      )}
      {open && (
        <div className="country-select-menu">
          <input
            ref={searchRef}
            className="country-search"
            placeholder="Поиск страны"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ul>
            {filtered.map((item) => (
              <li key={item.code}>
                <button
                  type="button"
                  className={item.code === value ? 'on' : ''}
                  onClick={() => {
                    onChange(item)
                    setOpen(false)
                  }}
                >
                  <img src={flagUrl(item.code)} alt="" />
                  <span>{item.name}</span>
                  {showDial && <em>+{item.dial}</em>}
                </button>
              </li>
            ))}
            {!filtered.length && <li className="country-empty">Ничего не найдено</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
