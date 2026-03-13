import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import api from "../../api/api";

export default function AdminAssignmentPage() {
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    guruId: "",
    mapelId: "",
    kelasId: "",
    tahunAjaranId: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentsRes, teachersRes, subjectsRes, classesRes, yearsRes] = await Promise.all([
        api.get("/admin/getAllAssignment"),
        api.get("/admin/getAllTeacher"),
        api.get("/admin/getAllSubject"),
        api.get("/admin/getAllClasses"),
        api.get("/admin/getAllAcademicYear"),
      ]);
      
      // Assignments are now returned as flat array
      setAssignments(assignmentsRes.data.data || []);
      setTeachers(teachersRes.data.data || []);
      setSubjects(subjectsRes.data.data || []);
      setClasses(classesRes.data.data || []);
      setAcademicYears(yearsRes.data.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.post("/admin/createAssignment", {
        guruId: form.guruId,
        mapelId: form.mapelId,
        kelasId: form.kelasId,
        tahunAjaranId: form.tahunAjaranId,
      });
      
      setShowModal(false);
      setForm({ guruId: "", mapelId: "", kelasId: "", tahunAjaranId: "" });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tugas mengajar ini?")) return;
    
    try {
      await api.delete(`/admin/deleteAssignment/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus tugas mengajar");
    }
  };

  const openAddModal = () => {
    setForm({ guruId: "", mapelId: "", kelasId: "", tahunAjaranId: "" });
    setError("");
    setShowModal(true);
  };

  // Now assignments are stored as flat array
  const allAssignments = assignments;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Tugas Mengajar</h1>
        <button onClick={openAddModal} className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500 transition">
          + Tambah Tugas Mengajar
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : allAssignments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-white/10 bg-gray-800/50">
                <tr>
                  <th className="text-left py-3 px-4">Guru</th>
                  <th className="text-left py-3 px-4">Mata Pelajaran</th>
                  <th className="text-left py-3 px-4">Kelas</th>
                  <th className="text-left py-3 px-4">Tahun Ajaran</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {allAssignments.map((assignment) => (
                  <tr key={assignment.id} className="border-b border-white/5 hover:bg-gray-800/30">
                    <td className="py-3 px-4">{assignment.guru}</td>
                    <td className="py-3 px-4">{assignment.mapel}</td>
                    <td className="py-3 px-4">{assignment.kelas}</td>
                    <td className="py-3 px-4">{assignment.tahun}</td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleDelete(assignment.id)}
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
            Belum ada tugas mengajar
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Tambah Tugas Mengajar
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Guru</label>
                <select
                  required
                  value={form.guruId}
                  onChange={(e) => setForm({ ...form, guruId: e.target.value })}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Pilih Guru --</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Mata Pelajaran</label>
                <select
                  required
                  value={form.mapelId}
                  onChange={(e) => setForm({ ...form, mapelId: e.target.value })}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Pilih Mata Pelajaran --</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.nama_mapel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Kelas</label>
                <select
                  required
                  value={form.kelasId}
                  onChange={(e) => setForm({ ...form, kelasId: e.target.value })}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Pilih Kelas --</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.nama_kelas}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tahun Ajaran</label>
                <select
                  required
                  value={form.tahunAjaranId}
                  onChange={(e) => setForm({ ...form, tahunAjaranId: e.target.value })}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Pilih Tahun Ajaran --</option>
                  {academicYears.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.nama_tahun}
                    </option>
                  ))}
                </select>
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

