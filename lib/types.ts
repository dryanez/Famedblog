export interface UserData {
    Name: string;
    "Last Name": string;
    Email: string;
    "German Level": string;
    "Exam Date": string;
    "Previous Attempt": string;
    "Preparation Time": string;
    "Total XP": string;
    "Total Activities": string;
    "Last Active": string;
    "Activity Type": string;
    "Activity Name": string;
    Score: string;
    Date: string;
    // Supabase fields
    accountType?: "free" | "paid_1m" | "paid_3m" | string;
    planExpiry?: string | null;
    // Parsed fields
    parsedExamDate?: Date | null;
    parsedLastActive?: Date | null;
    parsedTotalXP?: number;
    parsedPlanExpiry?: Date | null;
    id: string; // generated
}


