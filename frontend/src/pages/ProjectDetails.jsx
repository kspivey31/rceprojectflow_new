// ProjectDetails.jsx: Dashboard for a single project with tabbed panels
// Impact: Implements the Project Details page with tabs for Overview, Tasks, Billing, etc.
import React, { useState } from 'react';
import axios from 'axios';

const tabs = [
    'Overview',
    'Tasks',
    'Billing Summary',
    'Submittals',
    'Deliverables',
    'Messaging',
    'Documents',
];

    // State for active tab
    const [activeTab, setActiveTab] = useState('Overview');
    const [editMode, setEditMode] = useState(false);
    const [project, setProject] = useState({
        id: 1,
        title: 'Project Title',
        department: 'Structural',
        client: 'Client Name',
        status: 'Active',
    });
    const [form, setForm] = useState({ ...project });
    const apiUrl = import.meta.env.VITE_API_URL || '';

    const handleEdit = () => {
        setForm({ ...project });
        setEditMode(true);
    };
    const handleSave = async () => {
        try {
            await axios.put(`${apiUrl}/api/projects/${project.id}`, form);
            setProject({ ...project, ...form });
            setEditMode(false);
        } catch {
            alert('Failed to update project');
        }
    };
    const handleDelete = async () => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await axios.delete(`${apiUrl}/api/projects/${project.id}`);
            alert('Project deleted');
        } catch {
            alert('Failed to delete project');
        }
    };

    // Placeholder panel content for each tab
    const renderPanel = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div>
                        {editMode ? (
                            <div className="space-y-2">
                                <input className="border rounded px-2 py-1 w-full" name="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                <input className="border rounded px-2 py-1 w-full" name="client" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} />
                                <input className="border rounded px-2 py-1 w-full" name="department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
                                <input className="border rounded px-2 py-1 w-full" name="status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} />
                                <div className="flex space-x-2 mt-2">
                                    <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleSave}>Save</button>
                                    <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setEditMode(false)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="font-semibold text-lg">{project.title}</div>
                                <div className="text-sm text-gray-500">Client: {project.client}</div>
                                <div className="text-sm text-gray-500">Department: {project.department}</div>
                                <div className="text-sm text-gray-500">Status: {project.status}</div>
                                <div className="flex space-x-2 mt-2">
                                    <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={handleEdit}>Edit</button>
                                    <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={handleDelete}>Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            // ...existing code...
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Project Details</h2>
            <div className="flex space-x-2 mb-4 border-b dark:border-gray-700">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        className={`px-4 py-2 font-medium border-b-2 transition-colors duration-150 ${activeTab === tab ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-600 dark:text-gray-300'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="mt-4">
                {renderPanel()}
            </div>
        </div>
    );
}

export default ProjectDetails;
