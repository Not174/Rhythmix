const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing env vars in .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testStorage() {
  console.log("Connecting to Supabase Storage...");
  console.log("Project URL:", supabaseUrl);
  
  // 1. List buckets
  console.log("\n--- Listing Buckets ---");
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error("Failed to list buckets:", listError);
  } else {
    console.log("Buckets found:", buckets.map(b => b.name));
    
    // Check if audio bucket exists
    const hasAudio = buckets.some(b => b.name === "audio");
    const hasCovers = buckets.some(b => b.name === "covers");
    console.log(`Has 'audio' bucket? ${hasAudio ? "YES" : "NO"}`);
    console.log(`Has 'covers' bucket? ${hasCovers ? "YES" : "NO"}`);
  }

  // 2. Test upload to audio bucket
  console.log("\n--- Testing Upload to 'audio' Bucket ---");
  try {
    const dummyContent = "dummy audio file content";
    const blob = Buffer.from(dummyContent);
    const fileName = `test_${Date.now()}.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("audio")
      .upload(fileName, blob, { contentType: "text/plain" });

    if (uploadError) {
      console.error("Upload failed with error:", uploadError);
    } else {
      console.log("Upload successful! File path in bucket:", uploadData.path);
      
      // Get public URL
      const { data: urlData } = supabase.storage.from("audio").getPublicUrl(fileName);
      console.log("Public URL:", urlData.publicUrl);
      
      // Clean up
      console.log("Cleaning up uploaded test file...");
      await supabase.storage.from("audio").remove([fileName]);
      console.log("Cleaned up successfully!");
    }
  } catch (err) {
    console.error("Test upload crashed:", err);
  }
}

testStorage();
