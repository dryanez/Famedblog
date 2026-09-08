"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { UserData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CSVUploaderProps {
    onDataLoaded: (data: UserData[]) => void;
}

export function CSVUploader({ onDataLoaded }: CSVUploaderProps) {
    const [isHovering, setIsHovering] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = (file: File) => {
        setError(null);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length) {
                    setError("Error parsing CSV. Please check the format.");
                    console.error(results.errors);
                    return;
                }

                // Process data to add parsed fields
                const processed = (results.data as any[]).map((row, index) => {
                    // Robust date parsing (assuming YYYY-MM-DD or similar)
                    const parseDate = (d: string) => {
                        if (!d || d === "Never" || d === "No") return null;
                        const parsed = new Date(d);
                        return isNaN(parsed.getTime()) ? null : parsed;
                    };

                    return {
                        ...row,
                        id: `user-${index}`,
                        parsedExamDate: parseDate(row["Exam Date"]),
                        parsedLastActive: parseDate(row["Last Active"]),
                        parsedTotalXP: parseInt(row["Total XP"]) || 0,
                    } as UserData;
                });

                // Current approach: We only want UNIQUE users by email for the "User List" view
                // But the CSV has activity logs (multiple rows per user).
                // However, looking at the CSV structure, line 1 has User Data, line 2 is activity.
                // It seems like a joined export.

                // Wait, looking at the CSV snippet (Step 4):
                // Line 2: "Dr.Felipe", ..., "Exam Date", ..., "Activity Name"
                // Line 3: , , , , , , ... "Activity Name"
                // It seems the User Data is only present in the FIRST row for that user, and subsequent rows are just activities?
                // OR it's a join where user data is repeated?
                // Looking at line 3: ",,,,,,,,,,ArztArzt" -> Empty user fields.

                // STRATEGY: We need to group by User (Email or Name).
                // We will forward-fill the user data if it's missing, OR we aggregate.

                // Actually, looking at the file content:
                // Line 2: Full user data.
                // Line 3: Empty user data, but has Activity.

                // So we need to "Fill Down" the user info.

                const filledData: UserData[] = [];
                let lastUser: Partial<UserData> | null = null;

                processed.forEach(row => {
                    if (row.Email) {
                        lastUser = {
                            Name: row.Name,
                            "Last Name": row["Last Name"],
                            Email: row.Email,
                            "German Level": row["German Level"],
                            "Exam Date": row["Exam Date"],
                            parsedExamDate: row.parsedExamDate,
                            "Total XP": row["Total XP"],
                            parsedTotalXP: row.parsedTotalXP,
                            "Last Active": row["Last Active"],
                            parsedLastActive: row.parsedLastActive
                        };
                        filledData.push(row);
                    } else if (lastUser) {
                        // It's an activity row for the previous user
                        // We might not need to add it to the "User List" if we just want unique users.
                        // But for "Total Activities" or specific history we might.
                        // For this Dashboard, let's just focus on UNIQUE USERS first.
                        // The CSV seems to contain ONE row with User Metadata per user, and then multiple rows of activities.
                        // Let's filter for rows that HAVE an Email.
                    }
                });

                // Filter processed data to only include rows with Email (User summary rows or primary rows)
                const uniqueUsers = processed.filter(u => !!u.Email);

                onDataLoaded(uniqueUsers);
            },
            error: (err) => {
                setError("Failed to read file.");
                console.error(err);
            }
        });
    };

    return (
        <div
            className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                isHovering ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-gray-300",
                error ? "border-red-200 bg-red-50" : ""
            )}
            onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
            onDragLeave={() => setIsHovering(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsHovering(false);
                if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
            }}
        >
            <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-white rounded-full shadow-sm ring-1 ring-gray-100">
                    <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                    <h3 className="font-medium text-gray-900">Upload Activity Export</h3>
                    <p className="text-sm text-gray-500 mt-1">Drag and drop your CSV file here</p>
                </div>
                <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    id="csv-upload"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
                <label
                    htmlFor="csv-upload"
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                    Select File
                </label>

                {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
