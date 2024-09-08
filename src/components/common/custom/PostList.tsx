import React, { useEffect, useState } from "react";
import axios from "axios";

interface Post {
  id: number;
  title: { rendered: string };
  yoast_head_json: {
    og_description: string;
    og_image: { url: string; width: number; height: number }[];
    canonical: string;
  };
}

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://swifthub.net/wp-json/wp/v2/posts?categories=106"
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div className="space-y-4 mt-4">
      <h1 className="text-2xl font-semibold text-gray-400">Bài viết</h1>
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex flex-col   items-center md:items-start space-y-4 md:space-y-0  border-b pb-6"
        >
          {/* Image on the left */}
          {post.yoast_head_json.og_image && (
            <div className="flex-shrink-0 w-full md:w-48">
              <a
                href={post.yoast_head_json.canonical}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                {" "}
                <img
                  src={post.yoast_head_json.og_image[0].url}
                  alt={post.title.rendered}
                  className="w-full h-auto rounded-lg"
                />
              </a>
            </div>
          )}
          {/* Title and Excerpt on the right */}
          <div className="flex-1">
            <h2 className="text-base font-semibold text-gray-800">
              {post.title.rendered}
            </h2>

            <a
              href={post.yoast_head_json.canonical}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-sm inline-block text-blue-600 hover:underline"
            >
              Read more
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsList;
