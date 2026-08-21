import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar.jsx';
import api from '../../services/api';
import DeleteConfirmModal from '../../components/DeleteConfirmModal.jsx';

const LIMITS = {
  title: 100,
  description: 1000,
  techStack: 255,
  link: 255,
  order: 9999
};

const TECH_OPTIONS = [
  'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte',
  'HTML5', 'CSS3', 'TailwindCSS', 'Bootstrap',
  'JavaScript', 'TypeScript', 'Redux', 'Zustand',
  'Node.js', 'Express', 'NestJS', 'Python', 'Django',
  'FastAPI', 'Flask', 'Golang', 'Java', 'Spring Boot',
  'Ruby on Rails', 'PHP', 'Laravel', 'gRPC',
  'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis',
  'Cassandra', 'Elasticsearch', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'GCP', 'Terraform', 'Git', 'CI/CD',
  'React Native', 'Flutter', 'Swift', 'Kotlin'
];

function CharCounter({ current = 0, max }) {
  const pct = current / max;
  const color = pct >= 1 ? 'text-red-500' : pct >= 0.85 ? 'text-gold-dark' : 'text-muted';
  return (
    <p className={`font-mono text-[10px] mt-0.5 text-right ${color}`}>
      {current} / {max}
    </p>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, title: '' });
  const [showCustomTech, setShowCustomTech] = useState(false);
  const [customTech, setCustomTech] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    techStack: '',
    link: '',
    order: 0
  });

  const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  function loadProjects() {
    setLoading(true);
    api.get('/projects')
      .then((res) => setProjects(res.data.projects || []))
      .catch((err) => setError('Failed to fetch projects.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Project showcase image must be under 10MB.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.post('/admin/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm((prev) => ({ ...prev, image: res.data.url }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  function handleOpenCreate() {
    setEditingId(null);
    setForm({ title: '', description: '', image: '', techStack: '', link: '', order: 0 });
    setError('');
    setShowModal(true);
  }

  function handleOpenEdit(project) {
    setEditingId(project.id);
    setForm({
      title: project.title || '',
      description: project.description || '',
      image: project.image || '',
      techStack: project.techStack || '',
      link: project.link || '',
      order: project.order || 0
    });
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (form.title.trim().length < 3) {
      setError('Project title must be at least 3 characters.');
      return;
    }

    const titleRegex = /^[a-zA-Z0-9\s\-\.\,\&\(\)\#\+]+$/;
    if (!titleRegex.test(form.title.trim())) {
      setError('Project Title contains invalid characters. Only letters, numbers, spaces, and basic symbols are allowed.');
      return;
    }

    if (form.description.trim() && /[<>]/g.test(form.description)) {
      setError('Description cannot contain HTML tags or angle brackets (<, >).');
      return;
    }

    if (form.techStack.trim()) {
      const techRegex = /^[a-zA-Z0-9\s\-\.\,\&\#\+]+$/;
      if (!techRegex.test(form.techStack.trim())) {
        setError('Tech Stack contains invalid characters. Only alphanumeric tags, commas, spaces, and basic symbols are allowed.');
        return;
      }
    }

    if (form.order < 0 || form.order > LIMITS.order) {
      setError(`Display order must be between 0 and ${LIMITS.order}.`);
      return;
    }

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, form);
      } else {
        await api.post('/projects', form);
      }
      setShowModal(false);
      loadProjects();
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
      await api.delete(`/projects/${id}`);
      loadProjects();
    } catch (err) {
      alert('Failed to delete project');
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
            <h1 className="text-2xl font-bold font-display text-ink">Projects</h1>
            <p className="text-muted text-sm mt-1">Manage project portfolios, tech stacks, external links, and display order.</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="bg-ink text-paper px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-teal transition-colors"
          >
            + Add Project
          </button>
        </div>

        {loading ? (
          <p className="text-muted">Loading projects...</p>
        ) : (
          <div className="overflow-x-auto border border-hair rounded-xl bg-white shadow-sm">
            <table className="w-full text-sm text-ink">
              <thead className="bg-teal-light text-left font-mono uppercase text-xs tracking-wider text-teal">
                <tr>
                  <th className="p-4 border-b border-hair">Showcase Image</th>
                  <th className="p-4 border-b border-hair">Title</th>
                  <th className="p-4 border-b border-hair">Tech Stack</th>
                  <th className="p-4 border-b border-hair">Display Order</th>
                  <th className="p-4 border-b border-hair">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hair">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-teal-light/20 transition-colors">
                    <td className="p-4">
                      {project.image ? (
                        <img
                          src={project.image.startsWith('http') ? project.image : `${BASE_URL}${project.image}`}
                          alt={project.title}
                          className="h-10 w-16 object-cover bg-paper border rounded"
                        />
                      ) : (
                        <div className="h-10 w-16 flex items-center justify-center text-xs text-muted bg-paper rounded border border-dashed font-mono">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold">{project.title}</div>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-teal hover:underline block mt-0.5 truncate max-w-xs"
                        >
                          {project.link}
                        </a>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {project.techStack ? (
                          project.techStack.split(',').map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded bg-teal/10 text-teal text-xs font-mono">
                              {tag.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-teal font-semibold">{project.order}</td>
                    <td className="p-4">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="text-teal hover:underline font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(project.id, project.title)}
                          className="text-red-600 hover:underline font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-muted font-medium">
                      No projects found. Add some projects to showcase your portfolio.
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
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h2>
              {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-xs font-semibold">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-muted block mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    maxLength={LIMITS.title}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full border border-hair rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-teal text-sm"
                    placeholder="e.g. Enterprise CRM App"
                  />
                  <CharCounter current={form.title.length} max={LIMITS.title} />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-muted block mb-1">Showcase Image (Max 10MB)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-mono file:bg-teal-light file:text-teal hover:file:bg-teal/20 cursor-pointer"
                    />
                    {uploading && <span className="text-xs text-teal font-mono animate-pulse">Uploading...</span>}
                  </div>
                  {form.image && (
                    <div className="mt-2 p-2 border border-hair rounded bg-white w-32 h-20 flex items-center justify-center">
                      <img
                        src={form.image.startsWith('http') ? form.image : `${BASE_URL}${form.image}`}
                        alt="Project preview"
                        className="max-h-full max-w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-muted block mb-1 font-semibold">Description</label>
                  <textarea
                    rows="3"
                    maxLength={LIMITS.description}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border border-hair rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-teal text-sm"
                    placeholder="Short summary of the project architecture and goals..."
                  />
                  <CharCounter current={form.description.length} max={LIMITS.description} />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-muted block mb-1">Tech Stack</label>
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Other') {
                        setShowCustomTech(true);
                        e.target.value = '';
                        return;
                      }
                      if (!val) return;
                      const currentTags = form.techStack ? form.techStack.split(',').map(t => t.trim()) : [];
                      if (!currentTags.includes(val)) {
                        const newTags = [...currentTags, val];
                        setForm({ ...form, techStack: newTags.join(', ') });
                      }
                      e.target.value = ''; // Reset dropdown selection
                    }}
                    className="w-full border border-hair rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-teal text-sm"
                  >
                    <option value="">-- Select Technology --</option>
                    {TECH_OPTIONS.map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                    <option value="Other">Other (specify...)</option>
                  </select>
                  
                  {showCustomTech && (
                    <div className="flex gap-2 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <input
                        type="text"
                        placeholder="Type custom technology..."
                        value={customTech}
                        onChange={(e) => setCustomTech(e.target.value)}
                        className="flex-1 border border-hair rounded-xl px-4 py-2 bg-white focus:outline-none focus:border-teal text-sm text-ink"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = customTech.trim();
                          if (val) {
                            const currentTags = form.techStack ? form.techStack.split(',').map(t => t.trim()) : [];
                            if (!currentTags.includes(val)) {
                              const newTags = [...currentTags, val];
                              setForm({ ...form, techStack: newTags.join(', ') });
                            }
                          }
                          setCustomTech('');
                          setShowCustomTech(false);
                        }}
                        className="bg-teal hover:bg-teal/95 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomTech('');
                          setShowCustomTech(false);
                        }}
                        className="border border-hair text-muted hover:bg-teal-light/20 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  
                  {/* Selected Tech Stack badges display */}
                  <div className="flex flex-wrap gap-1.5 mt-2 p-2 bg-white border border-hair rounded-xl min-h-[48px]">
                    {form.techStack ? (
                      form.techStack.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal/10 text-teal text-xs font-mono font-semibold">
                          {tag}
                          <button
                            type="button"
                            onClick={() => {
                              const currentTags = form.techStack.split(',').map(t => t.trim()).filter(Boolean);
                              const newTags = currentTags.filter(t => t !== tag);
                              setForm({ ...form, techStack: newTags.join(', ') });
                            }}
                            className="text-red-500 hover:text-red-700 font-bold ml-1"
                          >
                            &times;
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted font-sans py-1 px-0.5">No technologies selected yet.</span>
                    )}
                  </div>
                  <CharCounter current={form.techStack.length} max={LIMITS.techStack} />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-muted block mb-1">Project Link (e.g. GitHub or Website URL)</label>
                  <input
                    type="url"
                    maxLength={LIMITS.link}
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="w-full border border-hair rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-teal text-sm"
                    placeholder="https://github.com/my-profile/project"
                  />
                  <CharCounter current={form.link.length} max={LIMITS.link} />
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
