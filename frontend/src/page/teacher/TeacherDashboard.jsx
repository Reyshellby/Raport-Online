import { useState, useEffect } from "react";
import TeacherLayout from "./TeacherLayout";
import api from "../../api/api";

export default function TeacherDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

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

  return (
    <TeacherLayout>
      <h1 className="text-2xl font-bold">Dashboard Guru</h1>

      {/* Welcome Card */}
      <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-2">Selamat Datang</h2>
        <p className="text-gray-400">
          Di halaman ini Anda dapat melihat tugas mengajar dan menginput nilai siswa.
        </p>
      </div>

      {/* Assignments Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Total Tugas Mengajar</p>
          <h3 className="text-3xl font-bold mt-2">{assignments.length}</h3>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">Tugas Mengajar</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : assignments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-white/10">
                <tr>
                  <th className="text-left py-3">No</th>
                  <th className="text-left py-3">Kelas</th>
                  <th className="text-left py-3">Mata Pelajaran</th>
                  <th className="text-left py-3">Tahun Ajaran</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment, index) => (
                  <tr key={assignment.id} className="border-b border-white/5">
                    <td className="py-3">{index + 1}</td>
                    <td className="py-3">{assignment.kelas || "-"}</td>
                    <td className="py-3">{assignment.mapel || "-"}</td>
                    <td className="py-3">{assignment.tahun_ajaran || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">Belum ada tugas mengajar</p>
        )}
      </div>
    </TeacherLayout>
  );
}

