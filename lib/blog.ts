import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

const BLOG_PATH = path.join(process.cwd(), "content", "blog");

export type BlogFrontmatter = {
  title: string;
  excerpt: string;
  date: string;
  cover: string;
  tags: string[];
};

export type BlogPost = BlogFrontmatter & {
  slug: string;
};

export async function getAllPosts(): Promise<BlogPost[]> {
  const files = await fs.readdir(BLOG_PATH);
  const posts = await Promise.all(
    files.filter((file) => file.endsWith(".mdx")).map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = await fs.readFile(path.join(BLOG_PATH, file), "utf8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        date: data.date,
        cover: data.cover,
        tags: data.tags || []
      } as BlogPost;
    })
  );

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostBySlug(slug: string) {
  const raw = await fs.readFile(path.join(BLOG_PATH, `${slug}.mdx`), "utf8");
  const { content, data } = matter(raw);

  const compiled = await compileMDX<{ title: string }>({
    source: content,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } }
  });

  return {
    frontmatter: {
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      cover: data.cover,
      tags: data.tags || []
    } as BlogFrontmatter,
    content: compiled.content
  };
}

