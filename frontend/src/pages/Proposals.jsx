// Proposals.jsx: Lists all proposals in card format with QA workflow
// Impact: Implements the Proposals page with card view, QA status dropdown, and create proposal button
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const qaOptions = [
    'Submitted QA1',
    'Submitted QA2',
    'QA Completed',
];

const qaOptions = [
    'Submitted QA1',
    'Submitted QA2',
    'QA Completed',
];

function EditProposalModal({ proposal, onSave, onClose }) {
    const [form, setForm] = useState({ ...proposal });
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
                <h3 className="text-lg font-bold mb-4">Edit Proposal</h3>
                <input name="title" value={form.title} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1" placeholder="Title" />
                <input name="client" value={form.client} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1" placeholder="Client" />
                <input name="department" value={form.department} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1" placeholder="Department" />
                <input name="createdBy" value={form.createdBy} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1" placeholder="Created By" />
                <input name="qaStatus" value={form.qaStatus} onChange={handleChange} className="w-full mb-2 border rounded px-2 py-1" placeholder="QA Status" />
                <div className="flex justify-end space-x-2 mt-4">
                    <button type="button" className="px-3 py-1 bg-gray-400 text-white rounded" onClick={onClose}>Cancel</button>
                    <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                </div>
            </form>
        </div>
    );
}

function Proposals() {
    const [proposals, setProposals] = useState([]);
    const [editProposal, setEditProposal] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL || '';
    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/proposals`);
                setProposals(response.data);
            } catch {
                setProposals([]);
            }
        };
        fetchProposals();
    }, []);

    const handleQAStatusChange = async (id, newStatus) => {
        try {
            await axios.patch(`${apiUrl}/api/proposals/${id}/qa`, { qaStatus: newStatus });
            setProposals(proposals.map(p => p.id === id ? { ...p, qaStatus: newStatus } : p));
        } catch {
            alert('Failed to update QA status');
        }
    };

    const handleCreateProposal = async () => {
        const newProposal = {
            title: 'New Proposal',
            department: 'TBD',
            client: 'TBD',
            createdBy: 'You',
            qaStatus: 'Submitted QA1',
        };
        try {
            const response = await axios.post(`${apiUrl}/api/proposals`, newProposal);
            setProposals([response.data, ...proposals]);
        } catch {
            alert('Failed to create proposal');
        }
    };

    const handleEdit = (proposal) => setEditProposal(proposal);
    const handleSaveEdit = async (updated) => {
        try {
            await axios.put(`${apiUrl}/api/proposals/${updated.id}`, updated);
            setProposals(proposals.map(p => p.id === updated.id ? { ...p, ...updated } : p));
            setEditProposal(null);
        } catch {
            alert('Failed to update proposal');
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this proposal?')) return;
        try {
            await axios.delete(`${apiUrl}/api/proposals/${id}`);
            setProposals(proposals.filter(p => p.id !== id));
        } catch {
            alert('Failed to delete proposal');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Proposals</h2>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={handleCreateProposal}
                >
                    + Create Proposal
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proposals.map((proposal) => (
                    <div key={proposal.id} className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col space-y-2">
                        <div className="font-semibold text-lg">{proposal.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">Department: {proposal.department}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">Client: {proposal.client}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">Created by: {proposal.createdBy}</div>
                        <div className="flex items-center space-x-2 mt-2">
                            <span className="text-sm font-medium">QA Status:</span>
                            <select
                                className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                                value={proposal.qaStatus}
                                onChange={(e) => handleQAStatusChange(proposal.id, e.target.value)}
                            >
                                {qaOptions.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex space-x-2 mt-2">
                            <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600" onClick={() => handleEdit(proposal)}>Edit</button>
                            <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => handleDelete(proposal.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {editProposal && <EditProposalModal proposal={editProposal} onSave={handleSaveEdit} onClose={() => setEditProposal(null)} />}
        </div>
    );
}

export default Proposals;
