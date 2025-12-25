const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load env vars manually
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = require('dotenv').parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixCampaignContent() {
    const { data, error } = await supabase
        .from('campaigns')
        .select('content')
        .eq('name', 'Holiday Special')
        .single();

    if (error) {
        console.error('Error fetching:', error);
        return;
    }

    let content = data.content;

    // Find the greeting to see what it currently says
    const greetingRegex = /(Hi|Hello|Dear|Guten Tag)\s+([^,<]+)/i;
    const match = content.match(greetingRegex);

    if (match) {
        console.log('Current greeting found:', match[0]);

        // Replace with placeholder
        // We will be aggressive and replace the whole name part with {{userName}}
        // But let's be safe and just replace "Test Person" or "Dr. Maria Schmidt" if found

        const newContent = content.replace(/(Hi|Hello|Dear|Guten Tag)\s+(Dr\.\sMaria\sSchmidt|Test\sPerson|there|test\sperson)/g, '$1 {{userName}}');

        if (newContent !== content) {
            console.log('Replacing content...');
            const { error: updateError } = await supabase
                .from('campaigns')
                .update({ content: newContent })
                .eq('name', 'Holiday Special');

            if (updateError) console.error('Update failure:', updateError);
            else console.log('Successfully updated content with {{userName}} placeholder');
        } else {
            console.log('No known sample name found to replace. Checks regex.');
        }
    } else {
        console.log('No greeting found in content.');
    }
}

fixCampaignContent();
