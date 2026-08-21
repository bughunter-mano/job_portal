import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar.jsx';
import api from '../../services/api';
import DeleteConfirmModal from '../../components/DeleteConfirmModal.jsx';

const LIMITS = {
  name: 100,
  about: 500,
  order: 9999
};

function CharCounter({ current = 0, max }) {
  const pct = current / max;
  const color = pct >= 1 ? 'text-red-500' : pct >= 0.85 ? 'text-gold-dark' : 'text-muted';
  return (
    <p className={`font-mono text-[10px] mt-0.5 text-right ${color}`}>
      {current} / {max}
    </p>
  );
}

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, title: '' });

  const [form, setForm] = useState({
    name: '',
    logo: '',
    about: '',
    order: 0
  });

  const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  function loadClients() {
    setLoading(true);
    api.get('/clients')
      .then((res) => setClients(res.data.clients || []))
      .catch((err) => setError('Failed to fetch clients.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadClients();
  }, []);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Size check: limit to 2MB for logos
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo image must be under 2MB.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.post('/admin/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm((prev) => ({ ...prev, logo: res.data.url }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  function handleOpenCreate() {
    setEditingId(null);
    setForm({ name: '', logo: '', about: '', order: 0 });
    setError('');
    setShowModal(true);
  }

  function handleOpenEdit(client) {
    setEditingId(client.id);
    setForm({
      name: client.name || '',
      logo: client.logo || '',
      about: client.about || '',
      order: client.order || 0
    });
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (form.name.trim().length < 2) {
      setError('Client name must be at least 2 characters.');
      return;
    }

    const nameRegex = /^[a-zA-Z0-9\s\-\.\&]+$/;
    if (!nameRegex.test(form.name.trim())) {
      setError('Client Name contains invalid characters. Only letters, numbers, spaces, dots, hyphens, and ampersands are allowed.');
      return;
    }

    if (form.about.trim() && /[<>]/g.test(form.about)) {
      setError('About description cannot contain HTML tags or angle brackets (<, >).');
      return;
    }

    if (form.order < 0 || form.order > LIMITS.order) {
      setError(`Display order must be between 0 and ${LIMITS.order}.`);
      return;
    }

    try {
      if (editingId) {
        await api.put(`/clients/${editingId}`, form);
      } else {
        await api.post('/clients', form);
      }
      setShowModal(false);
      loadClients();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  }

  function handleDeleteClick(id, title) {
    setDeleteConfirm({ show: true, id, title });
  }

  async function handleConfirmDelete() {
    const { id } = deleteConfirm;
    try {
      await api.delete(`/clients/${id}`);
      loadClients();
    } catch (err) {
      alert('Failed to delete client');
    } finally {
      setDeleteConfirm({ show: false, id: null, title: '' });
    }
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold font-display text-ink">Clients</h1>
            <p className="text-muted text-sm mt-1">Manage client logos, information, and priority ordering on the landing page.</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="bg-ink text-paper px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-teal transition-colors"
          >
            + Add Client
          </button>
        </div>

        {loading ? (
          <p className="text-muted">Loading clients...</p>
        ) : (
          <div className="overflow-x-auto border border-hair rounded-xl bg-white shadow-sm">
            <table className="w-full text-sm text-ink">
              <thead className="bg-teal-light text-left font-mono uppercase text-xs tracking-wider text-teal">
                <tr>
                  <th className="p-4 border-b border-hair">Logo</th>
                  <th className="p-4 border-b border-hair">Name</th>
                  <th className="p-4 border-b border-hair">About</th>
                  <th className="p-4 border-b border-hair">Display Order</th>
                  <th className="p-4 border-b border-hair">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hair">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-teal-light/20 transition-colors">
                    <td className="p-4">
                      {client.logo ? (
                        <img
                          src={client.logo.startsWith('http') ? client.logo : `${BASE_URL}${client.logo}`}
                          alt={client.name}
                          className="h-10 w-24 object-contain bg-paper p-1 border rounded"
                        />
                      ) : (
                        <div className="h-10 w-24 flex items-center justify-center text-xs text-muted bg-paper rounded border border-dashed font-mono">
                          No Logo
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-semibold">{client.name}</td>
                    <td className="p-4 max-w-xs truncate text-muted">{client.about || '-'}</td>
                    <td className="p-4 font-mono text-teal font-semibold">{client.order}</td>
                    <td className="p-4">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleOpenEdit(client)}
                          className="text-teal hover:underline font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(client.id, client.name)}
                          className="text-red-600 hover:underline font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {clients.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-muted font-medium">
                      No clients found. Add some clients to display on the public website.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-paper border border-hair rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl relative animate-in fade-in zoom-in duration-200">
              <h2 className="text-xl font-bold font-display text-ink mb-4">
                {editingId ? 'Edit Client' : 'Add New Client'}
              </h2>
              {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-xs font-semibold">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-muted block mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    maxLength={LIMITS.name}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-hair rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-teal text-sm"
                    placeholder="e.g. ApexCorp"
                  />
                  <CharCounter current={form.name.length} max={LIMITS.name} />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-muted block mb-1">Logo Image (Max 2MB)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-mono file:bg-teal-light file:text-teal hover:file:bg-teal/20 cursor-pointer"
                    />
                    {uploading && <span className="text-xs text-teal font-mono animate-pulse">Uploading...</span>}
                  </div>
                  {form.logo && (
                    <div className="mt-2 p-2 border border-hair rounded bg-white w-32 h-16 flex items-center justify-center">
                      <img
                        src={form.logo.startsWith('http') ? form.logo : `${BASE_URL}${form.logo}`}
                        alt="Logo preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-muted block mb-1">About / Description</label>
                  <textarea
                    rows="3"
                    maxLength={LIMITS.about}
                    value={form.about}
                    onChange={(e) => setForm({ ...form, about: e.target.value })}
                    className="w-full border border-hair rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-teal text-sm"
                    placeholder="Short description of client services..."
                  />
                  <CharCounter current={form.about.length} max={LIMITS.about} />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-muted block mb-1">Display Order (e.g. 1 shows first)</label>
                  <input
                    type="number"
                    min="0"
                    max={LIMITS.order}
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full border border-hair rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-teal text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-hair">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-full border border-hair text-muted text-sm font-semibold hover:bg-teal-light/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-ink text-paper text-sm font-semibold hover:bg-teal transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          show={deleteConfirm.show}
          title={deleteConfirm.title}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm({ show: false, id: null, title: '' })}
        />
      </main>
    </div>
  );
}
