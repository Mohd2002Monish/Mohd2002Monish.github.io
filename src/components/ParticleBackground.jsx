import React, { useEffect, useRef } from 'react'
import { useComet } from '../context/CometContext'
import { usePortfolio } from '../context/PortfolioContext'

/*  Starfield + Comet System
    ─────────────────────────
    Three parallax star layers for depth.
    Comets are driven by CometContext so the admin panel can
    change speed, frequency, colours etc. at runtime without
    unmounting the canvas.                                     */

// ─── Star layers ────────────────────────────────────────────────
const LAYERS = [
  { count: 120, speed: 0.015, sizeRange: [0.5, 1.2], alpha: 0.3 },
  { count: 70,  speed: 0.035, sizeRange: [1.0, 2.0], alpha: 0.5 },
  { count: 30,  speed: 0.065, sizeRange: [1.8, 3.0], alpha: 0.75 },
]

function createStar(w, h, sizeRange) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
    twinkleSpeed: 0.3 + Math.random() * 1.2,
    twinkleOffset: Math.random() * Math.PI * 2,
  }
}

// ─── All possible comet colour palettes ─────────────────────────
const ALL_PALETTES = {
  violet:  { head: 'rgba(192,132,252,', tail: 'rgba(147,51,234,',  spark: 'rgba(216,180,254,' },
  cyan:    { head: 'rgba(34,211,238,',  tail: 'rgba(6,182,212,',   spark: 'rgba(103,232,249,' },
  fuchsia: { head: 'rgba(248,200,255,', tail: 'rgba(217,70,239,',  spark: 'rgba(240,171,252,' },
  white:   { head: 'rgba(255,255,255,', tail: 'rgba(148,163,184,', spark: 'rgba(226,232,240,' },
}

// ─── Spawn a comet using live settings ──────────────────────────
function spawnComet(w, h, cfg) {
  // Build active palette list from settings
  const activePalettes = Object.entries(ALL_PALETTES)
    .filter(([key]) => cfg[`palette${key.charAt(0).toUpperCase() + key.slice(1)}`])
    .map(([, pal]) => pal)

  if (activePalettes.length === 0) return null

  const palette = activePalettes[Math.floor(Math.random() * activePalettes.length)]
  const angle   = (Math.PI / 6) + Math.random() * (Math.PI / 6) +
                  (Math.random() < 0.3 ? Math.PI * 0.55 : 0)
  const speed   = cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin)
  const tailLen = cfg.tailLenMin + Math.random() * (cfg.tailLenMax - cfg.tailLenMin)
  const headR   = cfg.headRadiusMin + Math.random() * (cfg.headRadiusMax - cfg.headRadiusMin)

  let x, y
  if (Math.random() < 0.7) {
    x = Math.random() * w
    y = -tailLen
  } else {
    x = -tailLen
    y = Math.random() * h * 0.6
  }

  // Explode target based on distance traveled (percentage of viewport dimension)
  const explodeDistance = Math.min(w, h) * (0.2 + Math.random() * 0.45)

  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    tailLen,
    headR,
    palette,
    alpha: 0,
    exploded: false,
    fadingOut: false,
    explodeDistance,
    distanceTraveled: 0,
    trail: [],
    ripples: null,
    dead: false,
  }
}

// ─── Main component ──────────────────────────────────────────────
export default function StarfieldBackground() {
  const { settings } = useComet()
  const { theme } = usePortfolio()

  // Use a ref so the animation loop always reads the latest settings
  // without needing to restart when they change
  const settingsRef = useRef(settings)
  useEffect(() => { settingsRef.current = settings }, [settings])

  const themeRef = useRef(theme)
  useEffect(() => { themeRef.current = theme }, [theme])

  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = null
    let mouse = { x: 0.5, y: 0.5 }
    let layers = []
    let time = 0
    let comets = []
    let nextCometIn = 10 + Math.floor(Math.random() * 21)

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      layers = LAYERS.map(cfg =>
        Array.from({ length: cfg.count }, () =>
          createStar(canvas.width, canvas.height, cfg.sizeRange)
        )
      )
    }

    const onMouseMove = (e) => {
      mouse.x = e.clientX / window.innerWidth
      mouse.y = e.clientY / window.innerHeight
    }

    const drawComet = (c) => {
      if (c.dead) return
      const { x, y, headR, alpha, palette, trail, exploded, ripples, explodeX, explodeY } = c

      // Only draw the head if it has not exploded yet
      if (!exploded) {
        // Glowing head
        const headGlow = ctx.createRadialGradient(x, y, 0, x, y, headR * 5)
        headGlow.addColorStop(0,   palette.head + `${alpha * 0.95})`)
        headGlow.addColorStop(0.4, palette.head + `${alpha * 0.5})`)
        headGlow.addColorStop(1,   palette.head + '0)')
        ctx.beginPath()
        ctx.arc(x, y, headR * 5, 0, Math.PI * 2)
        ctx.fillStyle = headGlow
        ctx.fill()

        // Bright core dot
        ctx.beginPath()
        ctx.arc(x, y, headR, 0, Math.PI * 2)
        ctx.fillStyle = palette.head + `${alpha})`
        ctx.fill()
      }

      // Tail
      if (trail.length > 1) {
        for (let i = 1; i < trail.length; i++) {
          const t = i / trail.length
          ctx.beginPath()
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y)
          ctx.lineTo(trail[i].x, trail[i].y)
          ctx.strokeStyle = palette.tail + `${alpha * t * 0.7})`
          ctx.lineWidth = headR * 0.5 * t + 0.5
          ctx.lineCap = 'round'
          ctx.stroke()
        }
      }

      // Circular water ripples (expanding orange wave)
      if (exploded && ripples) {
        const orangeColor = themeRef.current === 'light' ? 'rgba(224, 67, 0,' : 'rgba(255, 92, 26,'
        for (const rip of ripples) {
          if (rip.radius > 0 && rip.alpha > 0) {
            ctx.beginPath()
            ctx.arc(explodeX, explodeY, rip.radius, 0, Math.PI * 2)
            ctx.strokeStyle = orangeColor + `${rip.alpha * 0.8})`
            ctx.lineWidth = rip.weight * rip.alpha + 0.4
            ctx.stroke()

            // Add a subtle expanding water ripple color fill
            if (rip.weight > 2.0) {
              ctx.beginPath()
              ctx.arc(explodeX, explodeY, rip.radius, 0, Math.PI * 2)
              ctx.fillStyle = orangeColor + `${rip.alpha * 0.05})`
              ctx.fill()
            }
          }
        }
      }
    }

    const draw = () => {
      const cfg = settingsRef.current
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)
      time += 0.016

      // Stars
      const offsetX = (mouse.x - 0.5) * 2
      const offsetY = (mouse.y - 0.5) * 2
      LAYERS.forEach((layer, li) => {
        const stars = layers[li]
        if (!stars) return
        const px = offsetX * layer.speed * w
        const py = offsetY * layer.speed * h
        for (const s of stars) {
          const sx = ((s.x + px) % w + w) % w
          const sy = ((s.y + py) % h + h) % h
          const twinkle = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinkleOffset)
          const alpha   = layer.alpha * (0.4 + twinkle * 0.6)
           ctx.beginPath()
          ctx.arc(sx, sy, s.size, 0, Math.PI * 2)
          const isLight = themeRef.current === 'light'
          ctx.fillStyle = isLight 
            ? `rgba(15, 23, 42, ${alpha * 0.4})`
            : `rgba(226, 232, 240, ${alpha})`
          ctx.fill()
        }
      })

      // Comets
      if (cfg.enabled) {
        nextCometIn--
        if (nextCometIn <= 0) {
          const comet = spawnComet(w, h, cfg)
          if (comet) comets.push(comet)
          nextCometIn = cfg.spawnIntervalMin +
            Math.floor(Math.random() * (cfg.spawnIntervalMax - cfg.spawnIntervalMin))
        }
      }

      comets = comets.filter(c => !c.dead)

      for (const c of comets) {
        if (!c.exploded) {
          c.x += c.vx
          c.y += c.vy
          c.distanceTraveled += Math.hypot(c.vx, c.vy)

          c.trail.push({ x: c.x, y: c.y })
          const maxTrail = Math.ceil(c.tailLen / Math.hypot(c.vx, c.vy))
          if (c.trail.length > maxTrail) c.trail.shift()

          c.alpha = Math.min(1, c.alpha + 0.05)

          // Firecracker trigger condition: reaches its random explode distance
          const reachedDistance = c.distanceTraveled >= c.explodeDistance
          const hitBoundary = c.x > w + 20 || c.y > h + 20 || c.x < -20

          if (reachedDistance || hitBoundary) {
            c.exploded = true
            c.fadingOut = true
            c.explodeX = c.x
            c.explodeY = c.y
            if (cfg.sparkEnabled) {
              // Create expanding concentric water ripples
              c.ripples = [
                { radius: 0, maxRadius: 65, speed: 2.2, alpha: 1.0, weight: 2.2 },
                { radius: -8, maxRadius: 52, speed: 2.0, alpha: 0.8, weight: 1.5 },
                { radius: -16, maxRadius: 40, speed: 1.8, alpha: 0.6, weight: 1.0 }
              ]
            }
          }
        } else {
          // If exploded, fade out the trail gradually
          if (c.trail.length > 0) {
            c.trail.shift()
          }
        }

        let ripplesAlive = false
        if (c.exploded && c.ripples) {
          for (const rip of c.ripples) {
            rip.radius += rip.speed
            if (rip.radius > 0) {
              rip.alpha = Math.max(0, 1 - (rip.radius / rip.maxRadius))
            }
            if (rip.alpha > 0 && rip.radius < rip.maxRadius) ripplesAlive = true
          }
        }

        // Dead when exploded AND no ripples left AND trail is fully gone
        if (c.exploded && (!c.ripples || !ripplesAlive) && c.trail.length === 0) {
          c.dead = true
        } else {
          drawComet(c)
        }
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, []) // only run once — settings arrive via settingsRef

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  )
}
