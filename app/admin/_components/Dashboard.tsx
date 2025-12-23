"use client";

import React, { useState, useMemo } from "react";
import { UserData } from "@/lib/types";
import { CSVUploader } from "./CSVUploader";
import { ActivityChart } from "./ActivityChart";
import { Users, Calendar, CloudLightning, Moon, Search, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Subcomponents (Inlined for speed, can refactor later) ---

function StatCard({ label, value, icon: Icon, color, onClick, active }: any) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "p-6 rounded-2xl border transition-all cursor-pointer bg-white",
                active ? "ring-2 ring-offset-2 ring-gray-900 border-gray-900" : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
            )}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg", color)}>
                    <Icon className="w-5 h-5 text-gray-700" />
                </div>
                {active && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            </div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">{value}</div>
            <div className="text-sm text-gray-500 mt-1 font-medium">{label}</div>
        </div>
    );
}

export function Dashboard() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [activeSegment, setActiveSegment] = useState<"all" | "exam_soon" | "sleeping" | "active">("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

    // --- Derived State & Stats ---
    const now = new Date(); // In a real app, might want to fix this date or use user provided date
    const stats = useMemo(() => {
        const examSoon = users.filter(u => u.parsedExamDate && u.parsedExamDate > now && u.parsedExamDate < new Date(now.getTime() + 90 * 86400000)).length;
        const sleeping = users.filter(u => !u.parsedLastActive).length; // "Never" active often results in null parsedLastActive
        // Wait, "Never" active based on CSV logic.
        // Also check if Last Active is very old (> 30 days) AND they have signed up?
        // The script logic was: Never Active = Last Active is NaN.
        // Sleeping Giants (High Potential) was a subset.
        // Let's align with the segments.

        const activeRecent = users.filter(u => u.parsedLastActive && u.parsedLastActive > new Date(now.getTime() - 30 * 86400000)).length;

        return { total: users.length, examSoon, sleeping, activeRecent };
    }, [users]);

    const filteredUsers = useMemo(() => {
        let result = users;

        // segment filter
        if (activeSegment === "exam_soon") {
            result = result.filter(u => u.parsedExamDate && u.parsedExamDate > now && u.parsedExamDate < new Date(now.getTime() + 90 * 86400000));
        } else if (activeSegment === "sleeping") {
            result = result.filter(u => !u.parsedLastActive); // Never active
            // Note: Users who were active long ago are also "sleeping" but let's stick to "Never" for the big bucket, or "Inactive > 30d"
            // Let's make "Sleeping" = Never active OR Inactive > 60 days
        } else if (activeSegment === "active") {
            result = result.filter(u => u.parsedLastActive && u.parsedLastActive > new Date(now.getTime() - 30 * 86400000));
        }

        // search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(u =>
                u.Name?.toLowerCase().includes(lower) ||
                u["Last Name"]?.toLowerCase().includes(lower) ||
                u.Email?.toLowerCase().includes(lower)
            );
        }

        return result;
    }, [users, activeSegment, searchTerm]);

    const handleSelectAll = () => {
        if (selectedUsers.size === filteredUsers.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
        }
    };

    const toggleUser = (id: string) => {
        const next = new Set(selectedUsers);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedUsers(next);
    };

    const sendBulkEmail = async () => {
        const recipients = filteredUsers.filter(u => selectedUsers.has(u.id));
        if (recipients.length === 0) return;

        if (!confirm(`Ready to send 50% discount offer to ${recipients.length} users?`)) return;

        // Call API
        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emails: recipients.map(u => ({ email: u.Email, name: u.Name })),
                    segment: activeSegment
                })
            });
            const json = await res.json();
            if (json.success) alert(`Success! Sent ${json.count} emails.`);
            else alert("Error: " + json.error);
        } catch (e) {
            alert("Failed to send.");
        }
    };

    if (users.length === 0) {
        return (
            <div className="max-w-xl mx-auto mt-20 px-6">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">Welcome Back, Felipe</h1>
                    <p className="text-gray-500 text-lg">Upload the latest user activity export to analyze segments.</p>
                </div>
                <CSVUploader onDataLoaded={setUsers} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex items-center justify-between pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">User Analytics</h1>
                    <p className="text-gray-500">Targeting Strategy: Xmas 50% Special</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setUsers([])}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                        Reset Data
                    </button>
                    <button
                        onClick={sendBulkEmail}
                        disabled={selectedUsers.size === 0}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm",
                            selectedUsers.size > 0
                                ? "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        )}
                    >
                        <Mail className="w-4 h-4" />
                        Send Offer ({selectedUsers.size})
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard
                    label="Total Users"
                    value={stats.total}
                    icon={Users}
                    color="bg-gray-100"
                    active={activeSegment === 'all'}
                    onClick={() => setActiveSegment('all')}
                />
                <StatCard
                    label="Exam Soon (<90d)"
                    value={stats.examSoon}
                    icon={Calendar}
                    color="bg-amber-100"
                    active={activeSegment === 'exam_soon'}
                    onClick={() => setActiveSegment('exam_soon')}
                />
                <StatCard
                    label="Sleeping Giants"
                    value={stats.sleeping}
                    icon={Moon}
                    color="bg-indigo-100"
                    active={activeSegment === 'sleeping'}
                    onClick={() => setActiveSegment('sleeping')}
                />
                <StatCard
                    label="Active Learners"
                    value={stats.activeRecent}
                    icon={CloudLightning}
                    color="bg-emerald-100"
                    active={activeSegment === 'active'}
                    onClick={() => setActiveSegment('active')}
                />
            </div>

            <ActivityChart users={users} />

            {/* Table Section */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3 w-full max-w-sm">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            placeholder="Search users..."
                            className="bg-transparent text-sm w-full outline-none text-gray-700 placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                        Showing {filteredUsers.length} users
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 w-10">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300"
                                        checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">German Level</th>
                                <th className="px-6 py-3">Exam Date</th>
                                <th className="px-6 py-3">Last Active</th>
                                <th className="px-6 py-3 text-right">Total XP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-3">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300"
                                            checked={selectedUsers.has(user.id)}
                                            onChange={() => toggleUser(user.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-3 font-medium text-gray-900">
                                        {user.Name} {user["Last Name"]}
                                    </td>
                                    <td className="px-6 py-3 text-gray-500 truncate max-w-[200px]">{user.Email}</td>
                                    <td className="px-6 py-3">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                                            user["German Level"] === 'C1' ? "bg-purple-100 text-purple-700" :
                                                user["German Level"] === 'B2' ? "bg-blue-100 text-blue-700" :
                                                    "bg-gray-100 text-gray-600"
                                        )}>
                                            {user["German Level"] || "N/A"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-gray-600">
                                        {user["Exam Date"] || "-"}
                                    </td>
                                    <td className="px-6 py-3">
                                        {user["Last Active"] ? (
                                            <span className={cn(
                                                user.parsedLastActive && user.parsedLastActive > new Date(now.getTime() - 30 * 86400000)
                                                    ? "text-green-600"
                                                    : "text-gray-400"
                                            )}>
                                                {user["Last Active"]}
                                            </span>
                                        ) : (
                                            <span className="text-gray-300 italic">Never</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-right text-gray-900 font-mono">
                                        {user["Total XP"]}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-10 text-center text-gray-500 italic">
                            No users found matching filters.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
