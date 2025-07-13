export default function Reminders() {
  return (
    <div className="relative space-y-4">
      <h1 className="text-3xl font-bold text-md-primary">Reminders</h1>
      <ul className="space-y-2">
        {[
          { id: 1, title: 'Read Chapter 3', time: 'Today · 6:00 PM' },
          { id: 2, title: 'Watch Photosynthesis video', time: 'Tomorrow · 10:00 AM' },
        ].map((r) => (
          <li key={r.id} className="p-4 rounded-lg shadow bg-md-surface flex items-center justify-between">
            <div>
              <h3 className="font-medium text-md-primary">{r.title}</h3>
              <p className="text-xs text-md-secondary">{r.time}</p>
            </div>
            <button className="text-sm text-md-primary hover:underline">Done</button>
          </li>
        ))}
      </ul>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-6 right-6 md:right-10 md:bottom-10 w-14 h-14 rounded-full bg-md-primary text-white shadow-lg hover:shadow-xl transition flex items-center justify-center text-3xl"
        aria-label="Add reminder"
      >
        +
      </button>
    </div>
  );
}