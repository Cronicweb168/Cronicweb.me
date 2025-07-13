import './index.css';

function App() {
  return (
    <div className="p-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-md-primary">Study Reminder App</h1>
        <p className="text-md-secondary">Your AI-powered planner & study buddy 🎓</p>
      </header>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 rounded-lg shadow bg-md-surface">
          <h2 className="font-semibold text-md-primary mb-2">Reminders</h2>
          <p className="text-sm text-md-secondary">Add and manage study sessions.</p>
        </div>
        <div className="p-4 rounded-lg shadow bg-md-surface">
          <h2 className="font-semibold text-md-primary mb-2">YouTube Playlist</h2>
          <p className="text-sm text-md-secondary">Track your learning progress.</p>
        </div>
        <div className="p-4 rounded-lg shadow bg-md-surface">
          <h2 className="font-semibold text-md-primary mb-2">AI Tools</h2>
          <p className="text-sm text-md-secondary">Generate plans & quizzes with Gemini.</p>
        </div>
      </section>
    </div>
  );
}

export default App;
