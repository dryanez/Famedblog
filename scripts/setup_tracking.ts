
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
    console.log('Checking for campaign_logs table...');

    const { error } = await supabase
        .from('campaign_logs')
        .select('id')
        .limit(1);

    if (error && error.code === '42P01') { // undefined_table
        console.log('Table campaign_logs does not exist. Please run the SQL manually in Supabase SQL Editor:');
        console.log('\n' + fs.readFileSync(path.join(process.cwd(), 'sql', 'create_campaign_logs.sql'), 'utf8') + '\n');

        // Attempt to create via RPC if exists (optional)
        const sql = fs.readFileSync(path.join(process.cwd(), 'sql', 'create_campaign_logs.sql'), 'utf8');
        const { error: rpcError } = await supabase.rpc('exec_sql', { sql });

        if (!rpcError) {
            console.log('Successfully created campaign_logs table via RPC!');
        } else {
            console.log('Could not auto-create table (RPC exec_sql missing). Please run SQL manually.');
        }
    } else if (error) {
        console.error('Error checking table:', error);
    } else {
        console.log('Table campaign_logs already exists.');
    }
}

setupDatabase();
