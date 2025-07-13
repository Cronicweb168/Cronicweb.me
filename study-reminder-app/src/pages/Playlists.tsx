export default function Playlists() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-md-primary">YouTube Playlists</h1>
      {[
        { id: 1, title: 'Biology Basics', watched: 3, total: 10 },
        { id: 2, title: 'Chemistry Crash Course', watched: 5, total: 8 },
      ].map((pl) => {
        const pct = Math.round((pl.watched / pl.total) * 100);
        return (
          <div key={pl.id} className="rounded-lg shadow bg-md-surface p-4 space-y-1">
            <h2 className="font-semibold text-md-primary">{pl.title}</h2>
            <div className="w-full h-2 rounded bg-md-outline/20 overflow-hidden">
              <div className="h-full bg-md-primary" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-md-secondary">{pl.watched} / {pl.total} videos watched · {pct}%</p>
          </div>
        );
      })}
    </div>
  );
}