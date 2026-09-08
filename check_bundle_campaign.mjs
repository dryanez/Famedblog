import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('name', 'Welcome Bundle Promo');

if (error) {
    console.error('Error:', error);
} else {
    console.log('Saved Welcome Bundle campaigns:', data);
    if (data && data.length > 0) {
        console.log('\n⚠️  Found saved version! Deleting it...');
        const { error: deleteError } = await supabase
            .from('campaigns')
            .delete()
            .eq('name', 'Welcome Bundle Promo');
        
        if (deleteError) {
            console.error('Delete error:', deleteError);
        } else {
            console.log('✅ Deleted! Will now use the new template.');
        }
    } else {
        console.log('\n✅ No saved version - will use the new template!');
    }
}
