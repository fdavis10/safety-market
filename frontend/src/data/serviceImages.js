const files = import.meta.glob('../assets/services/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

function pickImage(slug) {
  const matches = Object.entries(files).filter(([path]) => {
    const file = path.split(/[/\\]/).pop()?.replace(/\.[^.]+$/, '')
    return file === slug
  })
  if (!matches.length) return null
  const webp = matches.find(([path]) => path.endsWith('.webp'))
  return (webp || matches[0])[1]
}

export function serviceImage(slug) {
  return pickImage(slug)
}
