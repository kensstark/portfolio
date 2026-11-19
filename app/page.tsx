import Link from "next/link"
import { HomeGlobe } from "@/components/site/home-globe"
import { Fold } from "@/components/site/fold"
import { Row, Section, Shelf, BookCover, formatDate, postMeta } from "@/components/site/bits"
import { books, me, outlines, places, posts, projects } from "@/content/site"

export default function Home() {
  const reading = books.filter((b) => b.status === "reading")
  const latest = posts[0]
  const pins = places.map((p) => ({ id: p.slug, label: p.name, coords: p.coords, outline: outlines[p.slug] }))

  return (
    <main className="mx-auto max-w-[620px] px-4 pb-24 pt-16 sm:pt-24">
      <header>
        <h1 className="font-medium">{me.name}</h1>
        <p className="text-muted-foreground">{me.tagline}</p>
      </header>

      <div className="mt-8 space-y-4 leading-relaxed">
        {me.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <blockquote className="border-l-2 border-dusk pl-4 text-muted-foreground">{me.belief}</blockquote>
      </div>

      <div className="mt-10">
        <HomeGlobe pins={pins} />
        <ol className="mt-1 flex flex-wrap gap-x-4 text-sm">
          {places.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/places/${p.slug}`}
                className="inline-block py-2.5 text-muted-foreground transition-[color,opacity] duration-150 ease-out hover:text-foreground active:opacity-60"
              >
                <span className="mr-1 font-mono text-xs text-dusk">{String(i + 1).padStart(2, "0")}</span>
                {p.name}
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <Section title="Now">
        <ul className="space-y-3">
          <li>
            <span className="text-muted-foreground">Building </span>
            {me.now.building}
          </li>
          <li>
            <span className="text-muted-foreground">Latest post </span>
            <a href={latest.href} target="_blank" rel="noreferrer" className="underline decoration-border underline-offset-4 hover:decoration-current">
              {latest.title}
            </a>
            <span className="text-muted-foreground"> · {formatDate(latest.date)}</span>
          </li>
          <li>
            <span className="text-muted-foreground">Reading </span>
            {reading.map((b, i) => (
              <span key={b.title}>
                <em className="not-italic">{b.title}</em>
                {i < reading.length - 2 ? ", " : i === reading.length - 2 ? " and " : ""}
              </span>
            ))}
            , all at once.
            <div className="mt-3 flex gap-3">
              {reading.map((b) => (
                <BookCover key={b.title} book={b} size="sm" />
              ))}
            </div>
          </li>
        </ul>
      </Section>

      <Section
        title="Writing"
        aside={
          <Link
            href="/writing"
            className="-my-2.5 inline-block py-2.5 text-sm text-muted-foreground transition-[color,opacity] duration-150 ease-out hover:text-foreground active:opacity-60"
          >
            All {posts.length} →
          </Link>
        }
      >
        <ul className="-my-2">
          {posts.slice(0, 6).map((p) => (
            <Row key={p.href} href={p.href} title={p.title} meta={postMeta(p)} />
          ))}
        </ul>
      </Section>

      <Section title="Built">
        <Fold label="more projects">
          {projects.map((p) => (
            <Row key={p.name} href={p.href} title={p.name} meta={p.year}>
              {p.description}
            </Row>
          ))}
        </Fold>
      </Section>

      <Section title="Shelf">
        <Shelf books={books} />
      </Section>

      <Section title="Next">
        <p className="leading-relaxed">{me.now.next}</p>
      </Section>

      <footer className="mt-20 flex flex-wrap gap-x-4 text-sm text-muted-foreground">
        {me.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="inline-block py-2.5 transition-[color,opacity] duration-150 ease-out hover:text-foreground active:opacity-60"
          >
            {l.label}
          </a>
        ))}
      </footer>
    </main>
  )
}
