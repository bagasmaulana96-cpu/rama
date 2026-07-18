const SUPABASE_URL = "https://yfsnrzcorxdfxenosvrh.supabase.co";

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlmc25yemNvcnhkZnhlbm9zdnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NjIwMTUsImV4cCI6MjA5ODAzODAxNX0.tidE2AgXJJfUlnRQl1DktgJ_TxkBsa5lnpulJaZCDXI"; // copy penuh dari tombol Copy

window.db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log(window.db);