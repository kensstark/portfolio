import type { Metadata, Viewport } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { EarthBlaze } from "@/components/ui/earth-blaze"
import { Prose, Row, Section, Shelf, postMeta } from "@/components/site/bits"
import { Fold } from "@/components/site/fold"
import { books, getPlace, me, outlines, places, posts, projects } from "@/content/site"

export const generateStaticParams = () => places.map((p) => ({ slug: p.slug }))
export const dynamicParams = false

// The top of every place page is the night sky, so the status bar is too, in either scheme.
export const viewport: Viewport = { themeColor: "#000000" }

const navLink = "group block py-1 transition-opacity duration-150 ease-out active:opacity-60"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const place = getPlace((await params).slug)
  return place ? { title: `${place.name} · ${me.name}`, description: place.summary } : {}
}

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const place = getPlace((await params).slug)
  if (!place) notFound()

  const index = places.indexOf(place)
  const prev = places[index - 1]
  const next = places[index + 1]
  const built = projects.filter((p) => p.place === place.slug)
  const written = posts.filter((p) => p.place === place.slug)
  const read = books.filter((b) => b.place === place.slug)

  return (
    <main className="pb-24">
      <div className="relative">
        {/* iOS rubber-bands past the top of the page; keep the sky dark up there instead of flashing white. */}
        <div aria-hidden className="absolute inset-x-0 bottom-full h-[100svh] bg-black" />
        <EarthBlaze
          focus={place.coords}
          outline={outlines[place.slug]}
          surfaceBrightness={1.6}
          label={`Dusk over ${place.name}`}
          style={{ aspectRatio: "auto", height: "min(76svh, 760px)", minHeight: 420 }}
        >
          <div className="dark flex h-full flex-col justify-end p-4 sm:p-8">
            <div className="mx-auto w-full max-w-[620px] pb-6 sm:px-4">
              <h1 className="text-4xl font-medium tracking-tight text-white sm:text-5xl">{place.name}</h1>
              {place.years && <p className="mt-1 text-white/60">{place.years}</p>}
            </div>
          </div>
        </EarthBlaze>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="mx-auto max-w-[620px] px-4">
        <p className="mt-8 text-lg leading-relaxed">{place.summary}</p>

        {place.chapters.map((c) => (
          <Section key={c.title} title={c.title} aside={<span className="font-mono text-xs text-muted-foreground">{c.years}</span>}>
            <div className="space-y-4 leading-relaxed">
              {c.text.map((t) => (
                <Prose key={t} text={t} />
              ))}
            </div>
          </Section>
        ))}

        {built.length > 0 && (
          <Section title="Built here">
            <Fold label="more">
              {built.map((p) => (
                <Row key={p.name} href={p.href} title={p.name} meta={p.year}>
                  {p.description}
                </Row>
              ))}
            </Fold>
          </Section>
        )}

        {written.length > 0 && (
          <Section title="Written here" aside={<span className="font-mono text-xs text-muted-foreground">{written.length}</span>}>
            <ul className="-my-2">
              {written.map((p) => (
                <Row key={p.href} href={p.href} title={p.title} meta={postMeta(p)} />
              ))}
            </ul>
          </Section>
        )}

        {read.length > 0 && (
          <Section title="Read here">
            <Shelf books={read} />
          </Section>
        )}

        <nav className="mt-20 grid grid-cols-3 gap-4 border-t pt-5 text-sm">
          <div>
            {prev && (
              <Link href={`/places/${prev.slug}`} className={navLink}>
                <span className="text-muted-foreground">← Before</span>
                <span className="block group-hover:underline">{prev.name}</span>
              </Link>
            )}
          </div>
          <div className="text-center">
            <Link href="/" className={navLink}>
              <span className="text-muted-foreground">↑ Home</span>
              <span className="block group-hover:underline">The globe</span>
            </Link>
          </div>
          <div className="text-right">
            {next ? (
              <Link href={`/places/${next.slug}`} className={navLink}>
                <span className="text-muted-foreground">Next stop →</span>
                <span className="block group-hover:underline">{next.name}</span>
              </Link>
            ) : null}
          </div>
        </nav>
      </div>
    </main>
  )
}
