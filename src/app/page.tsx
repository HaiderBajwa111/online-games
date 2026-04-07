import GameGrid from "@/components/GameGrid";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2 text-cyan-700">Poki – Play Online Games for Free</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Play the best free online games without downloading. Enjoy thousands of games in action, puzzle, racing, adventure, and more. New games added regularly!
        </p>
      </section>
      <section>
        <GameGrid />
      </section>
      <section className="mt-12 max-w-3xl mx-auto text-center text-gray-600">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-600">Why Play on Poki?</h2>
        <ul className="list-disc list-inside text-left mx-auto max-w-xl">
          <li>Free access to all games, no download required</li>
          <li>Games for all ages and categories</li>
          <li>Safe, secure, and user-friendly platform</li>
          <li>Regular updates with new games</li>
          <li>Play on desktop, tablet, or mobile</li>
        </ul>
      </section>
    </div>
  );
}
