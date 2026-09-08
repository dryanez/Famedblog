const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.error('Missing env vars. URL:', !!supabaseUrl, 'Key:', !!serviceKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function createAdmin() {
    const email = 'admin@famed-vorbereitung.com';
    const password = 'Todayisagoodday01@';

    console.log(`Creating user: ${email}...`);

    // Try to create
    const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true
    });

    if (error) {
        console.log('Error creating user (might already exist):', error.message);

        // If exists, update password
        if (error.message.includes('already registered')) {
            console.log('User exists. Updating password...');
            // We need the user ID. List users to find it? Or just update by email logic isn't direct in admin API sometimes without ID.
            // Actually getUserById is standard. Get by email?
            // listUsers
            const { data: listData } = await supabase.auth.admin.listUsers();
            const user = listData.users.find(u => u.email === email);

            if (user) {
                const { error: updateError } = await supabase.auth.admin.updateUserById(
                    user.id,
                    { password: password }
                );
                if (updateError) console.error('Failed to update password:', updateError);
                else console.log('Password updated successfully!');
            }
        }
    } else {
        console.log('Success! Admin user created.');
        console.log('User ID:', data.user.id);
    }
}

createAdmin();
