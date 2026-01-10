import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCampaigns() {
    const { data: campaigns } = await supabase
        .from('campaigns')
        .select('name')
        .order('name');
    
    console.log('📋 Campaigns in database:');
    campaigns?.forEach(c => console.log(`  - ${c.name}`));
}

checkCampaigns().catch(console.error);
