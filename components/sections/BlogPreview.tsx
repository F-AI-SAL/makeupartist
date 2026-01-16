import Image from "next/image";
import Link from "next/link";

import { getAllPosts } from "../../lib/blog";
import { getServerT } from "../../lib/i18n-server";
import { Button } from "../ui/button";

export default async function BlogPreview() {
  const t = await getServerT();
  const posts = (await getAllPosts()).slice(0, 3);

  return (
    <section className="mx-auto mt-20 max-w-6xl px-4 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="section-title">{t("home.blog.title")}</h2>
          <p className="section-subtitle">{t("home.blog.subtitle")}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/blog">{t("home.blog.cta")}</Link>
        </Button>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
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
            <h3 className="mt-2 font-serif text-lg text-neutral-900">{post.title}</h3>
            <p className="mt-2 text-sm text-neutral-600">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="mt-3 inline-flex text-sm text-peach-600">
              {t("home.blog.readMore")}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

