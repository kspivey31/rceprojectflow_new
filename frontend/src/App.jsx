import ProjectSummaryAgent from './pages/ProjectSummaryAgent.jsx';
import TeamCapacity from './pages/TeamCapacity.jsx';
import Timecard from './pages/Timecard.jsx';
import Messaging from './pages/Messaging.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';
import Gantt from './pages/Gantt.jsx';
// App.jsx: Main layout for the web portal
// Impact: Sets up persistent sidebar, top header, and main content area for all pages
// This is the foundation for navigation and layout
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
// Import the Proposals page component
import Proposals from './pages/Proposals.jsx';
import ProposalBuilder from './pages/ProposalBuilder.jsx';
import Projects from './pages/Projects.jsx';

// Placeholder components for each page, with comments for beginners
function Home() {
  // Home page placeholder
  return <div className="text-gray-800 dark:text-gray-100">Welcome to the RCE ProjectFlow Portal!</div>;
}
// Projects page is now imported from src/pages/Projects.jsx
// ProposalBuilder page is now imported from src/pages/ProposalBuilder.jsx

function App() {
  // Main layout with sidebar, header, and routed content
  return (
    <Router>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar navigation - always visible on the left */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow flex flex-col">
          <div className="h-16 flex items-center justify-center font-bold text-xl border-b dark:border-gray-700">
            RCE ProjectFlow
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {/* NavLink provides active styling for navigation */}
            <NavLink to="/" end className={({ isActive }) => `block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''}`}>Home</NavLink>
            <NavLink to="/projects" className={({ isActive }) => `block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''}`}>Projects</NavLink>
            <NavLink to="/team-capacity" className={({ isActive }) => `block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''}`}>Team Capacity</NavLink>
            <NavLink to="/proposals" className={({ isActive }) => `block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''}`}>Proposals</NavLink>
            <NavLink to="/proposal-builder" className={({ isActive }) => `block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''}`}>Proposal Builder</NavLink>
            <NavLink to="/timecard" className={({ isActive }) => `block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''}`}>Timecard</NavLink>
            <NavLink to="/messaging" className={({ isActive }) => `block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''}`}>Messaging</NavLink>
            <NavLink to="/gantt" className={({ isActive }) => `block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''}`}>Gantt</NavLink>
            <NavLink to="/project-summary-agent" className={({ isActive }) => `block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''}`}>Project Summary Agent</NavLink>
            {/* Add more links for Project Summary Agent as you build them */}
          </nav>
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Top header */}
          <header className="h-16 bg-white dark:bg-gray-800 shadow flex items-center px-6 border-b dark:border-gray-700">
            {/* TODO: Add breadcrumbs, theme toggle, user menu, etc. */}
            <span className="font-semibold text-lg">Dashboard</span>
          </header>

          {/* Main page content rendered by React Router */}
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/team-capacity" element={<TeamCapacity />} />
              <Route path="/proposals" element={<Proposals />} />
              <Route path="/proposal-builder" element={<ProposalBuilder />} />
              <Route path="/timecard" element={<Timecard />} />
              <Route path="/messaging" element={<Messaging />} />
              <Route path="/gantt" element={<Gantt />} />
              {/* Add more routes for Project Summary Agent as you build it */}
              <Route path="/project-summary-agent" element={<ProjectSummaryAgent />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
