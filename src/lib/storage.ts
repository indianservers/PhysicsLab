import { ProjectFile } from "../types";

const DB_NAME = "physicslab-100";
const STORE = "projects";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE, { keyPath: "name" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveProject(project: ProjectFile) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(project);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function listProjects(): Promise<ProjectFile[]> {
  const db = await openDb();
  const projects = await new Promise<ProjectFile[]>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).getAll();
    request.onsuccess = () => resolve(request.result as ProjectFile[]);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
