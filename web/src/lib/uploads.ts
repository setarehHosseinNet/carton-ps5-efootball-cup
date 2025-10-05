import { writeFile, mkdir } from "fs/promises";
import path from "path";

export type SavedMedia = { type: "IMAGE"|"VIDEO"; url: string };

export async function saveFilesFromForm(files: File[]): Promise<SavedMedia[]> {
  const dest = path.join(process.cwd(), "public", "uploads");
  await mkdir(dest, { recursive: true });

  const saved: SavedMedia[] = [];
  for (const f of files) {
    if (!f || !f.size) continue;
    const buf = Buffer.from(await f.arrayBuffer());
    const ext = (f.type?.startsWith("image/") ? ".jpg" :
                f.type?.startsWith("video/") ? ".mp4" : path.extname(f.name) || "");
    const name = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
    await writeFile(path.join(dest, name), buf);
    const type = f.type?.startsWith("video/") ? "VIDEO" : "IMAGE";
    saved.push({ type, url: `/uploads/${name}` });
  }
  return saved;
}
