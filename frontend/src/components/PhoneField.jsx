import { useMemo, useState } from 'react'
import { AsYouType, isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js'
import { phoneCountries } from '../data/countries'
import CountrySelect from './CountrySelect'

const COUNTRIES = phoneCountries()

export default function PhoneField({ value, onChange, onValidity }) {
  const [iso, setIso] = useState('RU')
  const [national, setNational] = useState('')
  const [touched, setTouched] = useState(false)
  const selected = COUNTRIES.find((item) => item.code === iso) || COUNTRIES[0]

  const valid = useMemo(() => {
    if (!national.trim()) return false
    return isValidPhoneNumber(national, iso) || (value ? isValidPhoneNumber(value) : false)
  }, [national, iso, value])

  function emit(nextIso, nextNational) {
    const typed = new AsYouType(nextIso)
    const formatted = typed.input(nextNational)
    const parsed = parsePhoneNumberFromString(formatted, nextIso)
    const e164 = parsed?.number || ''
    onChange(e164)
    onValidity?.(Boolean(parsed && isValidPhoneNumber(parsed.number)))
    return formatted
  }

  function handleNational(raw) {
    const formatted = emit(iso, raw)
    setNational(formatted)
  }

  function handleCountry(country) {
    setIso(country.code)
    const formatted = emit(country.code, national.replace(/\D/g, ''))
    setNational(formatted)
  }

  return (
    <div className="phone-field">
      <CountrySelect countries={COUNTRIES} value={selected.code} onChange={handleCountry} showDial />
      <input
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="Номер телефона"
        value={national}
        onChange={(e) => handleNational(e.target.value)}
        onBlur={() => setTouched(true)}
      />
      {touched && national && !valid && (
        <p className="field-hint">Введите действующий номер для {selected.name}.</p>
      )}
    </div>
  )
}
