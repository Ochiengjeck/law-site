import { Prisma } from "@prisma/client";
import MediaCopyButton from "@/components/admin/MediaCopyButton";
import { prisma } from "@/lib/prisma";
import { deleteMedia } from "./actions";

export const metadata = { title: "Media Library" };

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);

function isMissingMediaTableError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021"
  );
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  let mediaTableMissing = false;
  let allFiles: Awaited<ReturnType<typeof prisma.media.findMany>> = [];

  try {
    allFiles = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    if (!isMissingMediaTableError(error)) throw error;
    mediaTableMissing = true;
  }

  const categories = Array.from(new Set(allFiles.map((f) => f.category)));
  const files = category ? allFiles.filter((f) => f.category === category) : allFiles;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Media Library</h1>
          <p className="mt-1 text-sm text-gray-500">
            {allFiles.length} file{allFiles.length !== 1 ? "s" : ""} · Upload images via Blog editor or Site Settings
          </p>
        </div>
      </div>

      {mediaTableMissing && (
        <div className="mb-6 border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Media uploads still work, but the Media table has not been created in the current database yet.
          Run <code className="font-mono">prisma db push</code> to enable the media library.
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <a
          href="/admin/dashboard/media"
          className={`border px-3 py-1.5 text-xs transition-colors ${
            !category
              ? "border-navy-dark bg-navy-dark text-white"
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
              className={`border px-3 py-1.5 text-xs transition-colors ${
                category === cat
                  ? "border-navy bg-navy text-white"
                  : "border-gray-300 text-gray-600 hover:border-navy hover:text-navy"
              }`}
            >
              {cat} ({count})
            </a>
          );
        })}
      </div>

      {files.length === 0 ? (
        <div className="border border-gray-200 bg-white p-16 text-center text-gray-400">
          <p className="mb-2 text-lg font-medium">No files found</p>
          <p className="text-sm">
            {mediaTableMissing
              ? "Initialize the Media table to browse uploaded files here."
              : "Upload images via the Blog editor or Site Settings."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {files.map((file) => (
            <div key={file.id} className="overflow-hidden border border-gray-200 bg-white">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {isImage(file.filename) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-2">
                <p className="truncate text-xs font-medium text-navy" title={file.filename}>
                  {file.filename}
                </p>
                <div className="mt-0.5 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">{formatSize(file.size)}</span>
                  <span className="bg-gold/10 px-1 text-[10px] text-gold-dark">{file.category}</span>
                </div>
              </div>

              <div className="flex gap-1 px-2 pb-2">
                <MediaCopyButton url={file.url} />
                <form
                  action={async () => {
                    "use server";
                    await deleteMedia(file.id);
                  }}
                >
                  <button
                    type="submit"
                    className="border border-red-300 px-2 py-1 text-xs text-red-500 transition-colors hover:bg-red-500 hover:text-white"
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
