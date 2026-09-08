import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const campaignsToDelete = [
    'Welcome Bundle Promo',
    'Exam Urgency Special Offer',
    '1 Week Special Offer'
];

console.log('🗑️  Deleting old saved campaigns...\n');

for (const name of campaignsToDelete) {
    const { data, error } = await supabase
        .from('campaigns')
        .delete()
        .eq('name', name);
    
    if (error) {
        console.error(`❌ Error deleting "${name}":`, error);
    } else {
        console.log(`✅ Deleted "${name}"`);
    }
}

console.log('\n📧 System will now use the latest template code for these campaigns');
