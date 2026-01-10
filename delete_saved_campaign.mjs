import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteSavedCampaign() {
    console.log('🗑️  Deleting saved 1-week campaign...');
    
    const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('name', '1 Week Special Offer');
    
    if (error) {
        console.error('❌ Error:', error);
    } else {
        console.log('✅ Deleted saved campaign!');
        console.log('📧 System will now use the latest template with red header and PayPal links');
    }
}

deleteSavedCampaign().catch(console.error);
