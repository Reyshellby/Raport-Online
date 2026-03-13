import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Landing from "./page/landing";
import LoginPage from "./page/loginPage";

import AdminAcademicYearPage from "./page/admin/AdminAcademicYearPage";
import AdminAssignmentPage from "./page/admin/AdminAssignmentPage";
import AdminClassesPage from "./page/admin/AdminClassesPage";
import AdminDashboard from "./page/admin/AdminDashboard";
import AdminMajorPage from "./page/admin/AdminMajorPage";
import AdminManagementPage from "./page/admin/AdminManagementPage";
import AdminStudentsPage from "./page/admin/AdminStudentsPage";
import AdminSubjectPage from "./page/admin/AdminSubjectPage";
import AdminTeachersPage from "./page/admin/AdminTeachersPage";

import TeacherLayout from "./page/teacher/TeacherLayout";
import TeacherDashboard from "./page/teacher/TeacherDashboard";
import TeacherScoresPage from "./page/teacher/TeacherScoresPage";

import StudentLayout from "./page/student/StudentLayout";
import StudentDashboard from "./page/student/StudentDashboard";
import StudentScoresPage from "./page/student/StudentScoresPage";

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return children;
}

// Public Route - Redirect if already logged in
function PublicRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (user) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return children;
}

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Navigate to="/admin/dashboard" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/academic-year" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAcademicYearPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/teachers" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminTeachersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/students" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminStudentsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/assignment" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAssignmentPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/classes" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminClassesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/major" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminMajorPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/manage-admin" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/subject" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSubjectPage />
            </ProtectedRoute>
          } 
        />

        {/* Teacher Routes */}
        <Route 
          path="/guru" 
          element={
            <ProtectedRoute allowedRoles={["guru"]}>
              <Navigate to="/guru/dashboard" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/guru/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["guru"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/guru/scores" 
          element={
            <ProtectedRoute allowedRoles={["guru"]}>
              <TeacherScoresPage />
            </ProtectedRoute>
          } 
        />

        {/* Student Routes */}
        <Route 
          path="/siswa" 
          element={
            <ProtectedRoute allowedRoles={["siswa"]}>
              <Navigate to="/siswa/dashboard" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/siswa/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["siswa"]}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/siswa/scores" 
          element={
            <ProtectedRoute allowedRoles={["siswa"]}>
              <StudentScoresPage />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route 
          path="*" 
          element={
            <div className="text-white bg-gray-950 min-h-screen flex items-center justify-center">
              404 - Page Not Found
            </div>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;

