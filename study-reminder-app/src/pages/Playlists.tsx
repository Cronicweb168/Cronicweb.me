export default function Playlists() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-md-primary">YouTube Playlists</h1>
      <div className="rounded-lg shadow bg-md-surface p-4">
        <h2 className="font-semibold text-md-primary mb-2">My Biology Playlist</h2>
        <div className="w-full h-2 rounded bg-md-outline/20 overflow-hidden">
          <div className="h-full bg-md-primary" style={{ width: '30%' }} />
        </div>
        <p className="text-xs text-md-secondary mt-1">3 / 10 videos watched</p>
      </div>
    </div>
  );
}