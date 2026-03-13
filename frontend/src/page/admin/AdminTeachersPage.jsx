import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import api from "../../api/api";

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [form, setForm] = useState({
    nama: "",
    nip: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await api.get("/admin/getAllTeacher");
      setTeachers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingTeacher) {
        // Update - only send password if changed
        const updateData = { nama: form.nama };
        if (form.password) {
          updateData.password = form.password;
        }
        await api.put(`/admin/updateTeacher/${editingTeacher.id}`, updateData);
      } else {
        // Create
        await api.post("/admin/registerTeacher", form);
      }
      
      setShowModal(false);
      setEditingTeacher(null);
      setForm({ nama: "", nip: "", password: "" });
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus guru ini?")) return;
    
    try {
      await api.delete(`/admin/destroyTeacher/${id}`);
      fetchTeachers();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menghapus guru");
    }
  };

  const openEditModal = (teacher) => {
    setEditingTeacher(teacher);
    setForm({ nama: teacher.nama, nip: teacher.nip, password: "" });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingTeacher(null);
    setForm({ nama: "", nip: "", password: "" });
    setError("");
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Guru</h1>
        <button onClick={openAddModal} className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500 transition">
          + Tambah Guru
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : teachers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-white/10 bg-gray-800/50">
                <tr>
                  <th className="text-left py-3 px-4">Nama</th>
                  <th className="text-left py-3 px-4">NIP</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-white/5 hover:bg-gray-800/30">
                    <td className="py-3 px-4">{teacher.nama}</td>
                    <td className="py-3 px-4">{teacher.nip}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button 
                        onClick={() => openEditModal(teacher)}
                        className="bg-yellow-600 px-3 py-1 rounded text-xs hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(teacher.id)}
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
            Belum ada guru
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingTeacher ? "Edit Guru" : "Tambah Guru"}
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nama</label>
                <input
                  type="text"
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">NIP</label>
                <input
                  type="text"
                  required
                  disabled={editingTeacher}
                  value={form.nip}
                  onChange={(e) => setForm({ ...form, nip: e.target.value })}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Password {editingTeacher && "(kosongkan jika tidak diubah)"}
                </label>
                <input
                  type="password"
                  required={!editingTeacher}
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

