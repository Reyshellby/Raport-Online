import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import api from "../../api/api";

export default function AdminAcademicYearPage() {
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    tahun: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      const response = await api.get("/admin/getAllAcademicYear");
      setAcademicYears(response.data.data || []);
    } catch (err) {
      console.error("Error fetching academic years:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.post("/admin/createAcademicYear", {
        nama_tahun: form.tahun,
        is_active: false,
      });
      
      setShowModal(false);
      setForm({ tahun: "" });
      fetchAcademicYears();
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleSetActive = async (id) => {
    try {
      await api.put(`/admin/updateStatusAcademicYear/${id}`, {
        is_active: true,
      });
      fetchAcademicYears();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengaktifkan tahun ajaran");
    }
  };

  const handleSetInactive = async (id) => {
    try {
      await api.put(`/admin/updateStatusAcademicYear/${id}`, {
        is_active: false,
      });
      fetchAcademicYears();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menonaktifkan tahun ajaran");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tahun ajaran ini?")) return;
    
    try {
      await api.delete(`/admin/destroyAcademicYear/${id}`);
      fetchAcademicYears();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus tahun ajaran");
    }
  };

  const openAddModal = () => {
    setForm({ tahun: "" });
    setError("");
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Tahun Ajaran</h1>
        <button onClick={openAddModal} className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500 transition">
          + Tambah Tahun Ajaran
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : academicYears.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-white/10 bg-gray-800/50">
                <tr>
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Tahun Ajaran</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {academicYears.map((year) => (
                  <tr key={year.id} className="border-b border-white/5 hover:bg-gray-800/30">
                    <td className="py-3 px-4">{year.id}</td>
                    <td className="py-3 px-4">{year.nama_tahun}</td>
                    <td className="py-3 px-4">
                      {year.is_active === true || year.is_active === 1 || year.is_active === "1" ? (
                        <span className="bg-green-600 px-2 py-1 rounded text-xs">Aktif</span>
                      ) : (
                        <span className="bg-gray-600 px-2 py-1 rounded text-xs">Tidak Aktif</span>
                      )}
                    </td>
                    <td className="py-3 px-4 space-x-2">
                      {year.is_active === true || year.is_active === 1 || year.is_active === "1" ? (
                        <button 
                          onClick={() => handleSetInactive(year.id)}
                          className="bg-yellow-600 px-3 py-1 rounded text-xs hover:bg-yellow-500"
                        >
                          Nonaktifkan
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleSetActive(year.id)}
                          className="bg-green-600 px-3 py-1 rounded text-xs hover:bg-green-500"
                        >
                          Aktifkan
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(year.id)}
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
            Belum ada tahun ajaran
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Tambah Tahun Ajaran
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tahun Ajaran</label>
                <input
                  type="text"
                  required
                  value={form.tahun}
                  onChange={(e) => setForm({ ...form, tahun: e.target.value })}
                  placeholder="Contoh: 2025/2026"
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

