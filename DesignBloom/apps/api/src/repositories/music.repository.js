import { querySql, runSql } from "../db/index.js";

function mapMusicTrack(row) {
  return {
    id: row.id,
    title: row.title,
    filename: row.filename,
    src: row.src,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function replaceMusicLibrary(tracks) {
  await runSql("DELETE FROM music;");

  for (const track of tracks) {
    const now = new Date().toISOString();

    await runSql(
      `
      INSERT INTO music (
        title,
        filename,
        src,
        sort_order,
        created_at,
        updated_at
      ) VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      );
    `,
      [track.title, track.filename, track.src, track.sortOrder, now, now],
    );
  }
}

export async function listMusicTracksFromRepository() {
  const rows = await querySql(
    `
    SELECT *
    FROM music
    ORDER BY sort_order ASC, id ASC;
  `,
  );

  return rows.map(mapMusicTrack);
}
