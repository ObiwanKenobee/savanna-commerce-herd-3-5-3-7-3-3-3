import React from "react";
import AdminNavigation from "@/components/admin/AdminNavigation";
import DevOpsDashboard from "@/components/monitoring/DevOpsDashboard";

const AdminDevOpsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AdminNavigation />
      <main className="pt-16">
        <DevOpsDashboard />
      </main>
    </div>
  );
};

export default AdminDevOpsPage;
