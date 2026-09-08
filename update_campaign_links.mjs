import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateCampaignLinks() {
    console.log('🔄 Updating campaign links...');
    
    // Update 2-week urgency campaign
    const { data: twoWeekCampaign } = await supabase
        .from('campaigns')
        .select('content')
        .eq('name', 'Exam Urgency Special Offer')
        .single();
    
    if (twoWeekCampaign?.content) {
        let updatedContent = twoWeekCampaign.content;
        updatedContent = updatedContent.replace(/https:\/\/buy\.stripe\.com\/7sYdR88ZMcRqdRv90I0Jq02/g, 'https://www.paypal.com/ncp/payment/L9UX6QD4U85UC');
        updatedContent = updatedContent.replace(/https:\/\/buy\.stripe\.com\/9B64gAb4R2YV2sA8Vz7Re0o/g, 'https://www.paypal.com/ncp/payment/L9UX6QD4U85UC');
        
        const { error } = await supabase
            .from('campaigns')
            .update({ content: updatedContent })
            .eq('name', 'Exam Urgency Special Offer');
        
        if (error) console.error('❌ Error:', error);
        else console.log('✅ Updated 2-week campaign');
    } else {
        console.log('⚠️  2-week campaign not found');
    }
    
    // Update 1-week urgency campaign
    const { data: oneWeekCampaign } = await supabase
        .from('campaigns')
        .select('content')
        .eq('name', '1 Week Special Offer')
        .single();
    
    if (oneWeekCampaign?.content) {
        let updatedContent = oneWeekCampaign.content;
        updatedContent = updatedContent.replace(/https:\/\/buy\.stripe\.com\/bJe5kCcbYeZy14Ja4M0Jq03/g, 'https://www.paypal.com/ncp/payment/WMDX2PJU9BTW');
        updatedContent = updatedContent.replace(/https:\/\/buy\.stripe\.com\/fZudRafl7gPL5EM9ZD7Re0u/g, 'https://www.paypal.com/ncp/payment/WMDX2PJU9BTW');
        
        const { error } = await supabase
            .from('campaigns')
            .update({ content: updatedContent })
            .eq('name', '1 Week Special Offer');
        
        if (error) console.error('❌ Error:', error);
        else console.log('✅ Updated 1-week campaign');
    } else {
        console.log('⚠️  1-week campaign not found');
    }
    
    console.log('🎯 Done!');
}

updateCampaignLinks().catch(console.error);
