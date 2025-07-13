import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Reminders from './pages/Reminders';
import Playlists from './pages/Playlists';
import AITools from './pages/AITools';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/ai-tools" element={<AITools />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
