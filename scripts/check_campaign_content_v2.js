const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load env vars manually
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = require('dotenv').parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCampaignContent() {
    const { data, error } = await supabase
        .from('campaigns')
        .select('content')
        .eq('name', 'Holiday Special')
        .single();

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Saved Content (first 1000 chars):');
    console.log(data?.content?.substring(0, 1000));
}

checkCampaignContent();
