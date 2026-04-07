import { listMusicTracks } from "../services/music.service.js";
import { sendJson } from "../utils/response.js";

export async function handleMusic({ res }) {
  const tracks = await listMusicTracks();

  sendJson(res, 200, {
    status: "ok",
    count: tracks.length,
    tracks,
  });
}
