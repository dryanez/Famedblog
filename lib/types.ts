export interface UserData {
    Name: string;
    "Last Name": string;
    Email: string;
    "German Level": string;
    "Exam Date": string;
    "Previous Attempt": string;
    "Preparation Time": string;
    "Total XP": string; // comes as string in CSV often
    "Total Activities": string;
    "Last Active": string;
    "Activity Type": string;
    "Activity Name": string;
    Score: string;
    Date: string;
    // Parsed fields
    parsedExamDate?: Date | null;
    parsedLastActive?: Date | null;
    parsedTotalXP?: number;
    id: string; // generated
}
