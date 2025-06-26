import React from "react";
import AdminNavigation from "@/components/admin/AdminNavigation";
import PerformanceMonitor from "@/components/monitoring/PerformanceMonitor";

const AdminMonitoringPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      <AdminNavigation />
      <main className="pt-16">
        <PerformanceMonitor />
      </main>
    </div>
  );
};

export default AdminMonitoringPage;
