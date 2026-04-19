'use client';

import { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';

type MediaItem = {
  id: number;
  filename: string;
  path: string;
  altText: string | null;
  size: number | null;
  createdAt: string;
};

function formatBytes(bytes: number | null) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [altText, setAltText] = useState('');
  const [copied, setCopied] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAlt, setEditAlt] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/media');
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function uploadFile(file: File) {
    setUploading(true);
    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, data, altText }),
    });
    if (res.ok) {
      setAltText('');
      await load();
    } else {
      alert('Upload failed');
    }
    setUploading(false);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) await uploadFile(file);
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm(`Delete "${item.filename}"?`)) return;
    await fetch(`/api/media/${item.id}`, { method: 'DELETE' });
    await load();
  }

  async function saveAlt(id: number) {
    await fetch(`/api/media/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ altText: editAlt }),
    });
    setEditingId(null);
    await load();
  }

  function copyPath(item: MediaItem) {
    navigator.clipboard.writeText(item.path);
    setCopied(item.id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-cyan-400 mb-6">Media Library</h1>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 mb-8 text-center transition-colors ${dragOver ? 'border-cyan-400 bg-cyan-900/20' : 'border-slate-600 bg-slate-800/50'}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="text-4xl mb-3">🖼️</div>
          <p className="text-slate-300 mb-4">Drag & drop an image here, or click to browse</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
            <input
              type="text"
              placeholder="Alt text (optional)"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="flex-1 border border-slate-600 bg-slate-700 text-slate-100 px-3 py-2 rounded placeholder-slate-400 text-sm w-full"
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded font-semibold text-sm disabled:opacity-50 whitespace-nowrap"
            >
              {uploading ? 'Uploading…' : 'Choose Image'}
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>

        {/* Gallery */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-slate-700 rounded-xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-slate-400 text-center py-16">No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 group">
                {/* Image Preview */}
                <div className="relative aspect-square bg-slate-900">
                  <Image src={item.path} alt={item.altText || item.filename} fill className="object-cover" sizes="200px" />
                </div>

                {/* Info + Actions */}
                <div className="p-2 space-y-2">
                  <p className="text-slate-400 text-[10px] truncate" title={item.filename}>{item.filename}</p>
                  {formatBytes(item.size) && (
                    <p className="text-slate-500 text-[10px]">{formatBytes(item.size)}</p>
                  )}

                  {/* Alt text */}
                  {editingId === item.id ? (
                    <div className="flex gap-1">
                      <input
                        autoFocus
                        value={editAlt}
                        onChange={(e) => setEditAlt(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveAlt(item.id); if (e.key === 'Escape') setEditingId(null); }}
                        className="flex-1 text-[10px] bg-slate-700 border border-slate-500 text-slate-100 px-1 py-0.5 rounded"
                      />
                      <button onClick={() => saveAlt(item.id)} className="text-[10px] text-cyan-400 hover:text-cyan-300">✓</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingId(item.id); setEditAlt(item.altText || ''); }}
                      className="text-[10px] text-slate-500 hover:text-slate-300 truncate w-full text-left"
                      title={item.altText || 'Add alt text'}
                    >
                      {item.altText ? `Alt: ${item.altText}` : '+ Add alt text'}
                    </button>
                  )}

                  {/* Actions */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => copyPath(item)}
                      className={`flex-1 text-[10px] font-semibold py-1 rounded transition-colors ${copied === item.id ? 'bg-green-600 text-white' : 'bg-slate-700 text-cyan-400 hover:bg-slate-600'}`}
                    >
                      {copied === item.id ? '✓ Copied!' : 'Copy URL'}
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-[10px] px-2 py-1 rounded bg-slate-700 text-red-400 hover:bg-red-900/40"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
