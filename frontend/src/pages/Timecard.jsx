// Timecard.jsx: Page for users to log and submit time worked
// Impact: Implements the Timecard page for weekly time entry and submission
import React, { useState } from 'react';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Timecard() {
    // State for time entries (hours per day)
    const [entries, setEntries] = useState(Array(7).fill(''));
    const [project, setProject] = useState('');
    const [task, setTask] = useState('');

    // Handle entry change
    const handleEntryChange = (idx, value) => {
        setEntries(entries.map((v, i) => (i === idx ? value : v)));
    };

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Send timecard data to backend API
        alert('Timecard submitted! (API call placeholder)');
    };

    return (
        <form className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4">Timecard</h2>
            <div className="mb-4">
                <label className="block font-medium mb-1">Project</label>
                <input className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" value={project} onChange={e => setProject(e.target.value)} required />
            </div>
            <div className="mb-4">
                <label className="block font-medium mb-1">Task</label>
                <input className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" value={task} onChange={e => setTask(e.target.value)} required />
            </div>
            <div className="mb-4">
                <label className="block font-medium mb-1">Enter hours for each day</label>
                <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map((day, idx) => (
                        <div key={day} className="flex flex-col items-center">
                            <span className="text-sm font-medium mb-1">{day}</span>
                            <input
                                type="number"
                                min="0"
                                max="24"
                                className="w-16 border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                                value={entries[idx]}
                                onChange={e => handleEntryChange(idx, e.target.value)}
                                required
                            />
                        </div>
                    ))}
                </div>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit Timecard</button>
        </form>
    );
}

export default Timecard;
