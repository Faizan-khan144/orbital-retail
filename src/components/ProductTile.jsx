import { useState } from 'react'
import { categoryIcon } from '../lib/categoryIcons.jsx'

const mesh = (h) => ({
  bg1: `hsl(${h} 92% 96%)`,
  bg2: `hsl(${(h + 40) % 360} 88% 94%)`,
  blob1: `hsl(${h} 90% 82% / 0.28)`,
  blob2: `hsl(${(h + 60) % 360} 86% 78% / 0.22)`,
  blob3: `hsl(${(h + 120) % 360} 84% 70% / 0.16)`,
  ring: `hsl(${h} 40% 70% / 0.45)`,
  accent: `hsl(${h} 46% 48%)`,
})

export default function ProductTile({
  product,
  image,
  hue,
  category,
  className = '',
  rounded = 'rounded-2xl',
  iconClass = 'h-2/5 w-2/5',
  imgClass = 'object-cover',
  showImage = false,
}) {
  const [failed, setFailed] = useState(false)
  const h = hue ?? product?.hue ?? 240
  const cat = category ?? product?.category
  const src = image ?? product?.image
  const Icon = categoryIcon(cat)
  const m = mesh(h)
  const useRealImage = showImage && src && !failed

  return (
    <div
      className={`group relative isolate overflow-hidden border ${rounded} ${className}`}
      style={{
        background: `linear-gradient(150deg, ${m.bg1} 0%, ${m.bg2} 100%)`,
        borderColor: `hsl(${h} 30% 86%)`,
      }}
    >
      {useRealImage ? (
        <img
          src={src}
          alt={product?.name ?? cat ?? 'Product'}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full ${imgClass}`}
        />
      ) : (
        <>
          <div
            className="absolute -top-24 -left-20 h-56 w-56 rounded-full blur-3xl transition-transform duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-1"
            style={{ background: m.blob1 }}
          />
          <div
            className="absolute -bottom-28 -right-16 h-64 w-64 rounded-full blur-3xl transition-transform duration-700 ease-out group-hover:-translate-x-1 group-hover:translate-y-1"
            style={{ background: m.blob2 }}
          />
          <div
            className="absolute top-1/3 left-1/4 h-40 w-40 rounded-full blur-3xl transition-transform duration-700 ease-out group-hover:scale-110"
            style={{ background: m.blob3 }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 10%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)`,
            }}
          />
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <span
                className="absolute h-28 w-28 rounded-full blur-xl opacity-60 transition-opacity duration-500 group-hover:opacity-80"
                style={{ background: `radial-gradient(circle, ${m.blob1} 0%, transparent 70%)` }}
              />
              <div
                className="relative flex h-24 w-24 items-center justify-center rounded-3xl border shadow-[0_30px_80px_-40px_rgba(20,20,60,0.6)] backdrop-blur-xl transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-110"
                style={{
                  background: `linear-gradient(160deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 100%)`,
                  borderColor: 'rgba(255,255,255,0.6)',
                }}
              >
                <Icon
                  className={`${iconClass} drop-shadow-sm`}
                  strokeWidth={1.15}
                  style={{ color: m.accent }}
                />
                <span
                  className="absolute inset-0 rounded-3xl"
                  style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.8), 0 0 0 1px ${m.ring} inset` }}
                />
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/60 to-transparent opacity-70" />
        </>
      )}
    </div>
  )
}
