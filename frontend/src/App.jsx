// App.jsx: Main layout for the web portal
// Impact: Sets up persistent sidebar, top header, and main content area for all pages
// This is the foundation for navigation and layout
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
// Import the Proposals page component
import Proposals from './pages/Proposals.jsx';
import ProposalBuilder from './pages/ProposalBuilder.jsx';

// Placeholder components for each page, with comments for beginners
function Home() {
  // Home page placeholder
  return <div className="text-gray-800 dark:text-gray-100">Welcome to the RCE ProjectFlow Portal!</div>;
}
function Projects() {
  // Projects page placeholder
  return <div className="text-gray-800 dark:text-gray-100">Projects Page (to be built)</div>;
}
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
            <NavLink to="/proposals" className={({ isActive }) => `block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''}`}>Proposals</NavLink>
            <NavLink to="/proposal-builder" className={({ isActive }) => `block py-2 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''}`}>Proposal Builder</NavLink>
            {/* Add more links for Team Capacity, Timecard, Gantt, Messaging, Project Summary Agent as you build them */}
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
              {/* Use the new Proposals page component for /proposals */}
              <Route path="/proposals" element={<Proposals />} />
              {/* Use the new ProposalBuilder page component for /proposal-builder */}
              <Route path="/proposal-builder" element={<ProposalBuilder />} />
              {/* Add more routes for other pages as you build them */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
