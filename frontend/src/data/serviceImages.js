const files = import.meta.glob('../assets/services/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

function byStem(stem) {
  const matches = Object.entries(files).filter(([path]) => {
    const file = path.split(/[/\\]/).pop()?.replace(/\.[^.]+$/, '')
    return file === stem
  })
  if (!matches.length) return null
  const webp = matches.find(([path]) => path.endsWith('.webp'))
  return (webp || matches[0])[1]
}

/** Prefer `{slug}-{lang}`, then `{slug}-ru`, then legacy `{slug}`. */
export function serviceImage(slug, lang = 'ru') {
  if (!slug) return null
  const locale = lang === 'en' ? 'en' : 'ru'
  return (
    byStem(`${slug}-${locale}`) ||
    byStem(`${slug}-ru`) ||
    byStem(slug)
  )
}
