import { MdOutlineSchedule, MdPlayCircleOutline, MdLightbulbOutline } from 'react-icons/md';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-md-primary">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 rounded-lg shadow bg-md-surface flex items-start gap-3">
          <MdOutlineSchedule size={32} className="text-md-primary" />
          <div>
            <h2 className="font-semibold text-md-primary">Today’s Reminders</h2>
            <p className="text-sm text-md-secondary">0 tasks due</p>
          </div>
        </div>
        <div className="p-4 rounded-lg shadow bg-md-surface flex items-start gap-3">
          <MdPlayCircleOutline size={32} className="text-md-primary" />
          <div>
            <h2 className="font-semibold text-md-primary">YouTube Progress</h2>
            <p className="text-sm text-md-secondary">Watch 5 videos to reach next milestone</p>
          </div>
        </div>
        <div className="p-4 rounded-lg shadow bg-md-surface flex items-start gap-3">
          <MdLightbulbOutline size={32} className="text-md-primary" />
          <div>
            <h2 className="font-semibold text-md-primary">AI Suggestions</h2>
            <p className="text-sm text-md-secondary">Generate a new study plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}