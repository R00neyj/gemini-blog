export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
        <span className="text-gray-400 text-sm animate-pulse">Loading...</span>
      </div>
    </div>
  );
}
