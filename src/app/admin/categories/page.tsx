"use client";
import React, { useEffect, useState } from 'react';
import AdminLayout from "@/components/AdminLayout";
import Modal from "react-modal";
import "../styles/modal.css";

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/categories');
    const json = await res.json();
    setCategories(Array.isArray(json) ? json : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCatName }),
    });
    if (res.ok) {
      setNewCatName("");
      load();
    } else {
      alert("Failed to add category");
    }
  }

  function openDeleteModal(cat: Category) {
    setCategoryToDelete(cat);
    setIsModalOpen(true);
  }

  function closeDeleteModal() {
    setCategoryToDelete(null);
    setIsModalOpen(false);
  }

  async function confirmDelete() {
    if (categoryToDelete) {
      const res = await fetch(`/api/categories/${categoryToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        load();
      } else {
        alert('Delete failed');
      }
      closeDeleteModal();
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-cyan-700 mb-6">Manage Categories</h1>

        <form onSubmit={handleAddCategory} className="mb-8 flex gap-4">
          <input
            type="text"
            placeholder="New category name..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-400"
          />
          <button type="submit" className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700">
            Add
          </button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full table-auto bg-slate-800 rounded shadow text-slate-100">
            <thead className="text-left bg-slate-700">
              <tr>
                <th className="px-4 py-2 text-slate-300">ID</th>
                <th className="px-4 py-2 text-slate-300">Name</th>
                <th className="px-4 py-2 text-slate-300">Slug</th>
                <th className="px-4 py-2 text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-t border-slate-600 hover:bg-slate-700/50">
                  <td className="px-4 py-2 text-slate-300">{c.id}</td>
                  <td className="px-4 py-2 font-semibold">{c.name}</td>
                  <td className="px-4 py-2 text-slate-400">{c.slug}</td>
                  <td className="px-4 py-2">
                    <button className="text-sm text-red-400 hover:text-red-300" onClick={() => openDeleteModal(c)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Category"
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <h2 className="text-2xl font-bold mb-4 text-red-600">Confirm Deletion</h2>
        <p className="mb-6 text-gray-700">Are you sure you want to delete the category <span className="font-semibold">"{categoryToDelete?.name}"</span>? This will also delete or impact games assigned to it!</p>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={closeDeleteModal} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
          <button type="button" onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
