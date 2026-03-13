import { useState, useEffect } from "react";
import TeacherLayout from "./TeacherLayout";
import api from "../../api/api";

export default function TeacherScoresPage() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Form state
  const [form, setForm] = useState({
    siswa_id: "",
    semester: 1,
    kategori: "PTS",
    nilai: "",
    keterangan: "",
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (selectedAssignment) {
      fetchStudents();
    }
  }, [selectedAssignment]);

  const fetchAssignments = async () => {
    try {
      const response = await api.get("/teacher/getAllAssignment");
      setAssignments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      // Get students by kelas_id from selected assignment
      const response = await api.get(`/teacher/getStudentsByClass/${selectedAssignment.kelasId}`);
      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await api.post("/teacher/storeScore", {
        siswa_id: form.siswa_id,
        mapel_id: selectedAssignment.mapelId,
        kelas_id: selectedAssignment.kelasId,
        tahun_ajaran_id: selectedAssignment.tahunAjaranId,
        semester: form.semester,
        kategori: form.kategori,
        nilai: form.nilai,
        keterangan: form.keterangan,
      });

      setMessage({ type: "success", text: "Nilai berhasil disimpan!" });
      setForm({ ...form, siswa_id: "", nilai: "", keterangan: "" });
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Gagal menyimpan nilai" 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <h1 className="text-2xl font-bold mb-6">Input Nilai</h1>

      {assignments.length === 0 ? (
        <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
          <p className="text-gray-400 text-center">
            Anda belum memiliki tugas mengajar. Hubungi admin untuk mendapatkan tugas mengajar.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Assignment Selection */}
          <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Pilih Kelas & Mata Pelajaran</h2>
            <select
              className="select select-bordered w-full bg-gray-800"
              value={selectedAssignment?.id || ""}
              onChange={(e) => {
                const assignment = assignments.find((a) => a.id === parseInt(e.target.value));
                setSelectedAssignment(assignment);
              }}
            >
              <option value="">-- Pilih --</option>
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.kelas} - {assignment.mapel}
                </option>
              ))}
            </select>
          </div>

          {/* Score Entry Form */}
          {selectedAssignment && (
            <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
              <h2 className="text-lg font-semibold mb-4">Form Input Nilai</h2>
              
              {message.text && (
                <div className={`mb-4 p-3 rounded-lg ${
                  message.type === "success" 
                    ? "bg-green-500/20 border border-green-500/50 text-green-200" 
                    : "bg-red-500/20 border border-red-500/50 text-red-200"
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Siswa</label>
                    <select
                      className="select select-bordered w-full bg-gray-800"
                      value={form.siswa_id}
                      onChange={(e) => setForm({ ...form, siswa_id: e.target.value })}
                      required
                    >
                      <option value="">-- Pilih Siswa --</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.nama} ({student.nis})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Semester</label>
                    <select
                      className="select select-bordered w-full bg-gray-800"
                      value={form.semester}
                      onChange={(e) => setForm({ ...form, semester: parseInt(e.target.value) })}
                    >
                      <option value={1}>Semester 1</option>
                      <option value={2}>Semester 2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Kategori</label>
                    <select
                      className="select select-bordered w-full bg-gray-800"
                      value={form.kategori}
                      onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                    >
                      <option value="PTS">PTS (Penilaian Tengah Semester)</option>
                      <option value="PAS">PAS (Penilaian Akhir Semester)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Nilai (0-100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="input input-bordered w-full bg-gray-800"
                      value={form.nilai}
                      onChange={(e) => setForm({ ...form, nilai: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Keterangan (Opsional)</label>
                  <textarea
                    className="textarea textarea-bordered w-full bg-gray-800"
                    rows="2"
                    value={form.keterangan}
                    onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                    placeholder="Tambahkan catatan..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Nilai"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </TeacherLayout>
  );
}

