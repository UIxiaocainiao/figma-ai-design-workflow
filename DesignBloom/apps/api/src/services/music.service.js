import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  listMusicTracksFromRepository,
  replaceMusicLibrary,
} from "../repositories/music.repository.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const audioDir = path.resolve(currentDir, "../../../web/public/audio");
const supportedAudioExtensions = new Set([".mp3", ".wav", ".ogg", ".m4a", ".flac"]);

function compareFilenames(left, right) {
  return left.localeCompare(right, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function createTrackFromFilename(filename, sortOrder) {
  return {
    title: path.parse(filename).name,
    filename,
    src: `/audio/${encodeURIComponent(filename)}`,
    sortOrder,
  };
}

async function readAudioFilenames() {
  try {
    const entries = await readdir(audioDir, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((filename) => supportedAudioExtensions.has(path.extname(filename).toLowerCase()))
      .sort(compareFilenames);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function syncMusicLibrary() {
  const filenames = await readAudioFilenames();

  if (filenames.length === 0) {
    return listMusicTracksFromRepository();
  }

  const tracks = filenames.map((filename, index) => createTrackFromFilename(filename, index));

  await replaceMusicLibrary(tracks);

  return tracks;
}

export async function listMusicTracks() {
  const tracks = await listMusicTracksFromRepository();

  if (tracks.length > 0) {
    return tracks;
  }

  await syncMusicLibrary();
  return listMusicTracksFromRepository();
}
