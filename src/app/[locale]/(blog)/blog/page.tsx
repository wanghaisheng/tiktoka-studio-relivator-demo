import { type Metadata } from "next";

// import Image from "next/image";
// import Link from "next-intl/link";
// import dayjs from "dayjs";

// import { formatDate } from "~/server/utils";
// import { env } from "~/data/env/env.mjs";
import { fullURL } from "~/data/meta/builder";
// import { Icons } from "~/islands/icons";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/islands/navigation/page-header";
// import { AspectRatio } from "~/islands/primitives/aspect-ratio";
import { Separator } from "~/islands/primitives/separator";
import { Shell } from "~/islands/wrappers/shell-variants";

export const metadata: Metadata = {
  metadataBase: fullURL(),
  title: "Blog",
  description: "Explore the latest news and updates from the community",
};

export default function BlogPage() {
  // const posts = allPosts
  //   .filter((post) => post.published)
  //   .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());

  return (
    <Shell className="md:pb-10">
      <PageHeader id="blog-header" aria-labelledby="blog-header-heading">
        <PageHeaderHeading>Blog</PageHeaderHeading>
        <PageHeaderDescription>
          Explore the latest news and updates from the community
        </PageHeaderDescription>
      </PageHeader>
      <Separator className="mb-2.5" />
      <section
        id="blog-posts"
        aria-labelledby="blog-posts-heading"
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {/* {posts.map((post, i) => (
          <Link key={post.slug} href={post.slug}>
            <article className="flex flex-col space-y-2.5">
              <AspectRatio ratio={16 / 9}>
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 384px, (min-width: 768px) 288px, (min-width: 640px) 224px, 100vw"
                    className="rounded-lg object-cover"
                    priority={i <= 1}
                  />
                ) : (
                  <div
                    aria-label="Placeholder"
                    role="img"
                    aria-roledescription="placeholder"
                    className="flex h-full w-full items-center justify-center rounded-lg bg-secondary"
                  >
                    <Icons.placeholder
                      className="h-9 w-9 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </AspectRatio>
              <h2 className="line-clamp-1 text-xl font-semibold">
                {post.title}
              </h2>
              <p className="line-clamp-2 text-muted-foreground">
                {post.description}
              </p>
              {post.date ? (
                <p className="text-sm text-muted-foreground">
                  {formatDate(post.date)}
                </p>
              ) : null}
            </article>
          </Link>
        ))} */}
      </section>
    </Shell>
  );
}
