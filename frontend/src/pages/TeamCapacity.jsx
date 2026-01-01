// TeamCapacity.jsx: Page to show team members, available hours, and workload
// Impact: Implements the Team Capacity page with a capacity bar for each employee
import React from 'react';

// Dummy data for team members (replace with API data later)
const team = [
    { id: 1, name: 'Alice', available: 40, assigned: 32 },
    { id: 2, name: 'Bob', available: 40, assigned: 40 },
    { id: 3, name: 'Charlie', available: 40, assigned: 20 },
];

function TeamCapacity() {
    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Team Capacity</h2>
            <div className="space-y-4">
                {team.map(member => {
                    const percent = Math.round((member.assigned / member.available) * 100);
                    return (
                        <div key={member.id}>
                            <div className="flex justify-between mb-1">
                                <span className="font-medium">{member.name}</span>
                                <span className="text-sm text-gray-500">{member.assigned} / {member.available} hrs</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded h-4">
                                <div
                                    className={`h-4 rounded ${percent < 80 ? 'bg-green-500' : percent < 100 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{percent}% capacity</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TeamCapacity;
