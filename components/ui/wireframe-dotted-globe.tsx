"use client"

/**
 * Wireframe dotted globe, adapted from the original RotatingEarth:
 * - sizes itself to its container (square), not the window
 * - pointer events, so drag works with touch as well as a mouse
 * - pins you can tap; a dashed route joins them in order
 * - tapping a pin hands off to the At Dusk scene: the globe breaks out of its card,
 *   slides to where the dusk planet will sit, lights the place's outline, and then
 *   onSelect fires so the page can navigate
 * - no wheel zoom, so it never traps page scroll
 */

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import type { Feature, FeatureCollection, Geometry, Position } from "geojson"
import { duskGeometry, focusMatrix, heroHeight, lngLatAt, type OutlineShape } from "@/lib/dusk-geometry"

export type GlobePin = { id: string; label: string; coords: [number, number]; outline?: OutlineShape }

interface RotatingEarthProps {
  pins?: GlobePin[]
  /** Draw a dashed route through the pins in order. */
  route?: boolean
  onSelect?: (id: string) => void
  /** Where the globe faces at load: [longitude, latitude]. */
  initialCenter?: [number, number]
  className?: string
}

const LAND_URL =
  "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
const EMBER = "244,180,140"

type LandData = { land: FeatureCollection; dots: [number, number][] }
let landCache: Promise<LandData> | null = null

function pointInRing([x, y]: [number, number], ring: Position[]) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

function pointInPolygon(point: [number, number], polygon: Position[][]) {
  if (!pointInRing(point, polygon[0])) return false
  for (let i = 1; i < polygon.length; i++) if (pointInRing(point, polygon[i])) return false
  return true
}

function pointInFeature(point: [number, number], feature: Feature<Geometry>) {
  const g = feature.geometry
  if (g.type === "Polygon") return pointInPolygon(point, g.coordinates)
  if (g.type === "MultiPolygon") return g.coordinates.some((poly) => pointInPolygon(point, poly))
  return false
}

function loadLand(): Promise<LandData> {
  if (!landCache) {
    landCache = fetch(LAND_URL)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load land data")
        return r.json() as Promise<FeatureCollection>
      })
      .then((land) => {
        const dots: [number, number][] = []
        const step = 16 * 0.08
        for (const feature of land.features) {
          const [[minLng, minLat], [maxLng, maxLat]] = d3.geoBounds(feature)
          for (let lng = minLng; lng <= maxLng; lng += step)
            for (let lat = minLat; lat <= maxLat; lat += step)
              if (pointInFeature([lng, lat], feature)) dots.push([lng, lat])
        }
        return { land, dots }
      })
      .catch((err) => {
        landCache = null
        throw err
      })
  }
  return landCache
}

const smooth = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)))
  return x * x * (3 - 2 * x)
}

/** Shortest-path angle interpolation target, in degrees. */
const near = (from: number, to: number) => {
  while (to - from > 180) to -= 360
  while (to - from < -180) to += 360
  return to
}

type PaintOptions = {
  /** 0 → the plain globe, 1 → night has fallen and only the place remains. */
  dusk: number
  /** The place being handed off to, if any. */
  focus?: GlobePin
  hovered?: string | null
  time: number
  pins: GlobePin[]
  route: boolean
  font: string
  reduceMotion: boolean
}

function paint(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  projection: d3.GeoProjection,
  data: LandData | null,
  o: PaintOptions,
) {
  const path = d3.geoPath().projection(projection).context(ctx)
  const [cx, cy] = projection.translate()
  const scale = projection.scale()
  const rot = projection.rotate()
  const center: [number, number] = [-rot[0], -rot[1]]
  const facing = (c: [number, number]) => d3.geoDistance(c, center)
  const day = 1 - o.dusk

  ctx.clearRect(0, 0, width, height)

  // Ocean and limb
  ctx.beginPath()
  ctx.arc(cx, cy, scale, 0, 2 * Math.PI)
  ctx.fillStyle = "#000"
  ctx.fill()
  ctx.lineWidth = 1.25
  ctx.strokeStyle = `rgba(255,255,255,${0.55 * day})`
  ctx.stroke()
  if (o.dusk > 0) {
    ctx.save()
    ctx.shadowColor = `rgba(${EMBER},${0.8 * o.dusk})`
    ctx.shadowBlur = 18
    ctx.strokeStyle = `rgba(255,214,190,${0.75 * o.dusk})`
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.restore()
  }

  if (!data) return

  if (day > 0.01) {
    ctx.globalAlpha = day
    ctx.beginPath()
    path(d3.geoGraticule()())
    ctx.strokeStyle = "rgba(255,255,255,0.12)"
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.beginPath()
    data.land.features.forEach((f) => path(f))
    ctx.strokeStyle = "rgba(255,255,255,0.7)"
    ctx.stroke()

    ctx.fillStyle = "#8a8a8a"
    const dotR = 1.1 * Math.min(scale / Math.max(width, 1) / 0.45, 1.8)
    for (const dot of data.dots) {
      if (facing(dot) > Math.PI / 2) continue
      const p = projection(dot)
      if (!p || p[0] < -4 || p[0] > width + 4 || p[1] < -4 || p[1] > height + 4) continue
      ctx.beginPath()
      ctx.arc(p[0], p[1], Math.max(dotR, 1.1), 0, 2 * Math.PI)
      ctx.fill()
    }

    if (o.route && o.pins.length > 1) {
      ctx.beginPath()
      path({ type: "LineString", coordinates: o.pins.map((p) => p.coords) })
      ctx.setLineDash([3, 5])
      ctx.strokeStyle = `rgba(${EMBER},0.55)`
      ctx.lineWidth = 1.25
      ctx.stroke()
      ctx.setLineDash([])
    }
    ctx.globalAlpha = 1
  }

  // The chosen place's outline, lighting up as night falls
  if (o.focus?.outline && o.dusk > 0) {
    const lines: GeoJSON.MultiLineString = { type: "MultiLineString", coordinates: o.focus.outline.rings }
    ctx.save()
    ctx.beginPath()
    path(lines)
    ctx.lineJoin = "round"
    ctx.shadowColor = `rgba(${EMBER},0.9)`
    ctx.shadowBlur = 14
    ctx.strokeStyle = `rgba(255,190,150,${smooth(0.3, 0.85, o.dusk)})`
    ctx.lineWidth = 1.4
    ctx.stroke()
    ctx.restore()
  }

  // Pins
  const pulse = o.reduceMotion ? 0.5 : (Math.sin(o.time / 600) + 1) / 2
  ctx.font = `500 12px ${o.font}`
  ctx.textBaseline = "middle"
  for (const pin of o.pins) {
    const d = facing(pin.coords)
    if (d > Math.PI / 2) continue
    const p = projection(pin.coords)
    if (!p) continue
    const isFocus = o.focus?.id === pin.id
    const fade = isFocus ? 1 - smooth(0.55, 0.9, o.dusk) : day
    const alpha = Math.min(1, (Math.PI / 2 - d) * 4) * fade
    if (alpha <= 0.01) continue
    const active = o.hovered === pin.id || isFocus
    ctx.globalAlpha = alpha

    ctx.beginPath()
    ctx.arc(p[0], p[1], 7 + pulse * 6 + (active ? 3 : 0), 0, 2 * Math.PI)
    ctx.fillStyle = `rgba(${EMBER},${0.12 + (1 - pulse) * 0.12})`
    ctx.fill()

    ctx.beginPath()
    ctx.arc(p[0], p[1], active ? 5 : 4, 0, 2 * Math.PI)
    ctx.fillStyle = `rgb(${EMBER})`
    ctx.fill()

    const flip = p[0] > width - 90
    ctx.textAlign = flip ? "right" : "left"
    const tx = p[0] + (flip ? -12 : 12)
    ctx.lineWidth = 3
    ctx.strokeStyle = "rgba(0,0,0,0.85)"
    ctx.strokeText(pin.label, tx, p[1])
    ctx.fillStyle = active ? "#fff" : "rgba(255,255,255,0.85)"
    ctx.fillText(pin.label, tx, p[1])
    ctx.globalAlpha = 1
  }
}

/**
 * Where the globe must end up so it lines up with the dusk hero of the place page:
 * same circle, same scale, same orientation.
 */
function duskTarget(pin: GlobePin, viewportWidth: number, viewportHeight: number) {
  const h = heroHeight(viewportHeight)
  const g = duskGeometry(viewportWidth / h)
  const m = focusMatrix(pin.coords, g)
  const cx = g.center[0] * h
  const cy = g.center[1] * h
  const R = g.radius * h
  const middle = lngLatAt([0, 0], g, m)
  const ref = lngLatAt([0.5, 0], g, m)
  const proj = d3.geoOrthographic().clipAngle(90).translate([cx, cy]).scale(R)
  proj.rotate([-middle[0], -middle[1], 0])
  const p = proj(ref) ?? [cx + R / 2, cy]
  const off = (Math.atan2(p[1] - cy, p[0] - cx) * 180) / Math.PI
  let best: [number, number, number] = [-middle[0], -middle[1], 0]
  let bestErr = Infinity
  for (const gamma of [off, -off]) {
    proj.rotate([-middle[0], -middle[1], gamma])
    const q = proj(ref)
    const err = q ? Math.hypot(q[0] - (cx + R / 2), q[1] - cy) : Infinity
    if (err < bestErr) {
      bestErr = err
      best = [-middle[0], -middle[1], gamma]
    }
  }
  // The sun sits on the limb at the resting angle.
  const sun: [number, number] = [cx + Math.cos(g.rest) * (R - 0.007 * h), cy + Math.sin(g.rest) * (R - 0.007 * h)]
  return { translate: [cx, cy] as [number, number], scale: R, rotate: best, sun }
}

export default function RotatingEarth({
  pins = [],
  route = true,
  onSelect,
  initialCenter = [40, -10],
  className = "",
}: RotatingEarthProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!wrap || !canvas || !context) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const font = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif"
    const projection = d3.geoOrthographic().clipAngle(90)

    let size = 0
    let radius = 0
    let data: LandData | null = null
    let hovered: string | null = null
    let flying = false
    let disposed = false
    let overlay: HTMLDivElement | null = null
    const rotation: [number, number, number] = [-initialCenter[0], -initialCenter[1], 0]

    const opts = (extra?: Partial<PaintOptions>): PaintOptions => ({
      dusk: 0,
      hovered,
      time: performance.now(),
      pins,
      route,
      font,
      reduceMotion,
      ...extra,
    })

    const render = () => {
      if (size) paint(context, size, size, projection, data, opts())
    }

    const resize = () => {
      const width = Math.round(wrap.clientWidth)
      if (!width || width === size) return
      size = width
      radius = size / 2.25
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = size * dpr
      canvas.height = size * dpr
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      projection.scale(radius).translate([size / 2, size / 2])
      render()
    }

    const facing = (coords: [number, number]) => d3.geoDistance(coords, [-rotation[0], -rotation[1]])

    let dragging = false
    let down: { x: number; y: number; rot: [number, number, number]; id: number } | null = null

    // Auto-rotation, paused while interacting
    let autoRotate = !reduceMotion
    let resumeAt = 0
    let last = 0
    const timer = d3.timer((elapsed) => {
      const dt = Math.min(elapsed - last, 50)
      last = elapsed
      if (flying) return
      if (!autoRotate && !reduceMotion && performance.now() > resumeAt && !dragging) autoRotate = true
      if (autoRotate) {
        rotation[0] += dt * 0.006
        projection.rotate(rotation)
      }
      render()
    })

    const pinAt = (x: number, y: number) => {
      let best: GlobePin | null = null
      let bestD = 22
      for (const pin of pins) {
        if (facing(pin.coords) > Math.PI / 2) continue
        const p = projection(pin.coords)
        if (!p) continue
        const d = Math.hypot(p[0] - x, p[1] - y)
        if (d < bestD) {
          bestD = d
          best = pin
        }
      }
      return best
    }

    /** The hand-off: break out of the card and settle into the dusk planet. */
    const flyTo = (pin: GlobePin) => {
      flying = true
      hovered = pin.id
      const go = () => {
        try {
          sessionStorage.setItem("dusk-handoff", String(Date.now()))
        } catch {}
        if (!disposed) onSelectRef.current?.(pin.id)
      }
      if (reduceMotion) return go()

      const vw = document.documentElement.clientWidth
      const vh = window.innerHeight
      const box = canvas.getBoundingClientRect()
      const target = duskTarget(pin, vw, vh)

      overlay = document.createElement("div")
      overlay.setAttribute("aria-hidden", "true")
      Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        zIndex: "60",
        background: "#000",
        opacity: "0",
        transition: "opacity 600ms ease",
      })
      const layer = document.createElement("canvas")
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      layer.width = vw * dpr
      layer.height = vh * dpr
      Object.assign(layer.style, { position: "fixed", inset: "0", width: `${vw}px`, height: `${vh}px`, zIndex: "61" })
      const glow = document.createElement("div")
      Object.assign(glow.style, {
        position: "fixed",
        left: `${target.sun[0] - 160}px`,
        top: `${target.sun[1] - 160}px`,
        width: "320px",
        height: "320px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,214,190,0.55) 0%, rgba(168,82,110,0.18) 35%, transparent 70%)",
        opacity: "0",
        zIndex: "62",
        transition: "opacity 700ms ease",
      })
      const host = document.createElement("div")
      host.append(overlay, layer, glow)
      document.body.appendChild(host)
      overlay = host
      const lctx = layer.getContext("2d")!
      lctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // The card goes dark underneath, so only the flying globe is seen.
      canvas.style.visibility = "hidden"
      requestAnimationFrame(() => {
        ;(host.firstChild as HTMLDivElement).style.opacity = "1"
      })

      const from = {
        translate: [box.left + size / 2, box.top + size / 2] as [number, number],
        scale: projection.scale(),
        rotate: [...rotation] as [number, number, number],
      }
      const to = {
        translate: target.translate,
        scale: target.scale,
        rotate: [
          near(from.rotate[0], target.rotate[0]),
          target.rotate[1],
          near(from.rotate[2], target.rotate[2]),
        ] as [number, number, number],
      }
      const fly = d3.geoOrthographic().clipAngle(90)
      const duration = 1500
      const t = d3.timer((elapsed) => {
        const k = Math.min(1, elapsed / duration)
        const e = d3.easeCubicInOut(k)
        // Rotation leads a little, so the place swings into position before the globe lands.
        const er = d3.easeCubicInOut(Math.min(1, k * 1.15))
        fly
          .translate([
            from.translate[0] + (to.translate[0] - from.translate[0]) * e,
            from.translate[1] + (to.translate[1] - from.translate[1]) * e,
          ])
          .scale(from.scale * Math.pow(to.scale / from.scale, e))
          .rotate([0, 1, 2].map((i) => from.rotate[i] + (to.rotate[i] - from.rotate[i]) * er) as [number, number, number])
        paint(lctx, vw, vh, fly, data, opts({ dusk: smooth(0.25, 1, k), focus: pin, time: performance.now() }))
        if (k > 0.75) glow.style.opacity = "1"
        if (k >= 1) {
          t.stop()
          go()
        }
      })
    }

    const local = (e: PointerEvent) => {
      const box = canvas.getBoundingClientRect()
      return { x: e.clientX - box.left, y: e.clientY - box.top }
    }

    const onDown = (e: PointerEvent) => {
      if (flying || (e.pointerType === "mouse" && e.button !== 0)) return
      down = { x: e.clientX, y: e.clientY, rot: [...rotation], id: e.pointerId }
      dragging = false
      autoRotate = false
    }
    const onMove = (e: PointerEvent) => {
      if (flying) return
      if (down && e.pointerId === down.id) {
        const dx = e.clientX - down.x
        const dy = e.clientY - down.y
        if (!dragging && Math.hypot(dx, dy) > 5) {
          dragging = true
          canvas.setPointerCapture(e.pointerId)
        }
        if (dragging) {
          const s = 0.35 * (radius / projection.scale())
          rotation[0] = down.rot[0] + dx * s
          rotation[1] = Math.max(-70, Math.min(70, down.rot[1] - dy * s))
          projection.rotate(rotation)
          render()
        }
        return
      }
      const { x, y } = local(e)
      const pin = pinAt(x, y)
      hovered = pin?.id ?? null
      canvas.style.cursor = pin ? "pointer" : "grab"
      if (pin) {
        autoRotate = false
        resumeAt = performance.now() + 800
      }
    }
    const onUp = (e: PointerEvent) => {
      if (!down || e.pointerId !== down.id) return
      if (!dragging) {
        const { x, y } = local(e)
        const pin = pinAt(x, y)
        if (pin) flyTo(pin)
      }
      down = null
      dragging = false
      resumeAt = performance.now() + 1500
    }
    const onCancel = () => {
      down = null
      dragging = false
      resumeAt = performance.now() + 1500
    }
    const onLeave = () => {
      hovered = null
    }

    canvas.addEventListener("pointerdown", onDown)
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerup", onUp)
    canvas.addEventListener("pointercancel", onCancel)
    canvas.addEventListener("pointerleave", onLeave)

    const observer = new ResizeObserver(resize)
    observer.observe(wrap)
    projection.rotate(rotation)
    resize()

    loadLand()
      .then((d) => {
        if (disposed) return
        data = d
        setIsLoading(false)
        render()
      })
      .catch(() => {
        if (disposed) return
        setError("Couldn't load the map data.")
        setIsLoading(false)
      })

    return () => {
      disposed = true
      timer.stop()
      observer.disconnect()
      canvas.removeEventListener("pointerdown", onDown)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("pointercancel", onCancel)
      canvas.removeEventListener("pointerleave", onLeave)
      // Let the dusk page appear underneath, then dissolve the flying globe into it.
      const host = overlay
      if (host) {
        setTimeout(() => {
          host.style.transition = "opacity 900ms ease"
          host.style.opacity = "0"
          setTimeout(() => host.remove(), 950)
        }, 250)
      }
    }
    // Pins are static content; re-run only if their identity set changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins.map((p) => p.id).join(","), route])

  return (
    <div ref={wrapRef} className={`dark relative aspect-square w-full overflow-hidden rounded-2xl bg-black ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Globe with ${pins.length} places: ${pins.map((p) => p.label).join(", ")}`}
        className="block touch-pan-y select-none"
        style={{ cursor: "grab" }}
      />
      {(isLoading || error) && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
          {error ?? "Loading the world…"}
        </div>
      )}
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-neutral-900/80 px-2 py-1 text-[11px] text-muted-foreground">
        Drag to spin · tap a light
      </div>
    </div>
  )
}
