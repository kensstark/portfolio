"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import RotatingEarth, { type GlobePin } from "@/components/ui/wireframe-dotted-globe"

export function HomeGlobe({ pins }: { pins: GlobePin[] }) {
  const router = useRouter()
  useEffect(() => {
    pins.forEach((p) => router.prefetch(`/places/${p.id}`))
  }, [pins, router])
  return <RotatingEarth pins={pins} onSelect={(id) => router.push(`/places/${id}`)} />
}
