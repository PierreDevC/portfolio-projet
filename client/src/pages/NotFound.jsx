export default function NotFound() {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
        <h1 className="text-6xl font-extrabold text-violet-600 dark:text-violet-400">404</h1>
        <p className="text-gray-600 dark:text-gray-400">Page introuvable</p>
        <a href="/" className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
          Retour à l'accueil
        </a>
      </main>
    )
  }