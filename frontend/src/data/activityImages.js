const files = import.meta.glob('../assets/activity/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

const ACTIVITY_KEYS = ['searching', 'auditdocuments', 'world_logistic', 'adaptaion']

function byStem(stem) {
  const matches = Object.entries(files).filter(([path]) => {
    const file = path.split(/[/\\]/).pop()?.replace(/\.[^.]+$/, '')
    return file === stem
  })
  if (!matches.length) return null
  const webp = matches.find(([path]) => path.endsWith('.webp'))
  return (webp || matches[0])[1]
}

function activityImage(key, lang = 'ru') {
  const locale = lang === 'en' ? 'en' : 'ru'
  return byStem(`${key}-${locale}`) || byStem(`${key}-ru`) || byStem(key)
}

export function activityImages(lang = 'ru') {
  return ACTIVITY_KEYS.map((key) => activityImage(key, lang))
}
