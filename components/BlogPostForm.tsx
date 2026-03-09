"use client";

import { useActionState } from "react";
import type { BlogPost } from "@prisma/client";
import { createPost, updatePost } from "@/app/admin/dashboard/blog/actions";
import ImageUpload from "@/components/admin/ImageUpload";
import SubmitButton from "@/components/admin/SubmitButton";

type State = { error: string | null };

interface Props {
  post?: BlogPost;
}

export default function BlogPostForm({ post }: Props) {
  const action = post ? updatePost.bind(null, post.id) : createPost;
  const [state, formAction] = useActionState<State, FormData>(
    action,
    { error: null }
  );

  return (
    <form action={formAction} className="space-y-5 max-w-3xl">
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          required
          defaultValue={post?.title ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy"
          placeholder="Post title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Excerpt
          <span className="text-gray-400 font-normal ml-1">(short summary)</span>
        </label>
        <input
          type="text"
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy"
          placeholder="A brief summary shown on the blog list"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          required
          rows={16}
          defaultValue={post?.content ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy resize-y font-mono"
          placeholder="Write your post content here…"
        />
      </div>

      <div>
        <ImageUpload
          name="imageUrl"
          category="blog"
          defaultValue={post?.imageUrl ?? ""}
          label="Cover Image"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Author <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="author"
          required
          defaultValue={post?.author ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-navy"
          placeholder="e.g. Faith Sulwe"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="published"
          id="published"
          value="true"
          defaultChecked={post?.published ?? false}
          className="w-4 h-4 accent-navy"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">
          Publish immediately
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <SubmitButton label={post ? "Update Post" : "Create Post"} />
        <a
          href="/admin/dashboard/blog"
          className="px-6 py-2 rounded border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
