import { categoryIcon } from '../lib/categoryIcons.jsx'

export default function ProductGlyph({ product, size = 16, className = '', boxed = false }) {
  const Icon = categoryIcon(product.category)
  const color = `hsl(${product.hue} 40% 40%)`
  if (boxed) {
    return (
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-elevate ${className}`} style={{ color }}>
        <Icon size={size} strokeWidth={1.4} />
      </span>
    )
  }
  return <Icon size={size} strokeWidth={1.4} className={className} style={{ color }} />
}
