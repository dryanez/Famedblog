require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function check() {
    console.log('Connecting to Supabase...');
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log('Querying campaign_automation...');
    const { data, error } = await supabase
        .from('campaign_automation')
        .select('*');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('--- CAMPAIGN SETTINGS FROM DB ---');
    if (data.length === 0) {
        console.log('Table is EMPTY. This means ALL campaigns are ENABLED by default.');
    } else {
        data.forEach(row => {
            console.log(`${row.campaign_id}: ${row.enabled ? '✅ ENABLED' : '❌ DISABLED'}`);
        });
    }
    console.log('---------------------------------');
}

check();
