import { ErrorCard } from "~/islands/modules/cards/error-card";
import { Shell } from "~/islands/wrappers/shell-variants";

export default function BlogNotFound() {
  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Post not found"
        description="The post you are looking for does not exist"
        retryLink="/blog"
        retryLinkText="Go to Blog"
      />
    </Shell>
  );
}
