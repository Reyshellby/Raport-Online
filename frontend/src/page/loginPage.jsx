import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

export default function LoginPage() {
  const [role, setRole] = useState("siswa");
  const [form, setForm] = useState({
    username: "",
    email: "",
    nip: "",
    nis: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { id: "siswa", label: "Siswa" },
    { id: "guru", label: "Guru" },
    { id: "admin", label: "Admin" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setForm({
      username: "",
      email: "",
      nip: "",
      nis: "",
      password: "",
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      
      if (role === "admin") {
        response = await api.post("/admin/login", {
          username: form.username,
          email: form.email,
          password: form.password,
        });
        
        if (response.data.status === "success") {
          localStorage.setItem("token", response.data.token);
          login(response.data.data, "admin");
          navigate("/admin/dashboard");
        }
      } else if (role === "guru") {
        response = await api.post("/teacher/login", {
          nip: form.nip,
          password: form.password,
        });
        
        if (response.data.status === "success") {
          localStorage.setItem("token", response.data.token);
          login(response.data.data, "guru");
          navigate("/teacher/dashboard");
        }
      } else if (role === "siswa") {
        response = await api.post("/student/login", {
          nis: form.nis,
          password: form.password,
        });
        
        if (response.data.status === "success") {
          localStorage.setItem("token", response.data.token);
          login(response.data.data, "siswa");
          navigate("/student/dashboard");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold">Sistem Rapor Online</h1>
        </div>

        <div className="bg-gray-900 border border-white/10 rounded-xl p-8 shadow-lg">
          {/* Role Selector */}
          <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleChange(r.id)}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${
                  role === r.id
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ADMIN */}
            {role === "admin" && (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Masukkan username"
                    className="w-full bg-gray-800 border border-white/10 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Masukkan email"
                    className="w-full bg-gray-800 border border-white/10 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </>
            )}

            {/* GURU */}
            {role === "guru" && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">NIP</label>
                <input
                  type="text"
                  name="nip"
                  required
                  value={form.nip}
                  onChange={handleChange}
                  placeholder="Masukkan NIP"
                  className="w-full bg-gray-800 border border-white/10 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* SISWA */}
            {role === "siswa" && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">NIS</label>
                <input
                  type="text"
                  name="nis"
                  required
                  value={form.nis}
                  onChange={handleChange}
                  placeholder="Masukkan NIS"
                  className="w-full bg-gray-800 border border-white/10 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* PASSWORD */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                className="w-full bg-gray-800 border border-white/10 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 py-2 rounded-md font-semibold hover:bg-indigo-500 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : `Masuk sebagai ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} Sistem Rapor Online
        </p>
      </div>
    </div>
  );
}

