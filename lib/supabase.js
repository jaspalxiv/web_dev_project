const { createClient } = require("@supabase/supabase-js");

const supaBase = createClient(
    "https://jmlvnzstbxundwmswgux.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptbHZuenN0Ynh1bmR3bXN3Z3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDAzMzAsImV4cCI6MjA1NzQ3NjMzMH0.wOxx8e3WY9BS_PbehFd5SF7zyem4eR2bP7C1hbyi12A"
);

module.exports = supaBase;