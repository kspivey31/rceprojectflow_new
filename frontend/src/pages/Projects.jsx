// Projects.jsx: Lists all projects in card view with search and filters
// Impact: Implements the Projects page with filtering and action buttons
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditProjectModal({ project, onSave, onClose }) {
    const [form, setForm] = useState({ ...project });
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = e => {
        e.preventDefault();
        onSave(form);
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96" onSubmit={handleSubmit}>
                <h3 className="text-lg font-bold mb-4">Edit Project</h3>
                <input name="title" value={form.title} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1" placeholder="Title" />
                <input name="client" value={form.client} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1" placeholder="Client" />
                <input name="department" value={form.department} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1" placeholder="Department" />
                <input name="status" value={form.status} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1" placeholder="Status" />
                <div className="flex justify-end space-x-2 mt-4">
                    <button type="button" className="px-3 py-1 bg-gray-400 text-white rounded" onClick={onClose}>Cancel</button>
                    <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                </div>
            </form>
        </div>
    );
}

function CreateProjectModal({ onSave, onClose }) {
    const [form, setForm] = useState({
        projectNumber: '',
        title: '',
        department: '',
        client: '',
        phases: [],
        pricing: {},
        tasks: [],
        status: 'Active',
    });
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = e => {
        e.preventDefault();
        onSave(form);
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96" onSubmit={handleSubmit}>
                <h3 className="text-lg font-bold mb-4">Create Project</h3>
                <input name="projectNumber" value={form.projectNumber} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1" placeholder="Project Number" required />
                <input name="title" value={form.title} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1" placeholder="Title" required />
                <input name="client" value={form.client} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1" placeholder="Client" required />
                <input name="department" value={form.department} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1" placeholder="Department" required />
                <input name="status" value={form.status} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1" placeholder="Status" />
                <div className="flex justify-end space-x-2 mt-4">
                    <button type="button" className="px-3 py-1 bg-gray-400 text-white rounded" onClick={onClose}>Cancel</button>
                    <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Create</button>
                </div>
            </form>
        </div>
    );
}

function Projects() {
    // State for projects and filters
    const [projects, setProjects] = useState([]);
    const [editProject, setEditProject] = useState(null);
    const [createModal, setCreateModal] = useState(false);
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

    const apiUrl = import.meta.env.VITE_API_URL || '';

    // Edit project handler
    const handleEdit = (project) => setEditProject(project);
    const handleSaveEdit = async (updated) => {
        try {
            await axios.put(`${apiUrl}/api/projects/${updated.id}`, updated);
            setProjects(projects.map(p => p.id === updated.id ? { ...p, ...updated } : p));
            setEditProject(null);
        } catch (err) {
            alert('Failed to update project');
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await axios.delete(`${apiUrl}/api/projects/${id}`);
            setProjects(projects.filter(p => p.id !== id));
        } catch (err) {
            alert('Failed to delete project');
        }
    };

    const handleCreateProject = async (newProject) => {
        try {
            const response = await axios.post(`${apiUrl}/api/projects`, newProject);
            setProjects([response.data, ...projects]);
            setCreateModal(false);
        } catch (err) {
            alert('Failed to create project');
        }
    };

    return (
        <div>
            {loading && <div className="text-center text-gray-500">Loading projects...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}
            <div className="flex flex-col md:flex-row md:items-end md:space-x-4 mb-6">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-2 md:mb-0" onClick={() => setCreateModal(true)}>+ Create Project</button>
                {/* ...existing code... */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(project => (
                    <div key={project.id} className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col space-y-2">
                        <div className="font-semibold text-lg">{project.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">Client: {project.client}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">Department: {project.department}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">Status: {project.status}</div>
                        <div className="flex space-x-2 mt-2">
                            <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">View Details</button>
                            <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Messaging</button>
                            <button className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">Documents</button>
                            <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600" onClick={() => handleEdit(project)}>Edit</button>
                            <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => handleDelete(project.id)}>Delete</button>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <div className="col-span-full text-center text-gray-500">No projects found.</div>}
            </div>
            {editProject && <EditProjectModal project={editProject} onSave={handleSaveEdit} onClose={() => setEditProject(null)} />}
            {createModal && <CreateProjectModal onSave={handleCreateProject} onClose={() => setCreateModal(false)} />}
        </div>
    );
}

export default Projects;
