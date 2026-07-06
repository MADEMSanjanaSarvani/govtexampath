import ProtectedRoute from '@/components/common/ProtectedRoute';
import VerificationDashboard from '@/views/admin/VerificationDashboard';

export default function VerificationPage() {
  return <ProtectedRoute adminOnly><VerificationDashboard /></ProtectedRoute>;
}
VerificationPage.getLayout = (page) => page;
