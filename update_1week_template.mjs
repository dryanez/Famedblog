import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { getExamUrgency1WeekSpecial } from './lib/campaign-templates.js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateTemplate() {
    console.log('🔄 Updating 1-week campaign with latest template...');
    
    // Generate the latest template content
    const sampleData = {
        userName: 'Dr. Maria Schmidt',
        userEmail: 'test@example.com',
        examDate: '2026-01-15',
        daysUntilExam: 7,
        planExpiry: '2026-02-01',
        accountType: 'free'
    };
    
    const latestTemplate = getExamUrgency1WeekSpecial(sampleData);
    
    // Update the database
    const { error } = await supabase
        .from('campaigns')
        .update({ content: latestTemplate })
        .eq('name', '1 Week Special Offer');
    
    if (error) {
        console.error('❌ Error:', error);
    } else {
        console.log('✅ Updated 1-week campaign with latest template design!');
    }
}

updateTemplate().catch(console.error);
