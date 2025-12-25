const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkLogs() {
    // Check total logs
    const { data: logs, error } = await supabase
        .from('campaign_logs')
        .select('*')
        .limit(5);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Total logs found:', logs?.length || 0);
    console.log('Sample logs:', logs);

    // Check if user_id is null
    const { data: nullUserIdLogs } = await supabase
        .from('campaign_logs')
        .select('id, campaign_id, user_email, user_id')
        .is('user_id', null)
        .limit(5);

    console.log('Logs with null user_id:', nullUserIdLogs?.length || 0);
    console.log('Sample null user_id logs:', nullUserIdLogs);
}

checkLogs();
