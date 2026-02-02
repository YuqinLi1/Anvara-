import Link from 'next/link';
import { Metadata } from 'next';

//  Add proper metadata for SEO
export const metadata: Metadata = {
  title: 'Anvara | Sponsorship Marketplace',
  description: 'The leading marketplace connecting premium sponsors with top-tier publishers.',
  openGraph: {
    title: 'Anvara Marketplace',
    description: 'Connect, Campaign, and Grow.',
  },
};

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section - The core of the marketing landing page */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl">
          Sponsorship Made <span className="text-[--color-primary]">Simpler</span>
        </h1>
        <p className="mb-10 max-w-2xl text-xl text-[--color-muted]">
          Anvara connects global premium sponsors with specialized publishers. Providing transparent
          pricing, real-time analytics, and all-in-one campaign management.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {/* Using Link instead of <a> (Next.js Best Practice) */}
          <Link
            href="/marketplace"
            className="rounded-lg bg-[--color-primary] px-8 py-4 text-lg font-bold text-white transition-all hover:bg-[--color-primary-hover] hover:shadow-lg"
          >
            Browse Marketplace
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-[--color-border] px-8 py-4 text-lg font-bold transition-all hover:bg-gray-50"
          >
            Join Now
          </Link>
        </div>
      </section>

      {/* Features Section - Role-based functionality */}
      <section className="container mx-auto grid gap-8 px-4 py-16 sm:grid-cols-2">
        {/* Sponsor Card */}
        <div className="group rounded-2xl border border-[--color-border] p-8 transition-all hover:border-[--color-primary] hover:shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-[--color-primary]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-[--color-primary]">For Sponsors</h2>
          <p className="text-lg text-[--color-muted]">
            Reach your target audience with precision. Create campaigns, set budgets, and connect
            with the most relevant publishers in minutes through our platform.
          </p>
        </div>

        {/* Publisher Card */}
        <div className="group rounded-2xl border border-[--color-border] p-8 transition-all hover:border-[--color-secondary] hover:shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-[--color-secondary]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-[--color-secondary]">For Publishers</h2>
          <p className="text-lg text-[--color-muted]">
            Unlock the commercial value of your content. List your ad slots, maintain full control
            over pricing, and collaborate directly with sponsors who value your creativity.
          </p>
        </div>
      </section>

      {/* Trust Section */}
      <section className="w-full bg-gray-50 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[--color-muted]">
          Trusted by Innovative Brands & Creators
        </p>
      </section>
    </div>
  );
}
