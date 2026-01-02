
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import NewProjectModal from "../components/NewProjectModal";

// --- SummaryCard Component ---
function SummaryCard({ icon, label, value, color }) {
    return (
        <div className={`flex items-center p-4 rounded-lg shadow bg-white`}>
            <div className={`w-12 h-12 flex items-center justify-center rounded-full ${color} bg-opacity-20 mr-4`}>
                {icon}
            </div>
            <div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-gray-500">{label}</div>
            </div>
        </div>
    );
}

// --- FilterBar Component ---
function FilterBar({
    searchTerm,
    setSearchTerm,
    projectManagers,
    selectedProjectManager,
    setSelectedProjectManager,
    teamMembers,
    selectedTeamMember,
    setSelectedTeamMember,
    departments,
    selectedDepartment,
    setSelectedDepartment,
    selectedStatus,
    setSelectedStatus,
    viewMode,
    setViewMode
}) {
    return (
        <div className="flex flex-col md:flex-row md:items-end gap-4 mt-8 mb-6">
            <input
                type="text"
                className="border rounded-lg px-3 py-2 w-full md:w-64"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <select
                className="border rounded-lg px-3 py-2"
                value={selectedProjectManager}
                onChange={e => setSelectedProjectManager(e.target.value)}
            >
                <option>All Project Managers</option>
                {projectManagers.map(pm => (
                    <option key={pm} value={pm}>{pm}</option>
                ))}
            </select>
            <select
                className="border rounded-lg px-3 py-2"
                value={selectedTeamMember}
                onChange={e => setSelectedTeamMember(e.target.value)}
            >
                <option>All Team Members</option>
                {teamMembers.map(tm => (
                    <option key={tm} value={tm}>{tm}</option>
                ))}
            </select>
            <select
                className="border rounded-lg px-3 py-2"
                value={selectedDepartment}
                onChange={e => setSelectedDepartment(e.target.value)}
            >
                <option>All Departments</option>
                {departments.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                ))}
            </select>
            <select
                className="border rounded-lg px-3 py-2"
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
            >
                <option>All Status</option>
                <option>Planning</option>
                <option>In Progress</option>
                <option>On Hold</option>
                <option>Completed</option>
            </select>
            <div className="flex gap-2">
                <button
                    className={`px-3 py-2 rounded-lg font-semibold ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'bg-white border'}`}
                    onClick={() => setViewMode('grid')}
                    type="button"
                >Grid</button>
                <button
                    className={`px-3 py-2 rounded-lg font-semibold ${viewMode === 'list' ? 'bg-indigo-500 text-white' : 'bg-white border'}`}
                    onClick={() => setViewMode('list')}
                    type="button"
                >List</button>
            </div>
        </div>
    );
}

// --- Child Components ---
// ...[All child components from the previous code block: SummaryCard, StatusPill, PriorityPill, DepartmentPill, ProgressBar, ProjectCard, ProjectsGrid, ProjectsList, FilterBar]...
// For brevity, see previous code block for full definitions.

// --- Main ProjectsPage Component ---
const ProjectsPage = () => {
    // --- State ---
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProjectManager, setSelectedProjectManager] = useState("All Project Managers");
    const [selectedTeamMember, setSelectedTeamMember] = useState("All Team Members");
    const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
    const [selectedStatus, setSelectedStatus] = useState("All Status");
    const [viewMode, setViewMode] = useState("grid");
    const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

    // --- Fetch Projects ---
    useEffect(() => {
        axios.get("/api/projects")
            .then(res => setProjects(res.data))
            .catch(() => setProjects([]));
    }, []);

    // --- Debounced Search ---
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // --- Filtered Projects ---
    const filteredProjects = useMemo(() => {
        let filtered = [...projects];
        // Search
        if (debouncedSearch) {
            const term = debouncedSearch.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    String(p.projectNumber).toLowerCase().includes(term) ||
                    (p.name && p.name.toLowerCase().includes(term)) ||
                    (p.pmEmail && p.pmEmail.toLowerCase().includes(term)) ||
                    (p.description && p.description.toLowerCase().includes(term))
            );
        }
        // Project Manager
        if (selectedProjectManager !== "All Project Managers") {
            filtered = filtered.filter((p) => p.pmEmail === selectedProjectManager);
        }
        // Team Member
        if (selectedTeamMember !== "All Team Members") {
            filtered = filtered.filter(
                (p) => Array.isArray(p.teamMembers) && p.teamMembers.includes(selectedTeamMember)
            );
        }
        // Department
        if (selectedDepartment !== "All Departments") {
            filtered = filtered.filter((p) => p.department === selectedDepartment);
        }
        // Status
        if (selectedStatus !== "All Status") {
            filtered = filtered.filter((p) => p.status === selectedStatus);
        }
        return filtered;
    }, [
        projects,
        debouncedSearch,
        selectedProjectManager,
        selectedTeamMember,
        selectedDepartment,
        selectedStatus,
    ]);

    // --- Dropdown Options ---
    const projectManagers = useMemo(
        () => Array.from(new Set(projects.map((p) => p.pmEmail))).filter(Boolean),
        [projects]
    );
    const teamMembers = useMemo(
        () =>
            Array.from(
                new Set(
                    projects.flatMap((p) => Array.isArray(p.teamMembers) ? p.teamMembers : [])
                )
            ).filter(Boolean),
        [projects]
    );
    const departments = useMemo(
        () => Array.from(new Set(projects.map((p) => p.department))).filter(Boolean),
        [projects]
    );

    // --- Summary Stats ---
    const totalProjects = filteredProjects.length;
    const inProgress = filteredProjects.filter((p) => p.status === "In Progress").length;
    const completed = filteredProjects.filter((p) => p.status === "Completed").length;

    // --- Actions ---
    const handleCreateProject = (createdProject) => {
        setProjects((prev) => [createdProject, ...prev]);
        setIsNewProjectOpen(false);
    };

    const handleExportUsers = () => {
        console.log("Export Users clicked");
    };

    const handleContext = (project) => {
        alert(`Open context for ${project.name}`);
    };

    // --- Render ---
    return (
        <div className="bg-slate-50 min-h-screen p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900">Projects</h1>
                    <div className="text-slate-500 mt-1">
                        Manage and track all your projects in one place
                    </div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                        className="bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg px-4 py-2 shadow-sm hover:bg-slate-100 transition"
                        onClick={handleExportUsers}
                    >
                        Export Users
                    </button>
                    <button
                        className="bg-indigo-500 text-white font-semibold rounded-lg px-4 py-2 shadow-sm hover:bg-indigo-600 transition"
                        onClick={() => setIsNewProjectOpen(true)}
                    >
                        + New Project
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                <SummaryCard
                    icon={<span className="material-icons text-3xl text-indigo-500">folder</span>}
                    label="Total Projects"
                    value={totalProjects}
                    color="bg-indigo-500"
                />
                <SummaryCard
                    icon={<span className="material-icons text-3xl text-yellow-500">hourglass_empty</span>}
                    label="In Progress"
                    value={inProgress}
                    color="bg-yellow-500"
                />
                <SummaryCard
                    icon={<span className="material-icons text-3xl text-green-500">check_circle</span>}
                    label="Completed"
                    value={completed}
                    color="bg-green-500"
                />
            </div>

            {/* Filters/Search */}
            <FilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                projectManagers={projectManagers}
                selectedProjectManager={selectedProjectManager}
                setSelectedProjectManager={setSelectedProjectManager}
                teamMembers={teamMembers}
                selectedTeamMember={selectedTeamMember}
                setSelectedTeamMember={setSelectedTeamMember}
                departments={departments}
                selectedDepartment={selectedDepartment}
                setSelectedDepartment={setSelectedDepartment}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            {/* Projects Grid/List */}
            {viewMode === "grid" ? (
                <ProjectsGrid projects={filteredProjects} onContext={handleContext} />
            ) : (
                <ProjectsList projects={filteredProjects} onContext={handleContext} />
            )}

            {/* New Project Modal */}
            <NewProjectModal
                isOpen={isNewProjectOpen}
                onClose={() => setIsNewProjectOpen(false)}
                onCreate={handleCreateProject}
            />
        </div>
    );
};

export default ProjectsPage;
