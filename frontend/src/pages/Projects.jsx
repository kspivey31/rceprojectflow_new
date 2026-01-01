// Projects.jsx: Lists all projects in card view with search and filters
// Impact: Implements the Projects page with filtering and action buttons
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Projects() {
    // State for projects and filters
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState('');
    const [department, setDepartment] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch projects from backend API
        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError(null);
                const apiUrl = import.meta.env.VITE_API_URL || '';
                const response = await axios.get(`${apiUrl}/api/projects`);
                setProjects(response.data);
            } catch (err) {
                setError('Failed to load projects');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Filtered projects
    const filtered = projects.filter(p =>
        (!search || p.title.toLowerCase().includes(search.toLowerCase())) &&
        (!department || p.department === department) &&
        (!status || p.status === status)
    );

    return (
        <div>
            {loading && <div className="text-center text-gray-500">Loading projects...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}
            <div className="flex flex-col md:flex-row md:items-end md:space-x-4 mb-6">
                <div className="flex-1 mb-2 md:mb-0">
                    <label className="block font-medium mb-1">Search</label>
                    <input className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" value={search} onChange={e => setSearch(e.target.value)} placeholder="Project title..." />
                </div>
                <div className="mb-2 md:mb-0">
                    <label className="block font-medium mb-1">Department</label>
                    <select className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" value={department} onChange={e => setDepartment(e.target.value)}>
                        <option value="">All</option>
                        <option value="Structural">Structural</option>
                        <option value="Transportation">Transportation</option>
                    </select>
                </div>
                <div>
                    <label className="block font-medium mb-1">Status</label>
                    <select className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="Active">Active</option>
                        <option value="Planning">Planning</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(project => (
                    <div key={project.id} className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col space-y-2">
                        <div className="font-semibold text-lg">{project.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">Client: {project.client}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">Department: {project.department}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">Status: {project.status}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">Budget: ${project.budget.toLocaleString()} / Cost: ${project.cost.toLocaleString()}</div>
                        <div className="flex space-x-2 mt-2">
                            <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">View Details</button>
                            <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Messaging</button>
                            <button className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">Documents</button>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <div className="col-span-full text-center text-gray-500">No projects found.</div>}
            </div>
        </div>
    );
}

export default Projects;
