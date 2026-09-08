const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load env vars manually
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = require('dotenv').parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLogs() {
    console.log("Checking campaign_logs...");

    // Get recent logs
    const { data: logs, error } = await supabase
        .from('campaign_logs')
        .select('id, campaign_id, user_email, user_id, sent_at')
        .order('sent_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching logs:', error);
        return;
    }

    console.log(`Found ${logs.length} recent logs.`);
    if (logs.length > 0) {
        console.log("Sample logs:");
        console.table(logs);
    } else {
        console.log("No logs found.");
    }

    // specific check for null user_ids
    const { count: nullIdCount } = await supabase
        .from('campaign_logs')
        .select('*', { count: 'exact', head: true })
        .is('user_id', null);

    console.log(`\nLogs with NULL user_id: ${nullIdCount}`);
}

checkLogs();
