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

export async function importProjects(projects: ProjectFile[]): Promise<number> {
  const db = await openDb();
  let count = 0;
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    for (const project of projects) {
      if (!project.name || !Array.isArray(project.objects)) continue;
      store.put(project);
      count++;
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return count;
}

export async function deleteProject(name: string) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(name);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function renameProject(oldName: string, newName: string) {
  newName = newName.trim();
  if (!newName) throw new Error("Enter a project name.");
  if (oldName === newName) return;
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite"), store = tx.objectStore(STORE);
      let failure: Error | undefined;
      const abort = (message: string) => { failure = new Error(message); tx.abort(); };
      const source = store.get(oldName);
      source.onsuccess = () => {
        const project = source.result as ProjectFile | undefined;
        if (!project) { abort("The project no longer exists."); return; }
        const destination = store.get(newName);
        destination.onsuccess = () => {
          if (destination.result) { abort(`A project named "${newName}" already exists. Choose another name.`); return; }
          store.add({ ...project, name: newName, updatedAt: new Date().toISOString() });
          store.delete(oldName);
        };
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(failure ?? tx.error ?? new Error("Project rename failed."));
      tx.onabort = () => reject(failure ?? tx.error ?? new Error("Project rename was cancelled."));
    });
  } finally { db.close(); }
}
