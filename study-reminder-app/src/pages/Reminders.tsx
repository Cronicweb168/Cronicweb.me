export default function Reminders() {
  return (
    <div className="relative space-y-4">
      <h1 className="text-3xl font-bold text-md-primary">Reminders</h1>
      <ul className="space-y-2">
        <li className="p-3 rounded-lg shadow bg-md-surface flex justify-between">
          <span className="text-md-secondary">No reminders yet.</span>
        </li>
      </ul>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-6 right-6 md:right-10 md:bottom-10 w-14 h-14 rounded-full bg-md-primary text-white shadow-lg hover:shadow-xl transition"
        aria-label="Add reminder"
      >
        +
      </button>
    </div>
  );
}