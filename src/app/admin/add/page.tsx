'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import KeywordInput from '@/components/KeywordInput';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function AddGame() {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    imageAltText: '',
    iframeUrl: '',
    categoryId: '',
    meta: { title: '', description: '', keywords: '', ogTitle: '', ogDescription: '' },
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fileKey, setFileKey] = useState(Date.now());
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    if (name.startsWith('meta.')) {
      setForm((p) => ({ ...p, meta: { ...p.meta, [name.replace('meta.', '')]: value } }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const payload = { ...form };
    const res = await fetch('/api/games', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setMessage('✅ Game added successfully!');
      setForm({
        name: '',
        slug: '',
        description: '',
        image: '',
        imageAltText: '',
        iframeUrl: '',
        categoryId: '',
        meta: { title: '', description: '', keywords: '', ogTitle: '', ogDescription: '' },
      });
      setFileKey(Date.now());
      setTimeout(() => setMessage(''), 4000);
    } else {
      setMessage('❌ Failed to add game');
      setTimeout(() => setMessage(''), 4000);
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto py-8">
        <h2 className="text-xl font-semibold mb-4 text-slate-100">Add Game</h2>
        <form onSubmit={onSubmit} className="space-y-4 bg-slate-800 p-4 rounded">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded placeholder-slate-400" />
          <input name="slug" placeholder="Slug (optional)" value={form.slug} onChange={handleChange} className="w-full border p-2 mt-2 mb-4" />
          <div className="bg-slate-700 rounded">
            <ReactQuill theme="snow" value={form.description} onChange={(val: string) => setForm(p => ({ ...p, description: val }))} placeholder="Rich Text Description..." className="h-48 mb-12" />
          </div>
          <div>
            <label className="block mb-1 text-slate-300">Image (URL or upload)</label>
            <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="w-full border p-2 mb-2" />
            <input key={fileKey} type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              // read as base64
              const data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result));
                reader.onerror = reject;
                reader.readAsDataURL(file);
              });
              // strip prefix
              const base64 = data.split(',')[1];
              const res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: file.name, data: base64 }) });
              const json = await res.json();
              if (res.ok && json.path) {
                setForm((p) => ({ ...p, image: json.path }));
              } else {
                alert('Upload failed');
              }
              setUploading(false);
            }} />
            {uploading && <p className="text-sm text-slate-400">Uploading...</p>}
          </div>
          <input name="iframeUrl" placeholder="Iframe URL" value={form.iframeUrl} onChange={handleChange} className="w-full border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded placeholder-slate-400" />
          <select name="categoryId" value={form.categoryId} onChange={(e: any) => handleChange(e)} className="w-full border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded">
            <option value="">Select a Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input name="meta.title" placeholder="Meta title" value={form.meta.title} onChange={handleChange} className="w-full border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded placeholder-slate-400" />
            <input name="meta.description" placeholder="Meta desc" value={form.meta.description} onChange={handleChange} className="w-full border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded placeholder-slate-400" />
            <KeywordInput value={form.meta.keywords} onChange={(val) => setForm(p => ({ ...p, meta: { ...p.meta, keywords: val } }))} placeholder="Keywords (press Enter)" />
            <input name="imageAltText" placeholder="Image Alt Text" value={form.imageAltText} onChange={handleChange} className="w-full border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded placeholder-slate-400" />
          </div>
          <button className="bg-cyan-600 hover:bg-cyan-500 transition-colors text-white px-6 py-2 rounded font-bold shadow-lg shadow-cyan-500/20">{loading ? 'Adding...' : 'Add Game'}</button>
          
          {message && (
            <div className={`mt-4 p-4 rounded text-white font-medium ${message.includes('✅') ? 'bg-emerald-600' : 'bg-red-600'} animate-pulse`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}
