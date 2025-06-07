"use client";

import { useEffect, useState } from 'react';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from '@/lib/firebaseClient';
import { RoleGate } from '@/components/auth/RoleGate';

interface BackupFile { name: string; url: string; }

export default function BackupsPage() {
  const [files, setFiles] = useState<BackupFile[]>([]);

  useEffect(() => {
    const load = async () => {
      const list = await listAll(ref(storage, 'backups'));
      const items = await Promise.all(
        list.items.map(async item => ({ name: item.name, url: await getDownloadURL(item) }))
      );
      setFiles(items);
    };
    load();
  }, []);

  return (
    <RoleGate allowed={["ADMIN"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">Backups</h1>
        <ul className="list-disc pl-6 space-y-2">
          {files.map(f => (
            <li key={f.name}>
              <a href={f.url} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                {f.name}
              </a>
            </li>
          ))}
          {files.length === 0 && <li>Nenhum backup encontrado.</li>}
        </ul>
      </div>
    </RoleGate>
  );
}
