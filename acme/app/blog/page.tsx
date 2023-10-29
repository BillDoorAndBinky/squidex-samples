
import { useSquidexClient } from "@/client";
import { Post } from "@/model";
import { PostCard, H1 } from "@/components";

export default async function Page() {
  const response: any = await useSquidexClient().contents.getGraphQl({
    query: `
      query {
        queryPostsContents {
          id
          lastModified,
          data: flatData {
            text,
            title,
            teaserText,
            teaserImage {
              url
            },
            slug,
            author {
              id,
              data: flatData {
                name,
                avatar {
                  url
                }
              }
            }
          }
        }
      }
    `
  });

  const posts = (response.data.queryPostsContents as any[]).map(item => {
    const { data, id, lastModified } = item;
    const author = data.author[0];

    return {
      id,
      lastModified,
      author: { id: author.id, name: author.data.name, avatar: author.data.avatar[0].url },
      slug: data.slug,
      teaserImage: data.teaserImage[0].url,
      teaserText: data.teaserText,
      title: data.title,
    } as Post;
  });

  return (
    <div className="mt-4">
      <H1>News</H1>

      <div className="flex gap-x-4 gap-y-4 items-start">
        {posts.map(post =>
          <div className="w-1 md:w-1/3 lg:w-1/4" key={post.slug}>
            <PostCard post={post} />
          </div>
        )}
      </div>
    </div>
  );
}