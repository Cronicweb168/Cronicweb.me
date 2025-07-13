import { FiBookOpen, FiEdit3 } from 'react-icons/fi';

export default function AITools() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-md-primary">AI Tools</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <button className="p-6 rounded-lg shadow bg-md-primary/90 text-white font-medium hover:bg-md-primary flex items-center gap-2">
          <FiBookOpen /> Study Plan
        </button>
        <button className="p-6 rounded-lg shadow bg-md-tertiary/90 text-white font-medium hover:bg-md-tertiary flex items-center gap-2">
          <FiEdit3 /> Quiz
        </button>
      </div>
    </div>
  );
}