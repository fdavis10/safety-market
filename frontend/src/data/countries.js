import iso from 'i18n-iso-countries'
import ru from 'i18n-iso-countries/langs/ru.json'
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'

iso.registerLocale(ru)

const BLOCKED = new Set(['UA'])

export function flagUrl(code, width = 40) {
  return `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`
}

export function citizenshipCountries() {
  return Object.entries(iso.getNames('ru'))
    .filter(([code]) => !BLOCKED.has(code))
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
}

export function phoneCountries() {
  const names = iso.getNames('ru')
  return getCountries()
    .filter((code) => !BLOCKED.has(code))
    .map((code) => ({
      code,
      name: names[code] || code,
      dial: String(getCountryCallingCode(code)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
}
