import type { Metadata } from "next";
import Image from "next/image";

import { getAllPosts, getPostBySlug } from "../../../lib/blog";
import { getServerT } from "../../../lib/i18n-server";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { frontmatter, content } = await getPostBySlug(params.slug);
  const t = await getServerT();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-peach-600">{t("blog.post.kicker")}</p>
      <h1 className="mt-4 font-serif text-4xl text-neutral-900 md:text-5xl">{frontmatter.title}</h1>
      <p className="mt-3 text-sm text-neutral-500">{frontmatter.date}</p>
      <div className="mt-8">
        <Image
          src={frontmatter.cover}
          alt={frontmatter.title}
          width={960}
          height={560}
          className="h-72 w-full rounded-3xl object-cover shadow-card"
        />
      </div>
      <div className="prose prose-lg mt-10 max-w-none text-neutral-700">
        {content}
      </div>
    </article>
  );
}
