const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

    console.log('Saved Content Snippet:', data?.content?.substring(0, 500));
}

checkCampaignContent();
