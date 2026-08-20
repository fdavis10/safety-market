import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { messages } from './messages'
import { localizePackage, localizeService, localizeSite } from './content'

const LocaleContext = createContext(null)
const STORAGE_KEY = 'rplus-lang'

export function LocaleProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'en' || saved === 'ru') return saved
    } catch {
      /* ignore */
    }
    return 'ru'
  })

  function setLang(next) {
    if (next !== 'ru' && next !== 'en') return
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = lang === 'en' ? 'R PLUS — staffing agency' : 'Р ПЛЮС — кадровое агентство'
  }, [lang])

  const value = useMemo(() => {
    function t(key, vars) {
      const table = messages[lang] || messages.ru
      let text = table[key] ?? messages.ru[key] ?? key
      if (vars) {
        Object.entries(vars).forEach(([name, value]) => {
          text = text.replaceAll(`{${name}}`, String(value))
        })
      }
      return text
    }

    function money(value) {
      return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
      }).format(Number(value || 0))
    }

    return {
      lang,
      setLang,
      t,
      money,
      localizeSite: (site) => localizeSite(site, lang),
      localizeService: (service) => localizeService(service, lang),
      localizePackage: (pack) => localizePackage(pack, lang),
    }
  }, [lang])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('LocaleProvider is required')
  return ctx
}
