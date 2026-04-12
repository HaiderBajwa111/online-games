"use client";
import React, { useEffect, useState } from 'react';
import Modal from "react-modal";
import AdminLayout from "@/components/AdminLayout";
import KeywordInput from "@/components/KeywordInput";
import dynamic from 'next/dynamic';
import "react-quill-new/dist/quill.snow.css";
import "./styles/modal.css";

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

type Game = {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: number;
  category: { id: number; name: string; slug: string; };
  image: string;
  iframeUrl: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  metaOgTitle: string;
  metaOgDescription: string;
  imageAltText: string;
};

export default function AdminPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<{id:number, name:string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  // Define state for edit modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null);
  const [editedName, setEditedName] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch('/api/games');
    const json = await res.json();
    setGames(Array.isArray(json) ? json : []);
    const catRes = await fetch('/api/categories');
    const catJson = await catRes.json();
    setCategories(Array.isArray(catJson) ? catJson : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openDeleteModal(game: Game) {
    setGameToDelete(game);
    setIsModalOpen(true);
  }

  function closeDeleteModal() {
    setGameToDelete(null);
    setIsModalOpen(false);
  }

  async function confirmDelete() {
    if (gameToDelete) {
      const res = await fetch(`/api/games/${encodeURIComponent(gameToDelete.id)}`, { method: 'DELETE' });
      if (res.ok) {
        load();
      } else {
        alert('Delete failed');
      }
      closeDeleteModal();
    }
  }

  function openEditModal(game: Game) {
    setGameToEdit({
      ...game,
      slug: game.slug || "", // Ensure slug is set correctly
    });
    setEditedName(game.name);
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setGameToEdit(null);
    setEditedName("");
    setIsEditModalOpen(false);
  }

  async function confirmEdit() {
    if (gameToEdit) {
      const res = await fetch(`/api/games/${encodeURIComponent(gameToEdit?.id || '')}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedName,
          slug: gameToEdit?.slug, // Include updated slug in the request body
          description: gameToEdit?.description,
          image: gameToEdit?.image,
          imageAltText: gameToEdit?.imageAltText,
          iframeUrl: gameToEdit?.iframeUrl,
          categoryId: String(gameToEdit?.categoryId),
          meta: {
            title: gameToEdit?.metaTitle,
            description: gameToEdit?.metaDescription,
            keywords: gameToEdit?.metaKeywords,
            ogTitle: gameToEdit?.metaOgTitle,
            ogDescription: gameToEdit?.metaOgDescription,
          },
        }),
      });
      if (res.ok) {
        load();
      } else {
        alert('Update failed');
      }
      closeEditModal();
    }
  }

  const [uploading, setUploading] = useState(false);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-cyan-700">Admin Panel</h1>
          <a className="text-sm text-cyan-600" href="/admin/add">Add game</a>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full table-auto bg-slate-800 rounded shadow text-slate-100">
            <thead className="text-left bg-slate-700">
              <tr>
                <th className="px-4 py-2 text-slate-300">ID</th>
                <th className="px-4 py-2 text-slate-300">Name</th>
                <th className="px-4 py-2 text-slate-300">Category</th>
                <th className="px-4 py-2 text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(games) && games.map((g) => (
                <tr key={g.id} className="border-t border-slate-600 hover:bg-slate-700/50">
                  <td className="px-4 py-2 text-slate-300">{g.id}</td>
                  <td className="px-4 py-2">{g.name}</td>
                  <td className="px-4 py-2 text-slate-300">{g.category?.name}</td>
                  <td className="px-4 py-2">
                    <button className="text-sm text-cyan-400 mr-2 hover:text-cyan-300" onClick={() => openEditModal(g)}>Edit</button>
                    <button className="text-sm text-red-400 hover:text-red-300" onClick={() => openDeleteModal(g)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Game"
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="text-2xl font-bold mb-4 text-red-600">Confirm Deletion</h2>
        <p className="mb-6 text-gray-700">Are you sure you want to delete the game <span className="font-semibold">"{gameToDelete?.name}"</span>? This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={closeDeleteModal} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
          <button type="button" onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Game"
        className="modal edit-modal"
        overlayClassName="overlay"
      >
        <h2 className="text-2xl font-bold mb-4">Edit Game</h2>
        <form onSubmit={(e) => { e.preventDefault(); confirmEdit(); }} className="space-y-4 bg-slate-800 p-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">Name</label>
            <input
              id="name"
              name="name"
              placeholder="Name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-400"
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-slate-300">Slug</label>
            <input
              id="slug"
              name="slug"
              placeholder="Slug"
              value={gameToEdit?.slug || ''}
              onChange={(e) => setGameToEdit(prev => prev ? { ...prev, slug: e.target.value } : null)}
              className="w-full border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-400"
            />
          </div>
          <div>
            <label htmlFor="iframeUrl" className="block text-sm font-medium text-slate-300">Iframe URL</label>
            <input
              id="iframeUrl"
              name="iframeUrl"
              placeholder="Iframe URL"
              value={gameToEdit?.iframeUrl || ''}
              onChange={(e) => setGameToEdit(prev => prev ? { ...prev, iframeUrl: e.target.value } : null)}
              className="w-full border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <div className="bg-slate-700 rounded">
              <ReactQuill
                theme="snow"
                value={gameToEdit?.description || ''}
                onChange={(val: string) => setGameToEdit(prev => prev ? { ...prev, description: val } : null)}
                className="h-48 mb-12 border-gray-300"
              />
            </div>
          </div>
          <div>
            <label htmlFor="imageUpload" className="block text-sm font-medium text-slate-300">Upload New Image</label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                const data = await new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(String(reader.result));
                  reader.onerror = reject;
                  reader.readAsDataURL(file);
                });
                const base64 = data.split(',')[1];
                const res = await fetch('/api/upload', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ filename: file.name, data: base64 }),
                });
                const json = await res.json();
                if (res.ok && json.path) {
                  setGameToEdit((prev) => prev ? { ...prev, image: json.path } : null);
                } else {
                  alert('Image upload failed');
                }
                setUploading(false);
              }}
              className="w-full border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-400"
            />
            {uploading && <p className="text-sm text-slate-400">Uploading...</p>}
          </div>
          <div>
            <label htmlFor="imageAltText" className="block text-sm font-medium text-slate-300">Image Alt Text</label>
            <input
              id="imageAltText"
              name="imageAltText"
              placeholder="Image Alt Text"
              value={gameToEdit?.imageAltText || ''}
              onChange={(e) => setGameToEdit(prev => prev ? { ...prev, imageAltText: e.target.value } : null)}
              className="w-full border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-400"
            />
          </div>
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-slate-300">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              value={gameToEdit?.categoryId || ''}
              onChange={(e) => setGameToEdit(prev => prev ? { ...prev, categoryId: Number(e.target.value) } : null)}
              className="w-full border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-400"
            >
              <option value="">Select Category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
            <KeywordInput
              value={gameToEdit?.metaKeywords || ''}
              onChange={(val: string) => setGameToEdit(prev => prev ? { ...prev, metaKeywords: val } : null)}
              placeholder="Enter Keywords..."
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={closeEditModal} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
            <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700">Save</button>
          </div>
        </form>
      </Modal>
    </AdminLayout >
  );
}
