/**
 * Everything on the site comes from this file.
 * Edit the words here; the pages pick them up.
 * Lines marked TODO(tadiwa) are guesses or gaps for you to fill.
 */

export type PlaceSlug = "zimbabwe" | "namibia" | "malaysia" | "bali";

export type Place = {
  slug: PlaceSlug;
  name: string;
  where: string;
  years: string;
  /** [longitude, latitude] for the pin on the globe and the dusk scene. */
  coords: [number, number];
  summary: string;
  /** Paragraphs. Links can be written as [label](https://…). */
  chapters: { title: string; years: string; text: string[] }[];
};

export type Project = {
  name: string;
  year: string;
  place: PlaceSlug;
  description: string;
  href?: string;
};

export type Post = {
  title: string;
  date: string; // YYYY-MM-DD
  href: string;
  place: PlaceSlug;
  source?: "substack"; // default: the WordPress blog
};

export type Book = {
  title: string;
  author: string;
  /** Open Library cover id: https://covers.openlibrary.org/b/id/{cover}-M.jpg */
  cover?: number;
  status: "reading" | "read";
  year: number;
  place?: PlaceSlug;
  note?: string;
};

export const me = {
  name: "Tadiwa Kennedy Vambe",
  tagline: "Creative engineer. Forward-deployed.",
  intro: [
    "I grew up in Zimbabwe, worked in Namibia, and now build from Malaysia. I write about who I'm becoming, I run, and I ship software with AI at my side.",
    "Spin the globe and tap a light to see who I was in each place: what I built, what I wrote, and what I was reading.",
  ],
  belief: "A creative genius is one who is blind enough to have a vision from nothing.",
  now: {
    building: "AccessLoop Education, a school management system for Hoperise College in Windhoek.",
    // TODO(tadiwa): what are you going to build? One or two sentences.
    next: "Forward-deployed engineering: sitting with the people who have the problem and building with AI until it's solved.",
  },
  links: [
    { label: "Blog", href: "https://tadiwavambe.blog" },
    { label: "Substack", href: "https://tadiwavambe.substack.com" },
    { label: "X", href: "https://x.com/tadiwakennedy" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/tadiwa-kennedy-vambe-0b07bab7" },
    { label: "Instagram", href: "https://www.instagram.com/tadiwavambe/" },
    { label: "YouTube", href: "https://www.youtube.com/@throughtadiwaseyes" },
    { label: "Email", href: "mailto:tadiwakennedy@gmail.com" },
    { label: "GitHub", href: "https://github.com/kensstark" },
  ],
};

export const places: Place[] = [
  {
    slug: "zimbabwe",
    name: "Zimbabwe",
    where: "Kutama → Harare",
    years: "2016 – 2025",
    coords: [31.05, -17.83],
    summary:
      "Where it starts, and where I keep coming back to. Boarding school at Kutama, a letter to my future self, a COVID chatbot, a phone accessories store, and the first posts on the blog.",
    chapters: [
      {
        title: "Kutama College",
        years: "2016 – 2019",
        text: [
          "At fourteen I wrote a letter to my 45-year-old self for a POTRAZ essay competition. It took second prize in the province and went on to nationals. I still write to that person.",
          "Kutama was make or break. Esse quam videri: to be, rather than to seem.",
        ],
      },
      {
        title: "Star Leadership Academy",
        years: "2020",
        text: [
          "With two friends I built Utano Digital Health, a chatbot that answered people's questions about COVID-19. It placed second at the South African Ideas Festival, held online in 2021.",
          "At eighteen I started AccessLoop, selling phone accessories out of Harare. Over three years it served more than a thousand customers, and I ran every part of it myself.",
        ],
      },
      {
        title: "St George's College, Harare",
        years: "2021 – 2022",
        text: [
          "A-levels in Maths, Physics and Computer Science. President of the Debate and Interact clubs.",
          "In 2022 I started writing in public.",
        ],
      },
      {
        title: "Home, between chapters",
        years: "2023 – 2025",
        text: [
          "I kept coming back: after Windhoek in 2023, for a stretch in mid-2024, and again from November 2024 to February 2025. Some of my favourite posts were written here.",
        ],
      },
    ],
  },
  {
    slug: "namibia",
    name: "Namibia",
    where: "Windhoek",
    years: "2023",
    coords: [17.08, -22.56],
    summary:
      "An IT internship at Hoperise Private College, and the first lines of the school management system I'm still building.",
    chapters: [
      {
        title: "Hoperise Private College",
        years: "Feb – Aug 2023",
        text: [
          "I came to fix spreadsheets and set up the network. I fixed the spreadsheets, set up the network and Google Workspace, and started building the system that would replace the spreadsheets.",
          "Windhoek taught me that life is not always as fast as I wish it was. It taught me to slow down, and to find out who I am by holding myself accountable, especially to the things I said I would do.",
        ],
      },
    ],
  },
  {
    slug: "malaysia",
    name: "Malaysia",
    where: "Subang Jaya · Kuala Lumpur",
    years: "Oct 2023 – now",
    coords: [101.58, 3.05],
    summary:
      "Computer Science at Monash, automation work at Ventamin, a final-year project where AI models argue with each other, and a run club.",
    chapters: [
      {
        title: "Monash University",
        years: "2023 – 2026",
        text: [
          "Bachelor of Computer Science (Advanced). My final-year project, Arbiter, got a High Distinction.",
        ],
      },
      {
        title: "Ventamin",
        years: "Nov 2025 – Mar 2026",
        text: [
          "AI research intern. I built n8n automations for operations, marketing and content, and dashboards that brought every store and platform into one live view.",
        ],
      },
      {
        title: "FAT Running",
        years: "2026 – now",
        text: [
          "[FAT Running](https://fatrunning.com) is a free run club I co-founded. Every Monday and Friday at 6 PM we run a 5.2 km loop around Sunway South Quay Lake. Every pace is welcome, and there's a walking group, so nobody gets left behind.",
          "By November 2026: 421 runners, 3,427 km together, and runs with friends like SCRAM and Montigo.",
        ],
      },
    ],
  },
  {
    slug: "bali",
    name: "Bali",
    where: "Indonesia",
    years: "2024 · 2025 · 2026",
    coords: [115.19, -8.41],
    summary: "Three trips: June 2024, July 2025 and July 2026. On the last one I read The Bourne Supremacy.",
    chapters: [],
  },
];

export const projects: Project[] = [
  {
    name: "Arbiter",
    year: "2026",
    place: "malaysia",
    description:
      "Final-year project. Two open-source LLMs debate a medical question and a judge model decides. Up to 84.9% on MedQA across 1,000+ questions.",
    href: "https://www.arbiterpro.website",
  },
  {
    name: "FAT Running",
    year: "2026",
    place: "malaysia",
    description: "A free run club in Kuala Lumpur I co-founded. Mondays and Fridays, 6 PM, around Sunway South Quay Lake. 421 runners and 3,427 km together so far.",
    href: "https://fatrunning.com",
  },
  {
    name: "fatrunning.com",
    year: "2026",
    place: "malaysia",
    description:
      "The club's web app. Runners register, sign up for runs, check in at the lake and keep their streaks going. There's a shop too.",
    href: "https://fatrunning.com",
  },
  {
    name: "Sophion",
    year: "2026",
    place: "malaysia",
    description: "A speed-reading tool that shows one word at a time (RSVP).",
  },
  {
    name: "Ventamin dashboards",
    year: "2025",
    place: "malaysia",
    description:
      "Operations, marketing and sales-forecasting dashboards that pull every store and platform into one live view.",
  },
  {
    name: "Ventamin automations",
    year: "2025",
    place: "malaysia",
    description:
      "n8n workflows for ops and content, plus scrapers that turn competitor data into on-brand marketing.",
  },
  {
    name: "Checkered Facts",
    year: "2025",
    place: "malaysia",
    description: "Formula One trivia in Python, on live data from the Ergast API.",
  },
  {
    name: "Twist-Tac-Toe",
    year: "2025",
    place: "malaysia",
    description: "Tic-tac-toe with Formula One and basketball themes, in React.",
  },
  {
    name: "SwiftPulse",
    year: "2024",
    place: "malaysia",
    description: "Task manager built by a five-person Scrum team. I facilitated and built the frontend.",
  },
  {
    name: "Hoperise School Management System",
    year: "2023 – now",
    place: "namibia",
    description:
      "Started as an internship in Windhoek. Now the first product of AccessLoop Education: records, roles and finance in one platform. React, Next.js, Supabase.",
  },
  {
    name: "The blog",
    year: "2022 – now",
    place: "zimbabwe",
    description: "Essays on growing up, faith, work and becoming. On WordPress since 2022, and now on Substack too.",
    href: "https://tadiwavambe.blog",
  },
  {
    name: "Utano Digital Health",
    year: "2021",
    place: "zimbabwe",
    description: "A COVID-19 chatbot built with two friends. Second place, South African Ideas Festival.",
  },
  {
    name: "AccessLoop",
    year: "2020 – 2023",
    place: "zimbabwe",
    description: "A phone accessories store I ran alone from 18. 1,000+ customers in three years.",
    href: "https://www.instagram.com/accessloop",
  },
];

// Pulled from tadiwavambe.blog. Pinned to where it was written,
// or to the place it's about (the Kutama essays live in Zimbabwe).
// Substack (The Blank Canvas) posts sit beside the WordPress ones, newest first.
export const posts: Post[] = [
  { date: "2026-10-21", title: "i need to meet you again", href: "https://tadiwavambe.substack.com/p/i-need-to-meet-you-again", place: "malaysia", source: "substack" },
  { date: "2026-09-02", title: "i fell in love with the color green", href: "https://tadiwavambe.substack.com/p/i-fell-in-love-with-the-color-green", place: "malaysia", source: "substack" },
  { date: "2026-08-20", title: "Jesus set the precedent on how to be human", href: "https://tadiwavambe.substack.com/p/jesus-set-the-precedent-on-how-to", place: "malaysia", source: "substack" },
  { date: "2026-07-18", title: "you don't know who you are because you are trying to be everything", href: "https://tadiwavambe.substack.com/p/you-dont-know-who-you-are-because", place: "malaysia", source: "substack" },
  { date: "2026-07-12", title: "choose your view, and play well", href: "https://tadiwavambe.blog/2026/07/12/choose-your-view-and-play-well/", place: "malaysia" },
  { date: "2026-05-21", title: "be deadly serious but playfully alive", href: "https://tadiwavambe.blog/2026/05/21/be-deadly-serious-but-playfully-alive/", place: "malaysia" },
  { date: "2026-01-29", title: "Esse Quam Videri: “Are you Still Here?”", href: "https://tadiwavambe.blog/2026/01/29/esse-quam-videri-are-you-still-here/", place: "zimbabwe" },
  { date: "2026-01-06", title: "Don’t Burn the House Down", href: "https://tadiwavambe.blog/2026/01/06/dont-burn-the-house-down/", place: "malaysia" },
  { date: "2025-11-27", title: "DIY: Love’s Final Form", href: "https://tadiwavambe.blog/2025/11/27/diy-loves-final-form/", place: "malaysia" },
  { date: "2025-09-20", title: "The Crucifixion", href: "https://tadiwavambe.blog/2025/09/20/the-crucifixion/", place: "malaysia" },
  { date: "2025-08-14", title: "We Clap Our Hands too Early", href: "https://tadiwavambe.blog/2025/08/14/we-clap-our-hands-too-early/", place: "malaysia" },
  { date: "2025-06-14", title: "Thinking, but for You", href: "https://tadiwavambe.blog/2025/06/14/thinking-but-for-you/", place: "malaysia" },
  { date: "2025-05-01", title: "The Corridor: Choices That Shape Reality", href: "https://tadiwavambe.blog/2025/05/01/the-corridor-choices-that-shape-reality/", place: "malaysia" },
  { date: "2025-03-31", title: "Slow Horses", href: "https://tadiwavambe.blog/2025/03/31/slow-horses/", place: "zimbabwe" },
  { date: "2025-02-24", title: "The Sermon on the Mount", href: "https://tadiwavambe.blog/2025/02/24/the-sermon-on-the-mount/", place: "zimbabwe" },
  { date: "2025-01-29", title: "Esse Quam Videri: “Did You Make It?”", href: "https://tadiwavambe.blog/2025/01/29/esse-quam-videri-did-you-make-it/", place: "zimbabwe" },
  { date: "2025-01-15", title: "Annie’s Final Masterpiece", href: "https://tadiwavambe.blog/2025/01/15/annies-final-masterpiece/", place: "zimbabwe" },
  { date: "2024-12-22", title: "Two", href: "https://tadiwavambe.blog/2024/12/22/two/", place: "zimbabwe" },
  { date: "2024-12-10", title: "Yesterday’s Vision, Today’s Mission", href: "https://tadiwavambe.blog/2024/12/10/yesterdays-vision-todays-mission-an-analysis-of-trusting-yourself/", place: "zimbabwe" },
  { date: "2024-10-25", title: "Leaving Heaven", href: "https://tadiwavambe.blog/2024/10/25/leaving-heaven/", place: "malaysia" },
  { date: "2024-08-12", title: "Things are Out of Control", href: "https://tadiwavambe.blog/2024/08/12/things-are-out-of-control/", place: "malaysia" },
  { date: "2024-04-26", title: "Did You Hear the Rain?", href: "https://tadiwavambe.blog/2024/04/26/did-you-hear-the-rain/", place: "malaysia" },
  { date: "2024-03-11", title: "“Esse Quam Videri”: Who are you?", href: "https://tadiwavambe.blog/2024/03/11/esse-quam-videri-who-are-you/", place: "zimbabwe" },
  { date: "2024-01-26", title: "My Reason Why", href: "https://tadiwavambe.blog/2024/01/26/my-reason-why/", place: "malaysia" },
  { date: "2024-01-12", title: "Predictive Text", href: "https://tadiwavambe.blog/2024/01/12/predictive-text/", place: "malaysia" },
  { date: "2023-11-14", title: "I didn’t have time to write this, so I did.", href: "https://tadiwavambe.blog/2023/11/14/i-didnt-have-time-to-write-this-so-i-did/", place: "malaysia" },
  { date: "2023-09-15", title: "Successful?", href: "https://tadiwavambe.blog/2023/09/15/successful/", place: "zimbabwe" },
  { date: "2023-08-07", title: "I found my silence", href: "https://tadiwavambe.blog/2023/08/07/i-found-my-silence/", place: "namibia" },
  { date: "2023-07-25", title: "Human Being", href: "https://tadiwavambe.blog/2023/07/25/human-being/", place: "namibia" },
  { date: "2023-05-20", title: "Answering Questions", href: "https://tadiwavambe.blog/2023/05/20/answering-questions/", place: "namibia" },
  { date: "2023-03-04", title: "Listen", href: "https://tadiwavambe.blog/2023/03/04/listen/", place: "namibia" },
  { date: "2023-03-03", title: "How about the beginning… again?", href: "https://tadiwavambe.blog/2023/03/03/how-about-the-beginning-again/", place: "namibia" },
  { date: "2022-08-19", title: "45", href: "https://tadiwavambe.blog/2022/08/19/45/", place: "zimbabwe" },
  { date: "2022-07-03", title: "Portals", href: "https://tadiwavambe.blog/2022/07/03/portals/", place: "zimbabwe" },
  { date: "2022-06-20", title: "“Spending” helped me earn more", href: "https://tadiwavambe.blog/2022/06/20/spending-helped-me-earn-more/", place: "zimbabwe" },
  { date: "2022-06-08", title: "Untitled Reflection", href: "https://tadiwavambe.blog/2022/06/08/untitled-reflection/", place: "zimbabwe" },
  { date: "2022-06-04", title: "The Maze", href: "https://tadiwavambe.blog/2022/06/04/the-maze/", place: "zimbabwe" },
  { date: "2022-06-01", title: "Obligated or Choice", href: "https://tadiwavambe.blog/2022/06/01/obligated-or-choice/", place: "zimbabwe" },
  { date: "2022-05-28", title: "Blindness, a New Vision.", href: "https://tadiwavambe.blog/2022/05/28/blindness-a-new-vision-%f0%9f%91%81/", place: "zimbabwe" },
];

// Newest first. Pinned to where I was when I read it.
// TODO(tadiwa): more books to come. The 2023 and 2025 places are guesses: Namibia for 2023, Malaysia for 2025.
export const books: Book[] = [
  { title: "Psycho-Cybernetics", author: "Maxwell Maltz", cover: 14428293, status: "reading", year: 2026, place: "malaysia" },
  { title: "All About Love", author: "bell hooks", cover: 42317, status: "reading", year: 2026, place: "malaysia" },
  { title: "The God-Shaped Brain", author: "Timothy R. Jennings", cover: 8860840, status: "reading", year: 2026, place: "malaysia" },
  { title: "The Bourne Supremacy", author: "Robert Ludlum", cover: 4145385, status: "read", year: 2026, place: "bali" },
  { title: "The Creative Act: A Way of Being", author: "Rick Rubin", cover: 13316390, status: "read", year: 2025, place: "malaysia" },
  { title: "Purpose and Profit", author: "George Serafeim", cover: 13290726, status: "read", year: 2025, place: "malaysia" },
  { title: "The Asshole Survival Guide", author: "Robert I. Sutton", cover: 14441989, status: "read", year: 2023, place: "namibia" },
  { title: "Vicious", author: "V. E. Schwab", cover: 7410937, status: "read", year: 2022, place: "zimbabwe" },
  { title: "Never Finished", author: "David Goggins", cover: 13180934, status: "read", year: 2022, place: "zimbabwe" },
  { title: "Can't Hurt Me", author: "David Goggins", cover: 8305903, status: "read", year: 2022, place: "zimbabwe" },
  { title: "The Almanack of Naval Ravikant", author: "Eric Jorgenson", cover: 10449931, status: "read", year: 2022, place: "zimbabwe" },
  { title: "Defending Jacob", author: "William Landay", cover: 7387091, status: "read", year: 2022, place: "zimbabwe" },
  { title: "This Is Me Letting You Go", author: "Heidi Priebe", cover: 10455903, status: "read", year: 2021, place: "zimbabwe" },
  { title: "The Way of the Superior Man", author: "David Deida", cover: 865059, status: "read", year: 2021, place: "zimbabwe" },
  { title: "The Richest Man in Babylon", author: "George S. Clason", cover: 10491331, status: "read", year: 2021, place: "zimbabwe" },
  { title: "The Millionaire Fastlane", author: "MJ DeMarco", cover: 7892520, status: "read", year: 2021, place: "zimbabwe" },
  { title: "The Alchemist", author: "Paulo Coelho", cover: 15075893, status: "read", year: 2021, place: "zimbabwe" },
  { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", cover: 8231990, status: "read", year: 2021, place: "zimbabwe" },
  { title: "Do Epic Shit", author: "Ankur Warikoo", cover: 12550538, status: "read", year: 2021, place: "zimbabwe" },
  { title: "The Mountain Is You", author: "Brianna Wiest", cover: 13838236, status: "read", year: 2021, place: "zimbabwe" },
  { title: "The Unfair Advantage", author: "Ash Ali & Hasan Kubba", cover: 14845030, status: "read", year: 2021, place: "zimbabwe" },
  { title: "Atomic Habits", author: "James Clear", cover: 12539702, status: "read", year: 2020, place: "zimbabwe" },
  { title: "Mind Hacking", author: "John Hargrave", cover: 8895428, status: "read", year: 2020, place: "zimbabwe", note: "My first non-fiction book." },
  { title: "The 4-Hour Workweek", author: "Tim Ferriss", cover: 539652, status: "read", year: 2020, place: "zimbabwe" },
  { title: "The 50th Law", author: "50 Cent & Robert Greene", cover: 6422955, status: "read", year: 2020, place: "zimbabwe" },
  { title: "The World According to Kanye", author: "Larry Smith", status: "read", year: 2020, place: "zimbabwe" },
];

import outlineData from "./outlines.json"
import type { OutlineShape } from "@/lib/dusk-geometry"
/** Country outlines (Natural Earth 1:50m). Bali is the island only. */
export const outlines = outlineData as unknown as Record<PlaceSlug, OutlineShape>

export const getPlace = (slug: string) => places.find((p) => p.slug === slug);
export const coverUrl = (id: number, size: "S" | "M" | "L" = "M") =>
  `https://covers.openlibrary.org/b/id/${id}-${size}.jpg`;
