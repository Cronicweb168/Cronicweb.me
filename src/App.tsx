import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Dashboard } from './pages/Dashboard';
import { YouTube } from './pages/YouTube';
import { StudyPlanner } from './pages/StudyPlanner';
import { Quizzes } from './pages/Quizzes';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/youtube" element={<YouTube />} />
          <Route path="/planner" element={<StudyPlanner />} />
          <Route path="/quizzes" element={<Quizzes />} />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'bg-md-sys-color-inverse-surface text-md-sys-color-inverse-on-surface',
            duration: 4000,
          }}
        />
      </div>
    </Router>
  );
}

export default App;