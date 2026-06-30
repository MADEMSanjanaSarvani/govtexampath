import ProtectedRoute from '@/components/common/ProtectedRoute';
import DashboardView from '@/views/Dashboard';

export default function DashboardPage() {
  return <ProtectedRoute><DashboardView /></ProtectedRoute>;
}
