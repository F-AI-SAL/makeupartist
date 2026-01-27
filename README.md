# Go & Glow - Beauty Parlor Website

Premium, conversion-focused beauty parlor site for Mirpur-2, Dhaka built with Next.js 14, Tailwind, shadcn/ui, Framer Motion, i18next, and MDX.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## SEO + marketing setup

- `NEXT_PUBLIC_SITE_URL` in `.env.local` for canonical URLs and sitemap.
- `PIXEL_ID` in `.env.local` to enable Facebook Meta Pixel.
- JSON-LD is injected for LocalBusiness, Service, and FAQ.

## Admin panel

- URL: `/admin`
- Password: set `ADMIN_PASSWORD` in `.env.local` (see `.env.example`)
- Admin tools: update site settings, service menu JSON, offers, services, and uploads.

## Scripts

```bash
npm run lint
npm run format
npm run test
npm run build
npm run start
```

## Edit services/pricing/testimonials/offers

- Services list: `public/locales/bn/common.json`, `public/locales/en/common.json` -> `services.*`
- Pricing tiers: `public/locales/bn/common.json`, `public/locales/en/common.json` -> `pricing.tiers`
- Testimonials: `public/locales/bn/common.json`, `public/locales/en/common.json` -> `home.testimonials.items`
- Offers data: `data/offers.json`
- Service menu data: `data/service-menu.json`
- Site settings: `data/site.json` (phone, address, socials, pixel ID)

## Add blog posts (MDX)

1. Create a new file in `content/blog/` with `.mdx` extension.
2. Add frontmatter: `title`, `excerpt`, `date`, `cover`, `tags`.
3. Add a cover image in `public/images/blog/` and point to it in `cover`.

## Theme switch (one file change)

- Update `lib/theme-config.ts` -> `themeConfig.activeTheme`
- Available: `peach`, `pearl`

## Create a new campaign in 2 minutes

1. Add UTM links to your ads: `https://yourdomain.com/offers?utm_source=facebook&utm_medium=cpc&utm_campaign=weekly_glow`.
2. Update `data/offers.json` with new title, discount, start/end dates.
3. Visit `/offers` to confirm the landing list and `/offer/[slug]` for the detail page.
4. Leads will store UTM data automatically in `data/bookings.json` and `data/contacts.json`.

## Deployment (Vercel)

1. Push the repo to GitHub.
2. Import in Vercel.
3. Add `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`, `PIXEL_ID`, and `POSTGRES_URL` in Vercel Environment Variables.
4. Optional microservices: set `BOOKING_SERVICE_URL` and `CMS_SERVICE_URL`.
4. Deploy.

## Checklist before go-live

- Update phone/address in `lib/site.ts` if needed.
- Replace placeholder SVGs in `public/images/` with real images.
- Review Bangla/English copy in `public/locales/`.
- Verify booking/contact API writes are acceptable for production.
- Run `npm run lint` and `npm run test`.
- Confirm sitemap and metadata on production URL.

## Database (Vercel Postgres)

1. In Vercel, create a Postgres database and connect it to this project.
2. Copy the `POSTGRES_URL` connection string to your environment variables.
3. Deploy once so tables auto-create, or run the SQL in `db/schema.sql`.
4. Bookings/contacts will now persist in Postgres.

## Microservices (Railway)

This repo includes two backend services you can deploy separately so the website stays up even if one service fails.

- Booking Service: `/services/booking`
- CMS Service: `/services/cms`

### Deploy steps

1. Create two Railway projects (one for booking, one for CMS).
2. Add env vars: `POSTGRES_URL`, `ADMIN_PASSWORD` (CMS), `PORT`.
3. Set the service start command:
   - Booking: `npm install && npm run start`
   - CMS: `npm install && npm run start`
4. Copy the public Railway URLs and set in Vercel:
   - `BOOKING_SERVICE_URL=https://your-booking-service`
   - `CMS_SERVICE_URL=https://your-cms-service`

When these URLs are set, Next.js API routes proxy to the services automatically.
