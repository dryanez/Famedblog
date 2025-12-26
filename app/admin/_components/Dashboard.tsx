"use client";

import React, { useState, useMemo, useEffect } from "react";
import { UserData } from "@/lib/types";
import { ActivityChart } from "./ActivityChart";
import { Users, Calendar, CloudLightning, Moon, Search, Mail, Eye, X, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEmailTemplate } from "@/lib/email-templates";
import { CampaignHistoryModal } from "./CampaignHistoryModal";
import { SendCampaignModal } from "./SendCampaignModal";

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
    const [activeSegment, setActiveSegment] = useState<"all" | "exam_soon" | "sleeping" | "active" | "paid">("all");
    const [searchTerm, setSearchTerm] = useState("");
    // Campaign Filtering State
    const [selectedCampaignType, setSelectedCampaignType] = useState<string>("all");
    const [selectedDateRange, setSelectedDateRange] = useState<"all" | "today" | "last7" | "last30">("all");
    // CRM Advanced Filtering
    const [filterGermanLevel, setFilterGermanLevel] = useState<string>("all");
    const [filterExamTiming, setFilterExamTiming] = useState<string>("all");
    const [filterPrevAttempt, setFilterPrevAttempt] = useState<string>("all");
    // Checkbox Selection
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

    const [historyUserId, setHistoryUserId] = useState<string | null>(null);
    const [historyUserEmail, setHistoryUserEmail] = useState<string>("");
    const [showSendModal, setShowSendModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch users from Supabase on mount
    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true);
                const res = await fetch('/api/users');
                const json = await res.json();

                if (!res.ok) {
                    throw new Error(json.error || 'Failed to fetch users');
                }

                // Map Supabase data to UserData format
                const mappedUsers: UserData[] = (json.users || []).map((user: any) => {
                    const fullName = user.full_name || '';
                    const nameParts = fullName.split(' ');
                    const firstName = nameParts[0] || '';
                    const lastName = nameParts.slice(1).join(' ') || '';

                    const examDate = user.exam_date || '';
                    const parsedExamDate = examDate ? new Date(examDate) : null;
                    const planExpiry = user.plan_expiry || '';
                    const parsedPlanExpiry = planExpiry ? new Date(planExpiry) : null;

                    return {
                        Name: firstName,
                        'Last Name': lastName,
                        Email: user.email || '',
                        'German Level': user.german_level || 'N/A',
                        'Exam Date': examDate,
                        'Previous Attempt': user.has_attempted_before ? 'Yes' : 'No',
                        'Preparation Time': user.preparation_time || 'N/A',
                        'Total XP': String(user.xp || 0),
                        'Total Activities': '0', // Not available in Supabase
                        'Last Active': '', // Not available in Supabase
                        'Activity Type': '',
                        'Activity Name': '',
                        Score: '',
                        Date: '',
                        accountType: user.account_type,
                        planExpiry,
                        parsedExamDate,
                        parsedLastActive: null,
                        parsedTotalXP: user.xp || 0,
                        parsedPlanExpiry,
                        id: String(user.id)
                    };
                });

                setUsers(mappedUsers);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching users:', err);
                setError(err.message || 'Failed to load users');
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    // --- Derived State & Stats ---
    const now = new Date();
    const stats = useMemo(() => {
        const examSoon = users.filter(u => u.parsedExamDate && u.parsedExamDate > now && u.parsedExamDate < new Date(now.getTime() + 90 * 86400000)).length;
        // Since we don't have "Last Active", use created_date logic would go here if we had it in the data
        // For now, sleeping = users with no exam date set (not engaged)
        const sleeping = users.filter(u => !u['Exam Date'] || u['Exam Date'] === '').length;
        // Active = users with recent activity (would need activity data, using exam date as proxy for now)
        const activeRecent = users.filter(u => u.parsedExamDate && u.parsedExamDate > now).length;
        // Paid = any account_type that starts with "paid"
        const paid = users.filter(u => u.accountType && u.accountType.startsWith('paid')).length;

        return { total: users.length, examSoon, sleeping, activeRecent, paid };
    }, [users]);

    const filteredUsers = useMemo(() => {
        let result = users;

        // segment filter
        if (activeSegment === "exam_soon") {
            result = result.filter(u => u.parsedExamDate && u.parsedExamDate > now && u.parsedExamDate < new Date(now.getTime() + 90 * 86400000));
        } else if (activeSegment === "sleeping") {
            result = result.filter(u => !u['Exam Date'] || u['Exam Date'] === '');
        } else if (activeSegment === "active") {
            result = result.filter(u => u.parsedExamDate && u.parsedExamDate > now);
        } else if (activeSegment === "paid") {
            result = result.filter(u => u.accountType && u.accountType.startsWith('paid'));
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

        // --- Advanced CRM Filters ---
        // German Level
        if (filterGermanLevel !== "all") {
            result = result.filter(u => u["German Level"] === filterGermanLevel);
        }

        // Previous Attempt
        if (filterPrevAttempt !== "all") {
            result = result.filter(u => u["Previous Attempt"] === (filterPrevAttempt === "yes" ? "Yes" : "No"));
        }

        // Exam Timing
        if (filterExamTiming !== "all") {
            result = result.filter(u => {
                if (!u.parsedExamDate) return false;
                const now = new Date();
                const diffTime = u.parsedExamDate.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days until exam

                switch (filterExamTiming) {
                    case "gt_3m": return diffDays > 90;
                    case "gt_2m": return diffDays > 60;
                    case "gt_1m": return diffDays > 30;
                    case "gte_2w": return diffDays >= 14;
                    case "lt_2w": return diffDays <= 14 && diffDays >= 0;
                    case "lt_1w": return diffDays <= 7 && diffDays >= 0;
                    default: return true;
                }
            });
        }

        return result;
    }, [users, activeSegment, searchTerm, filterGermanLevel, filterExamTiming, filterPrevAttempt]);

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

    const getDaysUntilExam = (user: UserData): number | null => {
        if (!user.parsedExamDate) return null;
        const now = new Date();
        const diff = user.parsedExamDate.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading users from database...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Users</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex items-center justify-between pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">User Analytics</h1>
                    <p className="text-gray-500">Targeting Strategy: Xmas 50% Special <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded text-xs ml-2">CRM v2 Active</span></p>
                </div>
                <div className="flex gap-3">
                    <a
                        href="/admin/campaigns"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm bg-blue-600 text-white hover:bg-blue-700"
                    >
                        📧 Campaigns
                    </a>
                    <a
                        href="/admin/analytics"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm bg-purple-600 text-white hover:bg-purple-700"
                    >
                        📊 Analytics
                    </a>
                    {selectedUsers.size > 0 && (
                        <button
                            onClick={() => setShowSendModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm bg-green-600 text-white hover:bg-green-700"
                        >
                            📤 Send to {selectedUsers.size}
                        </button>
                    )}
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-5 gap-4">
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
                    label="Paid Users"
                    value={stats.paid}
                    icon={DollarSign}
                    color="bg-green-100"
                    active={activeSegment === 'paid'}
                    onClick={() => setActiveSegment('paid')}
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
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
                    <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                        <div className="relative flex items-center flex-1 max-w-xs">
                            <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                            <input
                                placeholder="Search users..."
                                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 placeholder:text-gray-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Campaign Filter */}
                        {/* German Level Filter */}
                        <select
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                            value={filterGermanLevel}
                            onChange={(e) => setFilterGermanLevel(e.target.value)}
                        >
                            <option value="all">Level: All</option>
                            <option value="C1">C1</option>
                            <option value="B2">B2</option>
                            <option value="B1">B1</option>
                            <option value="A2">A2</option>
                            <option value="N/A">N/A</option>
                        </select>

                        {/* Exam Timing Filter */}
                        <select
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                            value={filterExamTiming}
                            onChange={(e) => setFilterExamTiming(e.target.value)}
                        >
                            <option value="all">Exam Date: All</option>
                            <option value="gt_3m">&gt; 3 Months</option>
                            <option value="gt_2m">&gt; 2 Months</option>
                            <option value="gt_1m">&gt; 1 Month</option>
                            <option value="gte_2w">&gt;= 2 Weeks</option>
                            <option value="lt_2w">&lt; 2 Weeks</option>
                            <option value="lt_1w">&lt; 1 Week</option>
                        </select>

                        {/* Previous Attempt Filter */}
                        <select
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                            value={filterPrevAttempt}
                            onChange={(e) => setFilterPrevAttempt(e.target.value)}
                        >
                            <option value="all">Tried Before: All</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <div className="text-sm text-gray-500 font-medium whitespace-nowrap">
                        {filteredUsers.length} users found
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
                                <th className="px-6 py-3">Account Type</th>
                                <th className="px-6 py-3">Plan Expiry</th>
                                <th className="px-6 py-3">Exam Date</th>
                                <th className="px-6 py-3 text-right">Total XP</th>
                                <th className="px-6 py-3 text-center">Campaigns</th>
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
                                    <td className="px-6 py-3">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                                            user.accountType && user.accountType.startsWith('paid')
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                        )}>
                                            {user.accountType === 'paid_1m' ? 'Paid 1M' :
                                                user.accountType === 'paid_3m' ? 'Paid 3M' :
                                                    user.accountType || 'Free'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-gray-600">
                                        {user.planExpiry || "-"}
                                    </td>
                                    <td className="px-6 py-3 text-gray-600">
                                        {user["Exam Date"] || "-"}
                                    </td>
                                    <td className="px-6 py-3 text-right text-gray-900 font-mono">
                                        {user["Total XP"]}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <button
                                            onClick={() => {
                                                setHistoryUserId(user.id);
                                                setHistoryUserEmail(user.Email);
                                            }}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View campaign history"
                                        >
                                            <Mail className="w-4 h-4" />
                                            History
                                        </button>
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

            {/* Campaign History Modal */}
            {historyUserId && (
                <CampaignHistoryModal
                    userId={historyUserId}
                    userEmail={historyUserEmail}
                    onClose={() => {
                        setHistoryUserId(null);
                        setHistoryUserEmail("");
                    }}
                />
            )}

            {/* Send Campaign Modal */}
            {showSendModal && (
                <SendCampaignModal
                    selectedUserIds={Array.from(selectedUsers)}
                    onClose={() => setShowSendModal(false)}
                    onSuccess={() => {
                        setShowSendModal(false);
                        setSelectedUsers(new Set());
                    }}
                />
            )}
        </div>
    );
}
