import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import api from "../../api/api";

export default function AdminStudentsPage() {
  const [studentsGrouped, setStudentsGrouped] = useState({});
  const [classes, setClasses] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [form, setForm] = useState({
    nama: "",
    nis: "",
    password: "",
    kelas_id: "",
    jurusan_id: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, classesRes, majorsRes] = await Promise.all([
        api.get("/admin/getAllStudent"),
        api.get("/admin/getAllClasses"),
        api.get("/admin/getAllMajor"),
      ]);
      
      setStudentsGrouped(studentsRes.data.data || {});
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
      if (editingStudent) {
        // Update
        const updateData = { nama: form.nama };
        if (form.password) {
          updateData.password = form.password;
        }
        await api.put(`/admin/updateStudent/${editingStudent.id}`, updateData);
      } else {
        // Create - use jurusan_id but send as jurusan_id to match backend expectation
        await api.post("/admin/registerStudent", {
          nama: form.nama,
          nis: form.nis,
          password: form.password,
          kelas_id: form.kelas_id,
          jurusan_id: form.jurusan_id,
        });
      }
      
      setShowModal(false);
      setEditingStudent(null);
      setForm({ nama: "", nis: "", password: "", kelas_id: "", jurusan_id: "" });
      setSelectedClass("");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus siswa ini?")) return;
    
    try {
      await api.delete(`/admin/destroyStudent/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus siswa");
    }
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setForm({ 
      nama: student.nama, 
      nis: student.nis, 
      password: "", 
      kelas_id: student.kelas_id || "",
      jurusan_id: student.jurusan_id || ""
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setForm({ nama: "", nis: "", password: "", kelas_id: "", jurusan_id: "" });
    setSelectedClass("");
    setError("");
    setShowModal(true);
  };

  // Flatten students for display
  const allStudents = Object.entries(studentsGrouped).flatMap(([kelas, students]) =>
    students.map(s => ({ ...s, kelas }))
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Siswa</h1>
        <button onClick={openAddModal} className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500 transition">
          + Tambah Siswa
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : allStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-white/10 bg-gray-800/50">
                <tr>
                  <th className="text-left py-3 px-4">Nama</th>
                  <th className="text-left py-3 px-4">NIS</th>
                  <th className="text-left py-3 px-4">Kelas</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {allStudents.map((student) => (
                  <tr key={student.id} className="border-b border-white/5 hover:bg-gray-800/30">
                    <td className="py-3 px-4">{student.nama}</td>
                    <td className="py-3 px-4">{student.nis}</td>
                    <td className="py-3 px-4">{student.kelas}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button 
                        onClick={() => openEditModal(student)}
                        className="bg-yellow-600 px-3 py-1 rounded text-xs hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
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
            Belum ada siswa
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingStudent ? "Edit Siswa" : "Tambah Siswa"}
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
                <label className="block text-sm text-gray-400 mb-2">NIS</label>
                <input
                  type="text"
                  required
                  disabled={editingStudent}
                  value={form.nis}
                  onChange={(e) => setForm({ ...form, nis: e.target.value })}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />
              </div>

              {!editingStudent && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Kelas</label>
                    <select
                      required
                      value={form.kelas_id}
                      onChange={(e) => setForm({ ...form, kelas_id: e.target.value })}
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
                    <label className="block text-sm text-gray-400 mb-2">Jurusan</label>
                    <select
                      required
                      value={form.jurusan_id}
                      onChange={(e) => setForm({ ...form, jurusan_id : e.target.value })}
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
                </>
              )}
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Password {editingStudent && "(kosongkan jika tidak diubah)"}
                </label>
                <input
                  type="password"
                  required={!editingStudent}
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

