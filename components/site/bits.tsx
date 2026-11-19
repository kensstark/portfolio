import Link from "next/link"
import { coverUrl, type Book } from "@/content/site"

export function Section({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="mt-16">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  )
}

const isExternal = (href: string) => /^https?:\/\//.test(href)

export function Row({ href, title, meta, children }: { href?: string; title: string; meta?: string; children?: React.ReactNode }) {
  const head = (
    <div className="flex items-baseline justify-between gap-4">
      <span className={href ? "underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-current" : undefined}>
        {title}
      </span>
      {meta && <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{meta}</span>}
    </div>
  )
  const body = (
    <>
      {head}
      {children && <p className="mt-0.5 text-sm text-muted-foreground">{children}</p>}
    </>
  )
  if (!href) return <li className="py-2">{body}</li>
  return (
    <li>
      {isExternal(href) ? (
        <a href={href} target="_blank" rel="noreferrer" className="group block py-2">
          {body}
        </a>
      ) : (
        <Link href={href} className="group block py-2">
          {body}
        </Link>
      )}
    </li>
  )
}

export function BookCover({ book, size = "md" }: { book: Book; size?: "sm" | "md" }) {
  const w = size === "sm" ? "w-14" : "w-24"
  return (
    <figure className={`${w} shrink-0`}>
      <div className="aspect-[2/3] overflow-hidden rounded-[4px] bg-muted shadow-[0_1px_2px_rgba(0,0,0,0.12),0_4px_12px_-4px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
        {book.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl(book.cover)} alt={`${book.title} cover`} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center p-2 text-[10px] leading-tight text-muted-foreground">{book.title}</div>
        )}
      </div>
      {size === "md" && (
        <figcaption className="mt-2 text-xs leading-snug">
          <span className="block">{book.title}</span>
          <span className="block text-muted-foreground">{book.author}</span>
          <span className="block font-mono text-[11px] text-muted-foreground">{book.status === "reading" ? "Reading" : book.year}</span>
          {book.note && <span className="mt-1 block text-dusk">{book.note}</span>}
        </figcaption>
      )}
    </figure>
  )
}

export function Shelf({ books }: { books: Book[] }) {
  return (
    <div className="-mx-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
      {books.map((b) => (
        <div key={b.title} className="snap-start">
          <BookCover book={b} />
        </div>
      ))}
    </div>
  )
}

/** Renders [label](url) links inside a plain paragraph. */
export function Prose({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  return (
    <p>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        return m ? (
          <a key={i} href={m[2]} target="_blank" rel="noreferrer" className="underline decoration-border underline-offset-4 hover:decoration-current">
            {m[1]}
          </a>
        ) : (
          part
        )
      })}
    </p>
  )
}

export const postMeta = (p: { date: string; source?: string }) =>
  (p.source === "substack" ? "Substack · " : "") + formatDate(p.date)

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { month: "short", year: "numeric" })
