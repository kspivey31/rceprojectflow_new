// Messaging.jsx: Messaging panel for internal and external users
// Impact: Implements threaded messages, user avatars, and timestamps for a project
import React from 'react';

// Dummy messages (replace with API data later)
const messages = [
    { id: 1, user: 'Alice', avatar: '🧑‍💼', text: 'Initial project kickoff!', timestamp: '2025-12-01 09:00', thread: [] },
    {
        id: 2, user: 'Bob', avatar: '👷', text: 'Site survey completed.', timestamp: '2025-12-02 14:30', thread: [
            { id: 3, user: 'Alice', avatar: '🧑‍💼', text: 'Great, please upload the report.', timestamp: '2025-12-02 15:00' }
        ]
    },
];

function Messaging() {
    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Project Messaging</h2>
            <div className="space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className="border-b pb-2 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">{msg.avatar}</span>
                            <span className="font-semibold">{msg.user}</span>
                            <span className="text-xs text-gray-500 ml-2">{msg.timestamp}</span>
                        </div>
                        <div className="ml-8 text-gray-800 dark:text-gray-100">{msg.text}</div>
                        {/* Threaded replies */}
                        {msg.thread && msg.thread.length > 0 && (
                            <div className="ml-12 mt-2 space-y-2">
                                {msg.thread.map(reply => (
                                    <div key={reply.id} className="flex items-center space-x-2">
                                        <span className="text-2xl">{reply.avatar}</span>
                                        <span className="font-semibold">{reply.user}</span>
                                        <span className="text-xs text-gray-500 ml-2">{reply.timestamp}</span>
                                        <span className="ml-8 text-gray-800 dark:text-gray-100">{reply.text}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Messaging;
