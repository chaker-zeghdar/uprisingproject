import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';
import Modal from '../components/Modal';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image_url: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data as Product[]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([formData]);
        if (error) throw error;
      }
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  function openModal(product?: Product) {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image_url: product.image_url || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        image_url: '',
      });
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingProduct(null);
  }

  if (loading) return <div className="flex h-96 items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Products</h2>
          <p className="text-zinc-500">Add, edit, and manage your store inventory.</p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-400">
                            <Package size={20} />
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-zinc-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 font-medium">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      product.stock > 10 ? "bg-emerald-50 text-emerald-700" :
                      product.stock > 0 ? "bg-amber-50 text-amber-700" :
                      "bg-red-50 text-red-700"
                    )}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500 max-w-xs truncate">{product.description}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openModal(product)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 h-24 w-full rounded-lg border border-zinc-200 bg-white p-4 text-sm outline-none focus:border-zinc-900"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700">Price</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">Stock</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-900"
            />
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="h-10 rounded-lg border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-800"
            >
              {editingProduct ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
