# Rhythmix 🎵

A modern, full-featured music streaming & playback web application built with **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

---

## ✨ Features

- **Music Streaming & Audio Player**: Persistent bottom audio player with Play, Pause, Next/Previous track, seek bar, volume control, and shuffle/repeat options.
- **Dedicated Player View**: Immersive song view with animated vinyl disk cover, audio frequency visualizer, lyric synchronization/scrolling, and queue management.
- **Song Upload & Storage**: Seamless song uploading (Audio file + Cover Art) powered by Supabase Storage.
- **Categorization & Filtering**: Filter music by genres (Pop, Rock, Hip-Hop, Lo-Fi, Electronic, Jazz, Classical, Ambient, etc.).
- **Search**: Real-time search across tracks, artists, and albums.
- **Dark / Light Theme**: Theme toggle for custom listening experiences.
- **Responsive Layout**: Designed for seamless playback on dynamic displays.

---

## 🚀 Getting Started

Follow these steps to run Rhythmix locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn` / `pnpm` / `bun`

---

### 🛠️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Not174/Rhythmix.git
   cd Rhythmix/rhythmix-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file inside the `rhythmix-app` directory and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Setup Storage Buckets (Optional/Supabase)**
   If you are configuring a fresh Supabase instance, run the bucket setup script:
   ```bash
   node setup-buckets.js
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```

6. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to start using Rhythmix!

---

## 📖 How to Use the App

1. **Explore & Listen**:
   - Browse songs on the **Home** page or filter by genre under **Categories**.
   - Click on any song card or track item to start instant playback.
2. **Control Playback**:
   - Use the sticky bottom player bar to pause, skip, scrub audio progress, or adjust volume.
   - Click on the song title or album cover in the bottom bar to open the **Immersive Player View**.
3. **Upload Music**:
   - Click **Upload Song** in the sidebar.
   - Provide the song title, artist, album, genre, audio file (`.mp3`, `.wav`), and cover image (`.png`, `.jpg`).
   - Click **Upload** to publish your song to the library!
4. **Queue & Lyrics**:
   - Inside the main player page, view synchronized lyrics (if available) and adjust the upcoming playback queue.

---

## 🛠️ Built With

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide Icons
- **Backend & Storage**: Supabase
- **State & Theme**: React Context & next-themes
