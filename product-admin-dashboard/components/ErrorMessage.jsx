export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p className="mb-3 text-red-700">{message || "Something went wrong."}</p>
      <button onClick={onRetry} className="rounded bg-red-600 px-4 py-2 text-white">Retry</button>
    </div>
  );
}
