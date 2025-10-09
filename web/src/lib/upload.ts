import { mkdir, writeFile } from "fs/promises";
import { extname, join } from "path";
import { randomUUID } from "crypto";

const UP_BASE = join(process.cwd(), "public", "uploads");

export type SavedFile = { url: string; path: string; type: "IMAGE"|"VIDEO"; width?: number; height?: number; duration?: number };

export async function saveFilesFromForm(files: File[]): Promise<SavedFile[]> {
  const today = new Date();
  const dir = join(UP_BASE, `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`);
  await mkdir(dir, { recursive: true });

  const saved: SavedFile[] = [];
  for (const f of files) {
    if (!f.size) continue;
    const buf = Buffer.from(await f.arrayBuffer());
    if (buf.length > 50 * 1024 * 1024) { // 50MB
      throw new Error("حجم فایل بیش از حد مجاز است.");
    }

    const mime = f.type || "";
    const isImage = mime.startsWith("image/");
    const isVideo = mime.startsWith("video/");
    if (!isImage && !isVideo) continue;

    const ext = extname(f.name) || (isImage ? ".jpg" : ".mp4");
    const filename = `${randomUUID()}${ext}`;
    const full = join(dir, filename);
    await writeFile(full, buf);

    const url = `/uploads/${dir.split("uploads\\").pop()?.replace(/\\/g,"/")}/${filename}`;
    saved.push({ url, path: full, type: isImage ? "IMAGE" : "VIDEO" });
  }
  return saved;
}
