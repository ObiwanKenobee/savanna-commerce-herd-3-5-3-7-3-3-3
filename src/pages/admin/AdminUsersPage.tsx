import AdminNavigation from "@/components/admin/AdminNavigation";
import UserManagement from "@/components/admin/UserManagement";
import { useAuth } from "@/hooks/useAuth";

const AdminUsersPage = () => {
  const { user, profile } = useAuth();

  if (!user || profile?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            Access Denied
          </h2>
          <p className="text-red-600">Administrator access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AdminNavigation />

      <div className="container mx-auto px-4 py-8">
        <UserManagement />
      </div>
    </div>
  );
};

export default AdminUsersPage;
