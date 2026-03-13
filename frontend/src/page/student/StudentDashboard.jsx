import { useState, useEffect } from "react";
import StudentLayout from "./StudentLayout";
import { useAuth } from "../../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <StudentLayout>
      <h1 className="text-2xl font-bold">Dashboard Siswa</h1>

      {/* Welcome Card */}
      <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-2">Selamat Datang, {user?.nama || "Siswa"}!</h2>
        <p className="text-gray-400">
          Di halaman ini Anda dapat melihat nilai akademik Anda.
        </p>
        {user?.kelas && (
          <p className="text-gray-400 mt-2">
            Kelas: {user.kelas}
          </p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
          <p className="text-gray-400 text-sm">NIS</p>
          <h3 className="text-2xl font-bold mt-2">{user?.nis || "-"}</h3>
        </div>
        
        <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Status Akun</p>
          <h3 className="text-2xl font-bold mt-2 text-green-400">Aktif</h3>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">Informasi Akademik</h2>
        <p className="text-gray-400">
          Untuk melihat nilai akademik Anda, silakan klik menu "Lihat Nilai" di sidebar.
          Anda dapat melihat nilai PTS (Penilaian Tengah Semester) dan PAS (Penilaian Akhir Semester).
        </p>
      </div>
    </StudentLayout>
  );
}

