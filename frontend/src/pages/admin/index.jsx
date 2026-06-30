import ProtectedRoute from '@/components/common/ProtectedRoute';
import AdminDashboard from '@/views/admin/AdminDashboard';

export default function AdminDashboardPage() {
  return <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>;
}
AdminDashboardPage.getLayout = (page) => page;
