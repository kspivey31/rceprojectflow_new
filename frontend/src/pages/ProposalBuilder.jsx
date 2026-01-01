// ProposalBuilder.jsx: Form to create a new proposal with phases, tasks, pricing, and comments
// Impact: Implements the Proposal Builder page for user input and proposal creation
import React, { useState } from 'react';
import axios from 'axios';

const initialPhase = { name: '', pricing: '', tasks: [''] };

function ProposalBuilder() {
    // State for the proposal form
    const [projectName, setProjectName] = useState('');
    const [department, setDepartment] = useState('');
    const [client, setClient] = useState('');
    const [phases, setPhases] = useState([{ ...initialPhase }]);
    const [comments, setComments] = useState('');

    // Handle phase changes
    const handlePhaseChange = (idx, field, value) => {
        setPhases((prev) =>
            prev.map((phase, i) =>
                i === idx ? { ...phase, [field]: value } : phase
            )
        );
    };

    // Handle task changes within a phase
    const handleTaskChange = (phaseIdx, taskIdx, value) => {
        setPhases((prev) =>
            prev.map((phase, i) =>
                i === phaseIdx
                    ? { ...phase, tasks: phase.tasks.map((t, j) => (j === taskIdx ? value : t)) }
                    : phase
            )
        );
    };

    // Add/remove phases and tasks
    const addPhase = () => setPhases([...phases, { ...initialPhase }]);
    const removePhase = (idx) => setPhases(phases.filter((_, i) => i !== idx));
    const addTask = (phaseIdx) => setPhases(phases.map((phase, i) => i === phaseIdx ? { ...phase, tasks: [...phase.tasks, ''] } : phase));
    const removeTask = (phaseIdx, taskIdx) => setPhases(phases.map((phase, i) => i === phaseIdx ? { ...phase, tasks: phase.tasks.filter((_, j) => j !== taskIdx) } : phase));

    // Handle form submission
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const handleSubmit = async (e) => {
        e.preventDefault();
        const proposal = {
            title: projectName,
            department,
            client,
            phases,
            comments,
            createdBy: 'You',
            qaStatus: 'Submitted QA1',
        };
        try {
            await axios.post(`${apiUrl}/api/proposals`, proposal);
            alert('Proposal saved!');
        } catch {
            alert('Failed to save proposal');
        }
    };

    return (
        <form className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4">Proposal Builder</h2>
            <div className="mb-4">
                <label className="block font-medium mb-1">Project Name</label>
                <input className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" value={projectName} onChange={e => setProjectName(e.target.value)} required />
            </div>
            <div className="mb-4">
                <label className="block font-medium mb-1">Department</label>
                <input className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" value={department} onChange={e => setDepartment(e.target.value)} required />
            </div>
            <div className="mb-4">
                <label className="block font-medium mb-1">Client</label>
                <input className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" value={client} onChange={e => setClient(e.target.value)} required />
            </div>
            <div className="mb-4">
                <label className="block font-medium mb-1">Phases</label>
                {phases.map((phase, idx) => (
                    <div key={idx} className="mb-4 border rounded p-3 bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center mb-2">
                            <input
                                className="flex-1 border rounded px-2 py-1 mr-2 dark:bg-gray-600 dark:text-white"
                                placeholder="Phase Name"
                                value={phase.name}
                                onChange={e => handlePhaseChange(idx, 'name', e.target.value)}
                                required
                            />
                            <input
                                className="w-32 border rounded px-2 py-1 mr-2 dark:bg-gray-600 dark:text-white"
                                placeholder="Pricing"
                                value={phase.pricing}
                                onChange={e => handlePhaseChange(idx, 'pricing', e.target.value)}
                                required
                            />
                            <button type="button" className="text-red-500" onClick={() => removePhase(idx)} title="Remove Phase">&times;</button>
                        </div>
                        <div className="ml-4">
                            <label className="block font-medium mb-1">Tasks</label>
                            {phase.tasks.map((task, tIdx) => (
                                <div key={tIdx} className="flex items-center mb-1">
                                    <input
                                        className="flex-1 border rounded px-2 py-1 dark:bg-gray-600 dark:text-white"
                                        placeholder="Task Name"
                                        value={task}
                                        onChange={e => handleTaskChange(idx, tIdx, e.target.value)}
                                        required
                                    />
                                    <button type="button" className="text-red-400 ml-2" onClick={() => removeTask(idx, tIdx)} title="Remove Task">&times;</button>
                                </div>
                            ))}
                            <button type="button" className="text-blue-600 mt-1" onClick={() => addTask(idx)}>+ Add Task</button>
                        </div>
                    </div>
                ))}
                <button type="button" className="text-blue-600 mt-2" onClick={addPhase}>+ Add Phase</button>
            </div>
            <div className="mb-4">
                <label className="block font-medium mb-1">Comments</label>
                <textarea className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" value={comments} onChange={e => setComments(e.target.value)} />
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Proposal</button>
        </form>
    );
}

export default ProposalBuilder;
