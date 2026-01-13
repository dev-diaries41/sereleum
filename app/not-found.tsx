// app/not-found.tsx

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="text-xl opacity-80">Page not found</p>
        <a
          href="/"
          className="inline-block mt-6 px-6 py-3 rounded-md border border-current hover:opacity-80 transition"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
