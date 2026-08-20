import { useMemo, useState } from 'react'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { flagUrl } from '../data/countries'
import { useLocale } from '../i18n/LocaleContext'

const COUNTRY = { code: 'RU', name: 'Россия', dial: '7' }

export default function PhoneField({ value, onChange, onValidity }) {
  const { t } = useLocale()
  const [national, setNational] = useState('')
  const [touched, setTouched] = useState(false)

  const digits = national.replace(/\D/g, '')

  const valid = useMemo(() => {
    return digits.length === 10 && Boolean(value && isValidPhoneNumber(value))
  }, [digits, value])

  function formatDigits(raw) {
    let next = raw.replace(/\D/g, '')
    if (next.length === 11 && (next.startsWith('7') || next.startsWith('8'))) {
      next = next.slice(1)
    }
    next = next.slice(0, 10)
    if (next.length <= 3) return next
    if (next.length <= 6) return `${next.slice(0, 3)} ${next.slice(3)}`
    if (next.length <= 8) return `${next.slice(0, 3)} ${next.slice(3, 6)}-${next.slice(6)}`
    return `${next.slice(0, 3)} ${next.slice(3, 6)}-${next.slice(6, 8)}-${next.slice(8)}`
  }

  function handleNational(raw) {
    const formatted = formatDigits(raw)
    const nextDigits = formatted.replace(/\D/g, '')
    const e164 = nextDigits.length === 10 ? `+7${nextDigits}` : ''
    onChange(e164)
    onValidity?.(nextDigits.length === 10 && isValidPhoneNumber(e164))
    setNational(formatted)
  }

  return (
    <div className="phone-field">
      <div className="phone-prefix" aria-hidden="true">
        <img src={flagUrl(COUNTRY.code)} alt="" />
        +{COUNTRY.dial}
      </div>
      <input
        required
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="999 123-45-67"
        value={national}
        onChange={(e) => handleNational(e.target.value)}
        onBlur={() => setTouched(true)}
      />
      {touched && national && !valid && (
        <p className="field-hint">{t('checkout.err.phoneRu')}</p>
      )}
    </div>
  )
}
