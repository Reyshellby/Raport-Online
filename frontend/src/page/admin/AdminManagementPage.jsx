import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import api from "../../api/api";

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await api.get("/admin/getAllAdmin");
      setAdmins(response.data.data || []);
    } catch (err) {
      console.error("Error fetching admins:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingAdmin) {
        const updateData = { username: form.username };
        if (form.password) {
          updateData.password = form.password;
        }
        await api.put(`/admin/updateCredentialAdmin/${editingAdmin.id}`, updateData);
      } else {
        await api.post("/admin/register", {
          username: form.username,
          email: form.email,
          password: form.password,
        });
      }
      
      setShowModal(false);
      setEditingAdmin(null);
      setForm({ username: "", email: "", password: "" });
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus admin ini?")) return;
    
    try {
      await api.delete(`/admin/destroy/${id}`);
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus admin");
    }
  };

  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setForm({ username: admin.username, email: admin.email, password: "" });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingAdmin(null);
    setForm({ username: "", email: "", password: "" });
    setError("");
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Admin</h1>
        <button onClick={openAddModal} className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500 transition">
          + Tambah Admin
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : admins.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-white/10 bg-gray-800/50">
                <tr>
                  <th className="text-left py-3 px-4">Username</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-white/5 hover:bg-gray-800/30">
                    <td className="py-3 px-4">{admin.username}</td>
                    <td className="py-3 px-4">{admin.email}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button 
                        onClick={() => openEditModal(admin)}
                        className="bg-yellow-600 px-3 py-1 rounded text-xs hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(admin.id)}
                        className="bg-red-600 px-3 py-1 rounded text-xs hover:bg-red-500"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            Belum ada admin
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingAdmin ? "Edit Admin" : "Tambah Admin"}
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Username</label>
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {!editingAdmin && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Password {editingAdmin && "(kosongkan jika tidak diubah)"}
                </label>
                <input
                  type="password"
                  required={!editingAdmin}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-indigo-600 py-2 rounded-lg hover:bg-indigo-500 transition disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

