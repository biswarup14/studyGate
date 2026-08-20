export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <div className="skeleton h-10 w-56 mx-auto mb-3" />
        <div className="skeleton h-5 w-72 mx-auto" />
      </div>
      <div className="skeleton h-96" />
    </div>
  );
}
