// ProjectSummaryAgent.jsx: AI-powered summary panel for project status
// Impact: Implements the Project Summary Agent page (placeholder for now)
import React, { useState } from 'react';

// Dummy project list (replace with API data later)
const projects = [
    { id: 1, title: 'Bridge Design for River X' },
    { id: 2, title: 'Highway Expansion Phase 2' },
];

function ProjectSummaryAgent() {
    const [selected, setSelected] = useState('');
    const [summary, setSummary] = useState('');

    // Placeholder for AI summary generation
    const handleGenerate = () => {
        // TODO: Call backend/AI API to generate summary
        setSummary('This is a placeholder summary for project status.');
    };

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">AI Project Summary Agent</h2>
            <div className="mb-4">
                <label className="block font-medium mb-1">Select Project</label>
                <select className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" value={selected} onChange={e => setSelected(e.target.value)}>
                    <option value="">-- Select --</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
            </div>
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
                onClick={handleGenerate}
                disabled={!selected}
            >
                Generate Summary
            </button>
            {summary && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
                    <strong>Summary:</strong>
                    <div>{summary}</div>
                </div>
            )}
        </div>
    );
}

export default ProjectSummaryAgent;
