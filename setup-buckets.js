const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function setup() {
  // Create 'audio' bucket (public)
  console.log("Creating 'audio' bucket...");
  const { error: e1 } = await supabase.storage.createBucket("audio", {
    public: true,
    allowedMimeTypes: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3", "audio/flac"],
  });
  if (e1) console.error("audio bucket error:", e1.message);
  else console.log("✓ 'audio' bucket created!");

  // Create 'covers' bucket (public)
  console.log("Creating 'covers' bucket...");
  const { error: e2 } = await supabase.storage.createBucket("covers", {
    public: true,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
  });
  if (e2) console.error("covers bucket error:", e2.message);
  else console.log("✓ 'covers' bucket created!");

  // Verify
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log("\nBuckets now:", buckets.map(b => `${b.name} (public: ${b.public})`));
}

setup();
