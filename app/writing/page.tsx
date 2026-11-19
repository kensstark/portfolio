import type { Metadata } from "next"
import Link from "next/link"
import { Row, formatDate } from "@/components/site/bits"
import { getPlace, me, posts } from "@/content/site"

export const metadata: Metadata = { title: `Writing · ${me.name}` }

export default function Writing() {
  const years = [...new Set(posts.map((p) => p.date.slice(0, 4)))]
  return (
    <main className="mx-auto max-w-[620px] px-4 pb-24 pt-16 sm:pt-24">
      <Link
        href="/"
        className="-my-2.5 inline-block py-2.5 text-sm text-muted-foreground transition-[color,opacity] duration-150 ease-out hover:text-foreground active:opacity-60"
      >
        ← {me.name}
      </Link>
      <h1 className="mt-8 font-medium">Writing</h1>
      <p className="text-muted-foreground">
        {posts.length} posts since 2022, on{" "}
        <a href="https://tadiwavambe.blog" target="_blank" rel="noreferrer" className="underline decoration-border underline-offset-4 hover:decoration-current">my blog</a> and{" "}
        <a href="https://tadiwavambe.substack.com" target="_blank" rel="noreferrer" className="underline decoration-border underline-offset-4 hover:decoration-current">The Blank Canvas</a>, pinned to where I wrote them.
      </p>
      {years.map((y) => (
        <section key={y} className="mt-12">
          <h2 className="mb-2 font-mono text-xs text-muted-foreground">{y}</h2>
          <ul>
            {posts.filter((p) => p.date.startsWith(y)).map((p) => (
              <Row key={p.href} href={p.href} title={p.title} meta={`${p.source === "substack" ? "Substack · " : ""}${getPlace(p.place)?.name} · ${formatDate(p.date).split(" ")[0]}`} />
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
