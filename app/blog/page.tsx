import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { getAllPosts } from "../../lib/blog";
import { getServerT } from "../../lib/i18n-server";

export const metadata: Metadata = {
  title: "Blog",
  description: "Beauty tips, bridal prep guides, and glow rituals from Go & Glow.",
  alternates: {
    canonical: "/blog"
  }
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

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.slug} className="card-surface overflow-hidden">
            <div className="relative h-56 w-full">
              <Image src={post.cover} alt={post.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-peach-600">{post.date}</p>
              <h2 className="mt-2 font-serif text-2xl text-neutral-900">{post.title}</h2>
              <p className="mt-3 text-sm text-neutral-600">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex text-sm text-peach-600">
                {t("blog.readMore")}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
