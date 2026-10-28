import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const uploadsDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../uploads"
);

export function getStoredImagePath(storageKey) {
  if (!storageKey || path.basename(storageKey) !== storageKey) return null;
  return path.join(uploadsDirectory, storageKey);
}

export async function removeUploadedFiles(files = []) {
  await Promise.all(
    files.map((file) =>
      fs.unlink(file.path).catch((error) => {
        if (error.code !== "ENOENT") throw error;
      })
    )
  );
}
