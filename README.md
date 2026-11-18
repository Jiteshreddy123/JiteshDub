# Y. Jitesh Reddy — Dubbing & Voiceover Artist Portfolio

An elegant, attention-grabbing, organic pastel portfolio website designed to showcase your profound passion for dubbing, character voice acting, and vocal storytelling.

## 🌟 Highlights & Features

1. **Current Project Section in Main Dashboard (`#dashboard`):**
   - **Spotlight Project:** *Vocal Audition & Artistic Statement*
   - Embedded with your studio voiceover reflection recording (`assets/audio/navarasa_audition_jithesh_reddy.m4a`).
   - **Attention-Grabbing Headphone Instruction:** A prominent, animated banner recommending headphones or earphones for optimal vocal clarity, micro-pauses, and breath dynamics.

2. **Custom Interactive Audio Suite:**
   - **Play & Pause:** Tactile organic button with ripple animation.
   - **Replay:** One-click restart from `0:00`.
   - **Forward & Backward:** Skip forward (`+10s`) or rewind (`-10s`) effortlessly.
   - **Waveform Scrubber:** 64 interactive organic waveform bars showing real-time playback progress. Click anywhere along the waveform to seek.
   - **Real-Time Visualizer:** Organic canvas wave animation rendering fluid pastel sine harmonics that respond to playback.
   - **Speed Control:** Toggle between `1.0×`, `1.25×`, `1.5×`, and `0.75×`.
   - **Volume & Mute:** Custom volume slider and quick mute/unmute toggle.
   - **Keyboard Shortcuts:**
     - `Space` — Play / Pause
     - `←` / `→` — Rewind / Fast Forward 10 seconds
     - `R` — Replay from start
     - `M` — Mute / Unmute

3. **Multilingual Dubbing & Accents Section (`#languages`):**
   - Showcases authentic linguistic versatility across **7 languages**:
     - **Telugu (తెలుగు):** Native resonance, Telangana & Andhra vernaculars, mass & heroic monologues.
     - **Hindi (हिन्दी):** Commercial ads, web series, Pan-India cinema adaptation.
     - **Urdu (اردو):** Refined pronunciation (*Talaffuz*), poetic cadence, and Hyderabadi Deccani flavor.
     - **English:** Neutral Indian and global commercial narration, documentaries, and OTT.
     - **Tamil (தமிழ்):** Authentic inflection, Kollywood dubbing, and emotional intensity.
     - **Malayalam (മലയാളം):** Subtle naturalism, intimate mic technique, and indie realism.
     - **Kannada (ಕನ್ನಡ):** Resonant chest tones, Sandalwood action dramas, and period epics.

4. **Spoken Reflection & Philosophy Drawer:**
   - Expandable accordion featuring the full transcript of your reflection on the art of dubbing, cultural translation, singing resonance, and why natural human warmth is critical in our digital age.

5. **Emotional Range Spectrum & Voice Acting Demos (`#navarasa`):**
   - Individual mini audio players for all 7 English emotion demo recordings:
     - **Happiness (`happiness.m4a`):** Triumphant celebration, breathless excitement, dream internship acceptance.
     - **Sadness (`sadness.m4a`):** Emotional farewell, poignant pauses, tender nostalgia.
     - **Anger (`anger.m4a`):** Piercing indignation, confronting unfair credit, high vocal intensity.
     - **Fear (`fear.m4a`):** Tense whispered anxiety, footsteps in the dark, dying battery suspense.
     - **Disgust (`disgust.m4a`):** Visceral nasal revulsion, spoiled food reaction, sharp dismissal.
     - **Surprise (`surprise.m4a`):** Sudden high-pitch astonishment, meeting a friend after six years.
     - **Neutrality (`neutrality.m4a`):** Balanced, articulate daily routine narrative and clean diction.
   - Features quotation callouts, interactive seekable progress bars, and coordinated playback (playing one clip automatically pauses others).

6. **Services & Studio Specifications (`#experience`):**
   - Breakdown of dubbing, audiobooks, animation/gaming, and commercial narration services.
   - Studio technical specifications and collaboration inquiry form.

---

## 🚀 How to Open and View

### Option 1: Direct Open
Simply double-click [`index.html`](file:///c:/Users/jites/Documents/ProjectsInBtech/Activeprojects/JV/index.html) in Windows File Explorer to open it in your default web browser (Chrome, Edge, Firefox, Brave).

### Option 2: Run a Local Dev Server (Optional)
From PowerShell inside this folder:
```powershell
python -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.

---

## 📁 File Structure
```
JV/
├── index.html                                    # Main portfolio & dashboard
├── README.md                                     # Documentation
├── css/
│   └── style.css                                 # Organic pastel styling & animations
├── js/
│   └── player.js                                 # Main player & emotion mini players
└── assets/
    └── audio/
        ├── navarasa_audition_jithesh_reddy.m4a   # Main spoken reflection audio
        └── emotions/                             # 7 studio emotion demo tracks
            ├── happiness.m4a
            ├── sadness.m4a
            ├── anger.m4a
            ├── fear.m4a
            ├── disgust.m4a
            ├── surprise.m4a
            └── neutrality.m4a
```
