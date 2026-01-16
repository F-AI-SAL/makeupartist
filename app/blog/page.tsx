import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getAllPosts } from "../../lib/blog";
import { getServerT } from "../../lib/i18n-server";

export const metadata: Metadata = {
  title: "Blog",
  description: "Go & Glow এর বিউটি টিপস, স্কিনকেয়ার গাইড এবং ব্রাইডাল ইনসাইট।"
};

export default async function BlogPage() {
  const t = await getServerT();
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-peach-600">{t("blog.kicker")}</p>
        <h1 className="mt-4 font-serif text-4xl text-neutral-900 md:text-5xl">{t("blog.title")}</h1>
        <p className="mt-4 text-base text-neutral-600 md:text-lg">{t("blog.subtitle")}</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-2xl bg-white/80 p-4 shadow-card">
            <Image
              src={post.cover}
              alt={post.title}
              width={360}
              height={240}
              className="h-40 w-full rounded-xl object-cover"
            />
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-peach-500">{post.date}</p>
            <h2 className="mt-2 font-serif text-lg text-neutral-900">{post.title}</h2>
            <p className="mt-2 text-sm text-neutral-600">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="mt-3 inline-flex text-sm text-peach-600">
              {t("blog.readMore")}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}