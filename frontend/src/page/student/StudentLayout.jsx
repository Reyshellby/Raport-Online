import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

export default function StudentLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/student/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen flex">
      <aside className="w-64 bg-gray-900 border-r border-white/10 p-6 hidden md:flex flex-col">
        <h2 className="text-2xl font-bold mb-10">Siswa Panel</h2>
        <nav className="space-y-3 flex-1 text-sm">
          <Link to="/siswa/dashboard" className="block hover:text-indigo-400">Dashboard</Link>
          <Link to="/siswa/scores" className="block hover:text-indigo-400">Lihat Nilai</Link>
        </nav>
        
        <div className="mt-4 mb-6 p-3 bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="font-semibold truncate">{user?.nama || "Siswa"}</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="mt-auto bg-red-600 py-2 rounded-md font-semibold hover:bg-red-500 transition"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 space-y-8">
        {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Siswa Panel</h2>
          <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded text-sm">
            Logout
          </button>
        </header>
        
        {children}
      </main>
    </div>
  );
}

