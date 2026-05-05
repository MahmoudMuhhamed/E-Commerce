import Link from 'next/link';

export default function BrandNotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-bold text-gray-900">Brand not found</h1>
      <p className="text-gray-500 text-center max-w-md">
        We could not find a brand for this link. It may have been removed or the URL is incorrect.
      </p>
      <Link
        href="/brands"
        className="text-green-600 font-semibold hover:underline"
      >
        Back to all brands
      </Link>
    </div>
  );
}
