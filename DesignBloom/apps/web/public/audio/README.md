Put your music files in this folder.

The backend now scans this folder and syncs the file list into the `music` table.
The player title shown on the homepage comes from the filename without the extension.

Default player sources:
- /audio/after-hours-system.mp3
- /audio/clarity-in-motion.mp3
- /audio/midnight-interface.mp3

You can keep these filenames, or edit the playlist in:
- apps/web/src/content/home-content.js

Recommended formats:
- .mp3
- .wav
- .ogg
- .flac
