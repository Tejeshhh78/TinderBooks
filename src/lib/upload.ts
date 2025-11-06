import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ACCEPTED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function saveUploadedFile(file: File, subdir: "profile" | "books") {
  if (!ACCEPTED_MIME.has(file.type)) {
    throw new Error("Unsupported file type. Please upload a JPEG, PNG or WEBP image.");
  }

  const uploadsDir = join(process.cwd(), "public", "uploads", subdir);
  await mkdir(uploadsDir, { recursive: true });

  const ext = mimeToExt(file.type);
  const fileName = `${randomUUID()}.${ext}`;
  const filePath = join(uploadsDir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await writeFile(filePath, buffer);

  const publicPath = `/uploads/${subdir}/${fileName}`;
  return publicPath;
}

function mimeToExt(mime: string) {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "bin";
  }
}
