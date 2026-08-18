const files = import.meta.glob('../assets/packages/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

export function packageImage(slug) {
  const match = Object.entries(files).find(([path]) => {
    const file = path.split(/[/\\]/).pop()?.replace(/\.[^.]+$/, '')
    return file === slug
  })
  return match?.[1] || null
}
