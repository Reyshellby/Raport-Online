import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import api from "../../api/api";

export default function AdminMajorPage() {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMajor, setEditingMajor] = useState(null);
  const [form, setForm] = useState({
    nama_jurusan: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMajors();
  }, []);

  const fetchMajors = async () => {
    try {
      const response = await api.get("/admin/getAllMajor");
      setMajors(response.data.data || []);
    } catch (err) {
      console.error("Error fetching majors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingMajor) {
        await api.put(`/admin/updateMajor/${editingMajor.id}`, {
          nama_jurusan: form.nama_jurusan,
        });
      } else {
        await api.post("/admin/createMajor", {
          nama_jurusan: form.nama_jurusan,
        });
      }
      
      setShowModal(false);
      setEditingMajor(null);
      setForm({ nama_jurusan: "" });
      fetchMajors();
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus jurusan ini?")) return;
    
    try {
      await api.delete(`/admin/destroyMajor/${id}`);
      fetchMajors();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus jurusan");
    }
  };

  const openEditModal = (major) => {
    setEditingMajor(major);
    setForm({ nama_jurusan: major.nama_jurusan });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingMajor(null);
    setForm({ nama_jurusan: "" });
    setError("");
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Jurusan</h1>
        <button onClick={openAddModal} className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500 transition">
          + Tambah Jurusan
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : majors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-white/10 bg-gray-800/50">
                <tr>
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Nama Jurusan</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {majors.map((major) => (
                  <tr key={major.id} className="border-b border-white/5 hover:bg-gray-800/30">
                    <td className="py-3 px-4">{major.id}</td>
                    <td className="py-3 px-4">{major.nama_jurusan}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button 
                        onClick={() => openEditModal(major)}
                        className="bg-yellow-600 px-3 py-1 rounded text-xs hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(major.id)}
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
            Belum ada jurusan
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingMajor ? "Edit Jurusan" : "Tambah Jurusan"}
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nama Jurusan</label>
                <input
                  type="text"
                  required
                  value={form.nama_jurusan}
                  onChange={(e) => setForm({ ...form, nama_jurusan: e.target.value })}
                  placeholder="Contoh: Rekayasa Perangkat Lunak"
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

