export default function AITools() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-md-primary">AI Tools</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <button className="p-6 rounded-lg shadow bg-md-primary/90 text-white font-medium hover:bg-md-primary">
          Generate Study Plan
        </button>
        <button className="p-6 rounded-lg shadow bg-md-tertiary/90 text-white font-medium hover:bg-md-tertiary">
          Create Quiz
        </button>
      </div>
    </div>
  );
}