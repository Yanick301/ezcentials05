
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
    console.log('Checking tables...');

    // List tables
    const { data, error } = await supabase
        .from('orders')
        .select('id')
        .limit(1);

    if (error) {
        console.error('Error accessing orders table:', error);
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
            console.log('Orders table likely DOES NOT EXIST');
        }
    } else {
        console.log('Orders table exists and is accessible');
    }

    const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);

    if (profileError) {
        console.error('Error accessing user_profiles table:', profileError);
    } else {
        console.log('user_profiles table exists');
    }
}

checkTables();
