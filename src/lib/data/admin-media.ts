import { ref, uploadBytesResumable, getDownloadURL, listAll, getMetadata, deleteObject } from "firebase/storage";
import { addDoc, collection, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { storage, db } from "@/lib/firebase/client";
import type { MediaItem } from "@/types";

export type UploadFolder = "news-images" | "uploads";

export function uploadFile(
  file: File,
  folder: UploadFolder,
  uploadedBy: string,
  onProgress?: (percent: number) => void
): Promise<{ url: string; path: string }> {
  return new Promise((resolve, reject) => {
    const extension = file.name.split(".").pop();
    const fileName = `${nanoid(12)}.${extension}`;
    const path = `${folder}/${fileName}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file, { contentType: file.type });

    task.on(
      "state_changed",
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(percent);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);

        try {
          await addDoc(collection(db, "media"), {
            url,
            path,
            type: file.type.startsWith("video") ? "video" : "image",
            fileName: file.name,
            sizeBytes: file.size,
            uploadedBy,
            createdAt: serverTimestamp(),
          });
        } catch {
          // media index entry failed but upload succeeded — non-fatal
        }

        resolve({ url, path });
      }
    );
  });
}

export async function listMediaFromStorage(): Promise<MediaItem[]> {
  const folders: UploadFolder[] = ["news-images", "uploads"];
  const items: MediaItem[] = [];

  for (const folder of folders) {
    const folderRef = ref(storage, folder);
    const result = await listAll(folderRef);
    for (const itemRef of result.items) {
      const [url, metadata] = await Promise.all([getDownloadURL(itemRef), getMetadata(itemRef)]);
      items.push({
        id: itemRef.fullPath,
        url,
        path: itemRef.fullPath,
        type: metadata.contentType?.startsWith("video") ? "video" : "image",
        fileName: itemRef.name,
        sizeBytes: metadata.size,
        uploadedBy: metadata.customMetadata?.uploadedBy || "",
        createdAt: new Date(metadata.timeCreated),
      });
    }
  }

  return items.sort((a, b) => new Date(b.createdAt as Date).getTime() - new Date(a.createdAt as Date).getTime());
}

export async function deleteMediaItem(path: string, docId?: string): Promise<void> {
  await deleteObject(ref(storage, path));
  if (docId) {
    try {
      await deleteDoc(doc(db, "media", docId));
    } catch {
      // ignore if index doc missing
    }
  }
}
