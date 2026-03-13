import { useState, useEffect } from "react";
import StudentLayout from "./StudentLayout";
import api from "../../api/api";

export default function StudentScoresPage() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    semester: 1,
    kategori: "PTS",
  });

  useEffect(() => {
    fetchScores();
  }, [filter]);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const response = await api.get("/student/getMyScores", {
        params: filter,
      });
      console.log("Scores response:", response.data);
      setScores(response.data.data || []);
    } catch (error) {
      console.error("Error fetching scores:", error);
      console.error("Error response:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Calculate average
  const average = scores.length > 0
    ? (scores.reduce((sum, s) => sum + parseInt(s.nilai), 0) / scores.length).toFixed(1)
    : 0;

  return (
    <StudentLayout>
      <h1 className="text-2xl font-bold mb-6">Lihat Nilai</h1>

      {/* Filter */}
      <div className="bg-gray-900 border border-white/10 p-6 rounded-xl mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Semester</label>
            <select
              className="select select-bordered bg-gray-800"
              value={filter.semester}
              onChange={(e) => setFilter({ ...filter, semester: parseInt(e.target.value) })}
            >
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Kategori</label>
            <select
              className="select select-bordered bg-gray-800"
              value={filter.kategori}
              onChange={(e) => setFilter({ ...filter, kategori: e.target.value })}
            >
              <option value="PTS">PTS (Penilaian Tengah Semester)</option>
              <option value="PAS">PAS (Penilaian Akhir Semester)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scores Table */}
      <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Nilai {filter.kategori} Semester {filter.semester}
          </h2>
          {scores.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-400">Rata-rata</p>
              <p className="text-2xl font-bold text-indigo-400">{average}</p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : scores.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-white/10">
                <tr>
                  <th className="text-left py-3">No</th>
                  <th className="text-left py-3">Mata Pelajaran</th>
                  <th className="text-left py-3">Nilai</th>
                  <th className="text-left py-3">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, index) => (
                  <tr key={index} className="border-b border-white/5">
                    <td className="py-3">{index + 1}</td>
                    <td className="py-3">{score.mapel}</td>
                    <td className="py-3">
                      <span className={`font-bold ${
                        parseInt(score.nilai) >= 75 ? 'text-green-400' : 
                        parseInt(score.nilai) >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {score.nilai}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">
                      {score.keterangan || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">
              Belum ada nilai untuk kategori ini.
            </p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

