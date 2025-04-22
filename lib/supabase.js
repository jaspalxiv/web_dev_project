const { createClient } = require("@supabase/supabase-js");

const supaBase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
);

module.exports = supaBase;