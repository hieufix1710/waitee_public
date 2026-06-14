'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-md px-4">
        <h1 className="text-2xl font-black text-zinc-900 mb-4">Có lỗi xảy ra</h1>
        <p className="text-zinc-500 mb-8">{error.message || 'Đã xảy ra lỗi không mong muốn.'}</p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          Thử lại
        </button>
      </div>
    </main>
  );
}
