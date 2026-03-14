import fs from "fs";
import path from "path";
import { deleteMedia } from "./actions";
import MediaCopyButton from "@/components/admin/MediaCopyButton";

export const metadata = { title: "Media Library" };

interface MediaFile {
  name: string;
  url: string;
  size: number;
  category: string;
  mtime: Date;
}

function getMediaFiles(): MediaFile[] {
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadsDir)) return [];

  const results: MediaFile[] = [];
  const cats = fs.readdirSync(uploadsDir);
  for (const cat of cats) {
    const catPath = path.join(uploadsDir, cat);
    if (!fs.statSync(catPath).isDirectory()) continue;
    for (const file of fs.readdirSync(catPath)) {
      const filePath = path.join(catPath, file);
      const stat = fs.statSync(filePath);
      results.push({
        name: file,
        url: `/uploads/${cat}/${file}`,
        size: stat.size,
        category: cat,
        mtime: stat.mtime,
      });
    }
  }
  return results.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allFiles = getMediaFiles();
  const categories = Array.from(new Set(allFiles.map((f) => f.category)));
  const files = category ? allFiles.filter((f) => f.category === category) : allFiles;

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Media Library</h1>
          <p className="text-sm text-gray-500 mt-1">
            {allFiles.length} file{allFiles.length !== 1 ? "s" : ""} · Upload images via Blog editor or Site Settings
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <a
          href="/admin/dashboard/media"
          className={`text-xs px-3 py-1.5 border transition-colors ${
            !category
              ? "bg-navy text-white border-navy"
              : "border-gray-300 text-gray-600 hover:border-navy hover:text-navy"
          }`}
        >
          All ({allFiles.length})
        </a>
        {categories.map((cat) => {
          const count = allFiles.filter((f) => f.category === cat).length;
          return (
            <a
              key={cat}
              href={`/admin/dashboard/media?category=${cat}`}
              className={`text-xs px-3 py-1.5 border transition-colors ${
                category === cat
                  ? "bg-navy text-white border-navy"
                  : "border-gray-300 text-gray-600 hover:border-navy hover:text-navy"
              }`}
            >
              {cat} ({count})
            </a>
          );
        })}
      </div>

      {files.length === 0 ? (
        <div className="bg-white border border-gray-200 p-16 text-center text-gray-400">
          <p className="text-lg font-medium mb-2">No files found</p>
          <p className="text-sm">Upload images via the Blog editor or Site Settings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {files.map((file) => (
            <div key={file.url} className="bg-white border border-gray-200 overflow-hidden">
              {/* Thumbnail */}
              <div className="aspect-square bg-gray-100 overflow-hidden relative">
                {isImage(file.name) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2">
                <p className="text-xs text-navy font-medium truncate" title={file.name}>
                  {file.name}
                </p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[10px] text-gray-400">{formatSize(file.size)}</span>
                  <span className="text-[10px] bg-gold/10 text-gold-dark px-1">{file.category}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-2 pb-2 flex gap-1">
                <MediaCopyButton url={file.url} />
                <form
                  action={async () => {
                    "use server";
                    await deleteMedia(file.url);
                  }}
                >
                  <button
                    type="submit"
                    className="text-xs px-2 py-1 border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
