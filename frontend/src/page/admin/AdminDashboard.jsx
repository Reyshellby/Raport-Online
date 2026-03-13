import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import api from "../../api/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    admins: 0,
    teachers: 0,
    students: 0,
    classes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [adminsRes, teachersRes, studentsRes, classesRes] = await Promise.all([
        api.get("/admin/getAllAdmin"),
        api.get("/admin/getAllTeacher"),
        api.get("/admin/getAllStudent"),
        api.get("/admin/getAllClasses"),
      ]);

      setStats({
        admins: adminsRes.data.data?.length || 0,
        teachers: teachersRes.data.data?.length || 0,
        students: Object.values(studentsRes.data.data || {}).reduce((sum, arr) => sum + arr.length, 0),
        classes: classesRes.data.data?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
            <p className="text-gray-400 text-sm">Total Admin</p>
            <h3 className="text-3xl font-bold mt-2">{stats.admins}</h3>
          </div>
          
          <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
            <p className="text-gray-400 text-sm">Total Guru</p>
            <h3 className="text-3xl font-bold mt-2">{stats.teachers}</h3>
          </div>
          
          <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
            <p className="text-gray-400 text-sm">Total Siswa</p>
            <h3 className="text-3xl font-bold mt-2">{stats.students}</h3>
          </div>
          
          <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
            <p className="text-gray-400 text-sm">Total Kelas</p>
            <h3 className="text-3xl font-bold mt-2">{stats.classes}</h3>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gray-900 border border-white/10 p-6 rounded-xl mt-6">
        <h2 className="text-lg font-semibold mb-4">Menu Cepat</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/admin/manage-admin" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
            <p className="font-semibold">Kelola Admin</p>
            <p className="text-sm text-gray-400">Tambah, edit, hapus admin</p>
          </a>
          <a href="/admin/teachers" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
            <p className="font-semibold">Kelola Guru</p>
            <p className="text-sm text-gray-400">Tambah, edit, hapus guru</p>
          </a>
          <a href="/admin/students" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
            <p className="font-semibold">Kelola Siswa</p>
            <p className="text-sm text-gray-400">Tambah, edit, hapus siswa</p>
          </a>
          <a href="/admin/assignment" className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
            <p className="font-semibold">Tugas Mengajar</p>
            <p className="text-sm text-gray-400">Atur tugas guru</p>
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}

