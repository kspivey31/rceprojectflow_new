import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Example color palette for project color selection
const COLOR_OPTIONS = [
    "#5C6FFF", // blue
    "#A855F7", // purple
    "#EC4899", // pink
    "#F97316", // orange
    "#FACC15", // yellow
    "#22C55E", // green
    "#06B6D4", // cyan
];

// Default options (can be replaced with props or API data)
const DEPARTMENTS = [
    "Civil Engineering",
    "Construction Services",
    "Municipal",
    "Site Development",
];
const PROJECT_MANAGERS = [
    { id: 1, name: "K. Spivey", email: "kspiveyrce@gmail.com" },
    { id: 2, name: "A. Smith", email: "asmith@robertscivil.com" },
];
const CLIENTS = [
    { id: 1, email: "client1@email.com" },
    { id: 2, email: "client2@email.com" },
];
const TEAM_MEMBERS = [
    { id: 1, name: "J. Doe" },
    { id: 2, name: "M. Lee" },
];
const SUBCONTRACTORS = [
    { id: 1, name: "Subcontractor A" },
    { id: 2, name: "Subcontractor B" },
];

const STATUS_OPTIONS = [
    { value: "Planning", label: "Planning - Initial project setup" },
    { value: "In Progress", label: "In Progress" },
    { value: "On Hold", label: "On Hold" },
    { value: "Completed", label: "Completed" },
];
const PRIORITY_OPTIONS = [
    { value: "Low", label: "Low - Non-urgent" },
    { value: "Medium", label: "Medium - Normal priority" },
    { value: "High", label: "High - Important" },
    { value: "Urgent", label: "Urgent - Time sensitive" },
];

export default function NewProjectModal({
    isOpen,
    onClose,
    onCreate,
    departments = DEPARTMENTS,
    projectManagers = PROJECT_MANAGERS,
    clients = CLIENTS,
    teamMembersOptions = TEAM_MEMBERS,
    subcontractorOptions = SUBCONTRACTORS,
}) {
    // --- Form State ---
    const [form, setForm] = useState({
        projectNumber: "",
        name: "",
        description: "",
        status: STATUS_OPTIONS[0].value,
        priority: PRIORITY_OPTIONS[1].value,
        department: "",
        startDate: "",
        dueDate: "",
        projectColor: COLOR_OPTIONS[0],
        pmUserId: "",
        pmName: "",
        pmEmail: "",
        clientId: "",
        clientEmail: "",
        contractAmount: "",
        parcelNumber: "",
        legalOwner: "",
        streetAddress: "",
        selectedTeamMember: "",
        selectedSubcontractor: "",
        teamMembers: [],
        subcontractors: [],
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // --- Modal Close Handlers ---
    const modalRef = useRef();
    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);
    const handleBackdrop = (e) => {
        if (e.target === modalRef.current) onClose();
    };

    // --- Field Change Handler ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    // --- Color Selection ---
    const handleColorSelect = (color) => setForm((f) => ({ ...f, projectColor: color }));

    // --- Project Manager Selection ---
    const handlePMSelect = (e) => {
        const pm = projectManagers.find((pm) => pm.id === Number(e.target.value));
        setForm((f) => ({
            ...f,
            pmUserId: pm?.id || "",
            pmName: pm?.name || "",
            pmEmail: pm?.email || "",
        }));
    };

    // --- Client Selection ---
    const handleClientSelect = (e) => {
        const client = clients.find((c) => c.id === Number(e.target.value));
        setForm((f) => ({
            ...f,
            clientId: client?.id || "",
            clientEmail: client?.email || "",
        }));
    };

    // --- Team Members Add/Remove ---
    const handleAddTeamMember = () => {
        if (
            form.selectedTeamMember &&
            !form.teamMembers.some((m) => m.id === Number(form.selectedTeamMember))
        ) {
            const member = teamMembersOptions.find(
                (m) => m.id === Number(form.selectedTeamMember)
            );
            setForm((f) => ({
                ...f,
                teamMembers: [...f.teamMembers, member],
                selectedTeamMember: "",
            }));
        }
    };
    const handleRemoveTeamMember = (id) =>
        setForm((f) => ({
            ...f,
            teamMembers: f.teamMembers.filter((m) => m.id !== id),
        }));

    // --- Subcontractors Add/Remove ---
    const handleAddSubcontractor = () => {
        if (
            form.selectedSubcontractor &&
            !form.subcontractors.some((s) => s.id === Number(form.selectedSubcontractor))
        ) {
            const sub = subcontractorOptions.find(
                (s) => s.id === Number(form.selectedSubcontractor)
            );
            setForm((f) => ({
                ...f,
                subcontractors: [...f.subcontractors, sub],
                selectedSubcontractor: "",
            }));
        }
    };
    const handleRemoveSubcontractor = (id) =>
        setForm((f) => ({
            ...f,
            subcontractors: f.subcontractors.filter((s) => s.id !== id),
        }));

    // --- Validation ---
    const validate = () => {
        const newErrors = {};
        if (!form.projectNumber) newErrors.projectNumber = "Project Number is required";
        if (!form.name) newErrors.name = "Project Name is required";
        if (!form.status) newErrors.status = "Status is required";
        if (!form.priority) newErrors.priority = "Priority is required";
        if (!form.department) newErrors.department = "Department is required";
        if (!form.pmUserId) newErrors.pmUserId = "Project Manager is required";
        if (!form.clientId) newErrors.clientId = "Client is required";
        if (form.contractAmount && Number(form.contractAmount) < 0)
            newErrors.contractAmount = "Contract amount must be positive";
        return newErrors;
    };

    // --- Submit Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
        setSubmitting(true);
        // Build payload
        const payload = {
            projectNumber: form.projectNumber,
            name: form.name,
            description: form.description,
            status: form.status,
            priority: form.priority,
            department: form.department,
            startDate: form.startDate,
            dueDate: form.dueDate,
            projectColor: form.projectColor,
            pmUserId: form.pmUserId,
            pmName: form.pmName,
            pmEmail: form.pmEmail,
            clientId: form.clientId,
            clientEmail: form.clientEmail,
            contractAmount: Number(form.contractAmount) || 0,
            parcelNumber: form.parcelNumber,
            legalOwner: form.legalOwner,
            streetAddress: form.streetAddress,
            teamMembers: form.teamMembers,
            subcontractors: form.subcontractors,
        };
        try {
            // POST to backend
            const res = await axios.post("/api/projects", payload);
            onCreate && onCreate(res.data);
            setSubmitting(false);
            onClose();
        } catch (err) {
            setSubmitting(false);
            setErrors({ submit: "Failed to create project. Please try again." });
        }
    };

    // --- Reset on close ---
    useEffect(() => {
        if (!isOpen) {
            setForm({
                projectNumber: "",
                name: "",
                description: "",
                status: STATUS_OPTIONS[0].value,
                priority: PRIORITY_OPTIONS[1].value,
                department: "",
                startDate: "",
                dueDate: "",
                projectColor: COLOR_OPTIONS[0],
                pmUserId: "",
                pmName: "",
                pmEmail: "",
                clientId: "",
                clientEmail: "",
                contractAmount: "",
                parcelNumber: "",
                legalOwner: "",
                streetAddress: "",
                selectedTeamMember: "",
                selectedSubcontractor: "",
                teamMembers: [],
                subcontractors: [],
            });
            setErrors({});
            setSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
            onClick={handleBackdrop}
        >
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <span className="material-icons">close</span>
                </button>
                {/* Modal Title */}
                <h2 className="text-2xl font-semibold mb-2">New Project</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* --- Core Details Section --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Project Number */}
                        <div>
                            <label className="block font-medium mb-1">Project Number</label>
                            <input
                                name="projectNumber"
                                className="w-full rounded-lg border px-3 py-2"
                                placeholder="e.g., PRJ-2024-001"
                                value={form.projectNumber}
                                onChange={handleChange}
                            />
                            {errors.projectNumber && (
                                <div className="text-xs text-red-500 mt-1">{errors.projectNumber}</div>
                            )}
                        </div>
                        {/* Project Name */}
                        <div>
                            <label className="block font-medium mb-1">Project Name</label>
                            <input
                                name="name"
                                className="w-full rounded-lg border px-3 py-2"
                                placeholder="Enter project name"
                                value={form.name}
                                onChange={handleChange}
                            />
                            {errors.name && (
                                <div className="text-xs text-red-500 mt-1">{errors.name}</div>
                            )}
                        </div>
                    </div>
                    {/* Description */}
                    <div>
                        <label className="block font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            className="w-full rounded-lg border px-3 py-2"
                            placeholder="Describe your project…"
                            value={form.description}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>
                    {/* Status & Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1">Status</label>
                            <select
                                name="status"
                                className="w-full rounded-lg border px-3 py-2"
                                value={form.status}
                                onChange={handleChange}
                            >
                                {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.status && (
                                <div className="text-xs text-red-500 mt-1">{errors.status}</div>
                            )}
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Priority</label>
                            <select
                                name="priority"
                                className="w-full rounded-lg border px-3 py-2"
                                value={form.priority}
                                onChange={handleChange}
                            >
                                {PRIORITY_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.priority && (
                                <div className="text-xs text-red-500 mt-1">{errors.priority}</div>
                            )}
                        </div>
                    </div>
                    {/* Department */}
                    <div>
                        <label className="block font-medium mb-1">Department</label>
                        <select
                            name="department"
                            className="w-full rounded-lg border px-3 py-2"
                            value={form.department}
                            onChange={handleChange}
                        >
                            <option value="">Select department</option>
                            {departments.map((dep) => (
                                <option key={dep} value={dep}>
                                    {dep}
                                </option>
                            ))}
                        </select>
                        {errors.department && (
                            <div className="text-xs text-red-500 mt-1">{errors.department}</div>
                        )}
                    </div>
                    {/* Start Date & Due Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1">Start Date</label>
                            <input
                                name="startDate"
                                type="date"
                                className="w-full rounded-lg border px-3 py-2"
                                value={form.startDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Due Date</label>
                            <input
                                name="dueDate"
                                type="date"
                                className="w-full rounded-lg border px-3 py-2"
                                value={form.dueDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    {/* Project Color */}
                    <div>
                        <label className="block font-medium mb-1">Project Color</label>
                        <div className="flex gap-3 mt-1">
                            {COLOR_OPTIONS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition ${form.projectColor === color
                                            ? "ring-2 ring-black border-white"
                                            : "border-slate-200"
                                        }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorSelect(color)}
                                    aria-label={color}
                                />
                            ))}
                        </div>
                    </div>
                    {/* Project Manager & Client Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1">Project Manager</label>
                            <select
                                name="pmUserId"
                                className="w-full rounded-lg border px-3 py-2"
                                value={form.pmUserId}
                                onChange={handlePMSelect}
                            >
                                <option value="">Select project manager</option>
                                {projectManagers.map((pm) => (
                                    <option key={pm.id} value={pm.id}>
                                        {pm.name} ({pm.email})
                                    </option>
                                ))}
                            </select>
                            {errors.pmUserId && (
                                <div className="text-xs text-red-500 mt-1">{errors.pmUserId}</div>
                            )}
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Client Email</label>
                            <select
                                name="clientId"
                                className="w-full rounded-lg border px-3 py-2"
                                value={form.clientId}
                                onChange={handleClientSelect}
                            >
                                <option value="">Select client</option>
                                {clients.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.email}
                                    </option>
                                ))}
                            </select>
                            {errors.clientId && (
                                <div className="text-xs text-red-500 mt-1">{errors.clientId}</div>
                            )}
                        </div>
                    </div>
                    {/* Contract Amount */}
                    <div>
                        <label className="block font-medium mb-1">Contract Amount ($)</label>
                        <input
                            name="contractAmount"
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full rounded-lg border px-3 py-2"
                            placeholder="0.00"
                            value={form.contractAmount}
                            onChange={handleChange}
                        />
                        {errors.contractAmount && (
                            <div className="text-xs text-red-500 mt-1">{errors.contractAmount}</div>
                        )}
                    </div>
                    {/* --- Reference Information Section --- */}
                    <div>
                        <div className="text-lg font-semibold">Reference Information</div>
                        <div className="text-slate-500 text-sm mb-2">
                            Additional property and location details
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Parcel Number */}
                            <div>
                                <label className="block font-medium mb-1">Parcel Number</label>
                                <input
                                    name="parcelNumber"
                                    className="w-full rounded-lg border px-3 py-2"
                                    placeholder="e.g., 12-3456-789"
                                    value={form.parcelNumber}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* Legal Property Owner */}
                            <div>
                                <label className="block font-medium mb-1">Legal Property Owner</label>
                                <input
                                    name="legalOwner"
                                    className="w-full rounded-lg border px-3 py-2"
                                    placeholder="e.g., John Doe"
                                    value={form.legalOwner}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        {/* Project Street Address */}
                        <div className="mt-4">
                            <label className="block font-medium mb-1">Project Street Address</label>
                            <input
                                name="streetAddress"
                                className="w-full rounded-lg border px-3 py-2"
                                placeholder="e.g., 123 Main Street, City, State ZIP"
                                value={form.streetAddress}
                                onChange={handleChange}
                            />
                        </div>
                        {/* Team Members (Internal) */}
                        <div className="mt-4">
                            <label className="block font-medium mb-1">Team Members (Internal)</label>
                            <div className="flex gap-2">
                                <select
                                    name="selectedTeamMember"
                                    className="flex-1 rounded-lg border px-3 py-2"
                                    value={form.selectedTeamMember}
                                    onChange={handleChange}
                                >
                                    <option value="">Select team member</option>
                                    {teamMembersOptions.map((tm) => (
                                        <option key={tm.id} value={tm.id}>
                                            {tm.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="bg-indigo-500 text-white rounded-lg px-3 py-2 font-semibold hover:bg-indigo-600"
                                    onClick={handleAddTeamMember}
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {form.teamMembers.map((tm) => (
                                    <span
                                        key={tm.id}
                                        className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 flex items-center gap-1"
                                    >
                                        {tm.name}
                                        <button
                                            type="button"
                                            className="ml-1 text-xs text-indigo-700 hover:text-red-500"
                                            onClick={() => handleRemoveTeamMember(tm.id)}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        {/* Subcontractors */}
                        <div className="mt-4">
                            <label className="block font-medium mb-1">Subcontractors</label>
                            <div className="flex gap-2">
                                <select
                                    name="selectedSubcontractor"
                                    className="flex-1 rounded-lg border px-3 py-2"
                                    value={form.selectedSubcontractor}
                                    onChange={handleChange}
                                >
                                    <option value="">Select subcontractor</option>
                                    {subcontractorOptions.map((sc) => (
                                        <option key={sc.id} value={sc.id}>
                                            {sc.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="bg-indigo-500 text-white rounded-lg px-3 py-2 font-semibold hover:bg-indigo-600"
                                    onClick={handleAddSubcontractor}
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {form.subcontractors.map((sc) => (
                                    <span
                                        key={sc.id}
                                        className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 flex items-center gap-1"
                                    >
                                        {sc.name}
                                        <button
                                            type="button"
                                            className="ml-1 text-xs text-purple-700 hover:text-red-500"
                                            onClick={() => handleRemoveSubcontractor(sc.id)}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* --- Footer Buttons --- */}
                    <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                        <button
                            type="button"
                            className="border border-slate-300 bg-white text-slate-700 rounded-lg px-4 py-2 font-semibold hover:bg-slate-100"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-indigo-700 disabled:opacity-60"
                            disabled={submitting}
                        >
                            {submitting ? "Creating…" : "Create Project"}
                        </button>
                    </div>
                    {errors.submit && (
                        <div className="text-xs text-red-500 mt-2">{errors.submit}</div>
                    )}
                </form>
            </div>
        </div>
    );
}
