import { z } from "zod";
import fetch from "node-fetch";
import type { ToolFn } from "../../types";

export const redditToolDefinition = {
  name: "reddit_post",
  parameters: z.object({
    subreddit: z
      .string()
      .describe(
        'The name of the subreddit to fetch the top post from, e.g., "javascript"'
      ),
  }),
  description: "Get the top post from a specified subreddit",
};

type Args = z.infer<typeof redditToolDefinition.parameters>;

export const redditPost: ToolFn<Args, string> = async ({ toolArgs }) => {
  const { data } = await fetch(
    `https://www.reddit.com/r/${toolArgs.subreddit}/top.json`
  ).then((res) => res.json());

  const relevantInfo = data.children.map((child: any) => ({
    title: child.data.title,
    link: child.data.url,
    subreddit: child.data.subreddit_name_prefixed,
    author: child.data.author,
    upvotes: child.data.ups,
  }));

  return JSON.stringify(relevantInfo, null, 2);
};
