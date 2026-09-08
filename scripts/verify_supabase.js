const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://muptfkaevuyeffudfmey.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cHRma2FldnV5ZWZmdWRmbWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NTgxMzgsImV4cCI6MjA4MTEzNDEzOH0.p_IfZeyO7Z6TXfMuiaAoXdKQu1g476ML5yah25wtSHI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log('Attempting to insert test lead...');
    // Note: We do NOT call .select() here because our RLS policy allows INSERT but not SELECT for anon users.
    const { error } = await supabase
        .from('leads')
        .insert([
            { email: 'test_verification_' + Date.now() + '@example.com', first_name: 'TestBot', source: 'verification_script' }
        ]);

    if (error) {
        console.error('❌ Verification FAILED:', error.message);
    } else {
        console.log('✅ Verification SUCCEEDED! Row inserted (cannot view it due to RLS, which is correct).');
    }
}

verify();
