
import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import api from "../../api/api";

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [form, setForm] = useState({
    nama_kelas: "",
    tingkat_kelas: "",
    tahun_angkatan: "",
    major_id: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classesRes, majorsRes] = await Promise.all([
        api.get("/admin/getAllClasses"),
        api.get("/admin/getAllMajor"),
      ]);

      setClasses(classesRes.data.data || []);
      setMajors(majorsRes.data.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingClass) {
        await api.put(`/admin/updateClasses/${editingClass.id}`, {
          nama_kelas: form.nama_kelas,
          tingkat_kelas: form.tingkat_kelas,
        });
      } else {
        await api.post("/admin/createClasses", {
          nama_kelas: form.nama_kelas,
          tingkat_kelas: form.tingkat_kelas,
          major_id: parseInt(form.major_id),
          tahun_angkatan: parseInt(form.tahun_angkatan),
        });
      }

      setShowModal(false);
      setEditingClass(null);
      setForm({
        nama_kelas: "",
        tingkat_kelas: "",
        major_id: "",
        tahun_angkatan: "",
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan");
      console.log(err.response?.data);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kelas ini?")) return;

    try {
      await api.delete(`/admin/destroyClasses/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus kelas");
    }
  };

  const openEditModal = (cls) => {
    setEditingClass(cls);
    setForm({
      nama_kelas: cls.nama_kelas,
      tingkat_kelas: cls.tingkat_kelas ? String(cls.tingkat_kelas) : "",
      major_id: cls.jurusan_id || cls.major_id || "",
      tahun_angkatan: cls.tahun_angkatan ? String(cls.tahun_angkatan) : "",
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingClass(null);
    setForm({
      nama_kelas: "",
      tingkat_kelas: "",
      major_id: "",
      tahun_angkatan: "",
    });
    setError("");
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Kelas</h1>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500 transition"
        >
          + Tambah Kelas
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : classes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-white/10 bg-gray-800/50">
                <tr>
                  <th className="text-left py-3 px-4">Nama Kelas</th>
                  <th className="text-left py-3 px-4">Tingkat Kelas</th>
                  <th className="text-left py-3 px-4">Jurusan</th>
                  <th className="text-left py-3 px-4">Tahun Angkatan</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr
                    key={cls.id}
                    className="border-b border-white/5 hover:bg-gray-800/30"
                  >
                    <td className="py-3 px-4">{cls.nama_kelas}</td>
                    <td className="py-3 px-4">{cls.tingkat_kelas}</td>
                    <td className="py-3 px-4">
                      {cls.major?.nama_jurusan ||
                        cls.jurusan?.nama_jurusan ||
                        "-"}
                    </td>
                    <td className="py-3 px-4">{cls.tahun_angkatan}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button
                        onClick={() => openEditModal(cls)}
                        className="bg-yellow-600 px-3 py-1 rounded text-xs hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cls.id)}
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
          <div className="text-center py-8 text-gray-400">Belum ada kelas</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingClass ? "Edit Kelas" : "Tambah Kelas"}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Nama Kelas
                </label>
                <input
                  type="text"
                  required
                  value={form.nama_kelas}
                  onChange={(e) =>
                    setForm({ ...form, nama_kelas: e.target.value })
                  }
                  placeholder="Contoh: XII RPL 1"
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Tingkat Kelas
                    </label>
                    <select
                      required
                      value={form.tingkat_kelas}
                      onChange={(e) =>
                        setForm({ ...form, tingkat_kelas: e.target.value })
                      }
                      className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">-- Pilih Tingkat --</option>
                      <option value="X">X (10)</option>
                      <option value="XI">XI (11)</option>
                      <option value="XII">XII (12)</option>
                    </select>
                  </div>

              {!editingClass && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Jurusan
                    </label>
                    <select
                      required
                      value={form.major_id}
                      onChange={(e) =>
                        setForm({ ...form, major_id: e.target.value })
                      }
                      className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">-- Pilih Jurusan --</option>
                      {majors.map((major) => (
                        <option key={major.id} value={major.id}>
                          {major.nama_jurusan}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Tahun Angkatan
                    </label>
                    <input
                      type="number"
                      required
                      value={form.tahun_angkatan}
                      onChange={(e) =>
                        setForm({ ...form, tahun_angkatan: e.target.value })
                      }
                      placeholder="Contoh: 2025"
                      className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}

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

