// Proposals.jsx: Lists all proposals in card format with QA workflow
// Impact: Implements the Proposals page with card view, QA status dropdown, and create proposal button
import React, { useState } from 'react';

// Dummy data for proposals (replace with API data later)
const initialProposals = [
    {
        id: 1,
        title: 'Bridge Design for River X',
        department: 'Structural',
        client: 'City of Springfield',
        createdBy: 'Alice',
        qaStatus: 'Submitted QA1',
    },
    {
        id: 2,
        title: 'Highway Expansion Phase 2',
        department: 'Transportation',
        client: 'State DOT',
        createdBy: 'Bob',
        qaStatus: 'Submitted QA2',
    },
];

const qaOptions = [
    'Submitted QA1',
    'Submitted QA2',
    'QA Completed',
];

function Proposals() {
    // State for proposals list
    const [proposals, setProposals] = useState(initialProposals);

    // Handle QA status change
    const handleQAStatusChange = (id, newStatus) => {
        setProposals((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, qaStatus: newStatus } : p
            )
        );
        // If QA Completed, trigger API call to create project (to be implemented)
        if (newStatus === 'QA Completed') {
            // TODO: Call backend API to create project from proposal
            alert('Project will be created from this proposal (API call placeholder)');
        }
    };

    // Handle create proposal (manual, for now just adds dummy)
    const handleCreateProposal = () => {
        const newProposal = {
            id: proposals.length + 1,
            title: 'New Proposal',
            department: 'TBD',
            client: 'TBD',
            createdBy: 'You',
            qaStatus: 'Submitted QA1',
        };
        setProposals([newProposal, ...proposals]);
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
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Proposals;
