// ProjectDetails.jsx: Dashboard for a single project with tabbed panels
// Impact: Implements the Project Details page with tabs for Overview, Tasks, Billing, etc.
import React, { useState } from 'react';

const tabs = [
    'Overview',
    'Tasks',
    'Billing Summary',
    'Submittals',
    'Deliverables',
    'Messaging',
    'Documents',
];

function ProjectDetails() {
    // State for active tab
    const [activeTab, setActiveTab] = useState('Overview');

    // Placeholder panel content for each tab
    const renderPanel = () => {
        switch (activeTab) {
            case 'Overview':
                return <div>Project overview content goes here.</div>;
            case 'Tasks':
                return <div>Project tasks content goes here.</div>;
            case 'Billing Summary':
                return <div>Billing summary content goes here.</div>;
            case 'Submittals':
                return <div>Submittals content goes here.</div>;
            case 'Deliverables':
                return <div>Deliverables content goes here.</div>;
            case 'Messaging':
                return <div>Messaging panel content goes here.</div>;
            case 'Documents':
                return <div>Documents content goes here.</div>;
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
