/**
 * The geometry of the At Dusk scene, shared by the shader host (earth-blaze)
 * and the globe, so the globe can land exactly where the dusk planet sits.
 *
 * Units: like the shader, positions are in "height units": x and y are pixels
 * divided by the scene's height, with y pointing down.
 */

export type Vec3 = [number, number, number]
export type DuskGeometry = { center: [number, number]; radius: number; low: number; high: number; rest: number }

/** How far inside the limb (in height units) the focused place sits. */
export const FOCUS_DEPTH = 0.14

/**
 * The planet's radius is the scene's width (the desktop look), but never smaller than
 * this many scene heights. The floor used to be 1.4, which on a portrait phone made the
 * planet ~2.3 screens wide and its edge nearly straight.
 */
const MIN_RADIUS = 1.0

/** Height of the dusk hero on place pages, in CSS pixels. Keep in sync with the page style. */
export const heroHeight = (viewportHeight: number) => Math.max(420, Math.min(viewportHeight * 0.76, 760))

export function duskGeometry(aspect: number): DuskGeometry {
  const p = [0.15 * aspect, 0.91]
  const q = [0.88 * aspect, 0.015]
  const vx = q[0] - p[0]
  const vy = q[1] - p[1]
  const length = Math.hypot(vx, vy)
  const radius = Math.max(MIN_RADIUS, aspect)
  const offset = Math.sqrt(radius * radius - (length * length) / 4)
  const center: [number, number] = [(p[0] + q[0]) / 2 - (vy / length) * offset, (p[1] + q[1]) / 2 + (vx / length) * offset]
  // The renderer keeps every sun angle in (-2π, 0] (pointer input is mapped the same way),
  // so low ≤ rest ≤ high stays a continuous range. On a tighter, portrait planet the
  // arc's lower end dips below the centre and atan2 would hand back a positive angle,
  // flipping the range and pinning the sun to one end.
  const unwrap = (a: number) => (a > 0 ? a - Math.PI * 2 : a)
  const low = unwrap(Math.atan2(p[1] - center[1], p[0] - center[0])) + 0.035
  const high = unwrap(Math.atan2(q[1] - center[1], q[0] - center[0])) - 0.035
  const restingY = 0.4 - center[1]
  const rest = unwrap(Math.atan2(restingY, -Math.sqrt(radius * radius - restingY * restingY)))
  return { center, radius, low, high, rest }
}

/** Mirrors orientGlobe() in the shader. xy is a point on the unit disc (y down). */
export function orient(x: number, y: number, viewAngle: number): Vec3 {
  const rot = (a: number, u: number, v: number): [number, number] => [
    Math.cos(a) * u + Math.sin(a) * v,
    -Math.sin(a) * u + Math.cos(a) * v,
  ]
  let n0 = x
  let n1 = -y
  let n2 = Math.sqrt(Math.max(0, 1 - x * x - y * y))
  ;[n0, n1] = rot(-2.30267 - viewAngle, n0, n1)
  ;[n0, n2] = rot(2.7, n0, n2)
  ;[n0, n1] = rot(-0.08, n0, n1)
  return [n0, n1, n2]
}

export function fromLngLat([lng, lat]: [number, number]): Vec3 {
  const lo = (lng * Math.PI) / 180
  const la = (lat * Math.PI) / 180
  return [Math.cos(la) * Math.cos(lo), Math.sin(la), -Math.cos(la) * Math.sin(lo)]
}

export function toLngLat(n: Vec3): [number, number] {
  const l = Math.hypot(...n)
  return [(Math.atan2(-n[2] / l, n[0] / l) * 180) / Math.PI, (Math.asin(n[1] / l) * 180) / Math.PI]
}

/** Unit-disc position (y down) where the focused place sits: just inside the limb, under the sun at rest. */
export function focusSpot(g: DuskGeometry): [number, number] {
  const k = 1 - FOCUS_DEPTH / g.radius
  return [Math.cos(g.rest) * k, Math.sin(g.rest) * k]
}

/** Column-major mat3 that rotates the spot under the resting sun onto the focus point. */
export function focusMatrix(focus: [number, number] | undefined, g: DuskGeometry | undefined): Float32Array {
  const identity = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])
  if (!focus || !g) return identity
  const [sx, sy] = focusSpot(g)
  const a = orient(sx, sy, g.rest)
  const len = Math.hypot(...a)
  a[0] /= len
  a[1] /= len
  a[2] /= len
  const b = fromLngLat(focus)
  const v = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  const c = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  if (c < -0.9999) return new Float32Array([-1, 0, 0, 0, 1, 0, 0, 0, -1])
  const K = [
    [0, -v[2], v[1]],
    [v[2], 0, -v[0]],
    [-v[1], v[0], 0],
  ]
  const f = 1 / (1 + c)
  const R = [0, 1, 2].map((i) =>
    [0, 1, 2].map((j) => {
      let kk = 0
      for (let m = 0; m < 3; m++) kk += K[i][m] * K[m][j]
      return (i === j ? 1 : 0) + K[i][j] + kk * f
    }),
  )
  return new Float32Array([R[0][0], R[1][0], R[2][0], R[0][1], R[1][1], R[2][1], R[0][2], R[1][2], R[2][2]])
}

/** The longitude/latitude the dusk scene shows at unit-disc position xy. */
export function lngLatAt(xy: [number, number], g: DuskGeometry, m: Float32Array): [number, number] {
  const n = orient(xy[0], xy[1], g.rest)
  // m is column-major
  const r: Vec3 = [
    m[0] * n[0] + m[3] * n[1] + m[6] * n[2],
    m[1] * n[0] + m[4] * n[1] + m[7] * n[2],
    m[2] * n[0] + m[5] * n[1] + m[8] * n[2],
  ]
  return toLngLat(r)
}

export type OutlineShape = { bbox: [number, number, number, number]; rings: [number, number][][] }
