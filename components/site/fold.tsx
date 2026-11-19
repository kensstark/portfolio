"use client"

import { Children, useLayoutEffect, useRef, useState } from "react"

/**
 * Shows the first few items of a list; the next one peeks through a fade,
 * and a button opens the rest.
 */
export function Fold({ children, show = 3, label = "more" }: { children: React.ReactNode; show?: number; label?: string }) {
  const items = Children.toArray(children)
  const listRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [height, setHeight] = useState<number | null>(null)
  const folds = items.length > show

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list || !folds) return
    Array.from(list.children).forEach((el, i) => {
      if (!open && i >= show) el.setAttribute("inert", "")
      else el.removeAttribute("inert")
    })
    const measure = () => {
      const peek = list.children[show] as HTMLElement | undefined
      if (!peek) return
      setHeight(open ? list.scrollHeight : peek.offsetTop + Math.min(peek.offsetHeight, 56))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [open, show, folds])

  if (!folds) return <ul className="-my-2">{items}</ul>

  const mask = "linear-gradient(to bottom, black calc(100% - 72px), transparent)"
  return (
    <div>
      <ul
        ref={listRef}
        className="relative -my-2 overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
        style={{
          maxHeight: height ?? undefined,
          maskImage: open ? undefined : mask,
          WebkitMaskImage: open ? undefined : mask,
        }}
      >
        {items}
      </ul>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-1 py-2.5 text-sm text-muted-foreground transition-[color,opacity] duration-150 ease-out hover:text-foreground active:opacity-60"
      >
        {open ? "Show less" : `See ${items.length - show} ${label}`}
      </button>
    </div>
  )
}
