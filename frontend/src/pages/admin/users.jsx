import ProtectedRoute from '@/components/common/ProtectedRoute';
import ManageUsers from '@/views/admin/ManageUsers';

export default function ManageUsersPage() {
  return <ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>;
}
ManageUsersPage.getLayout = (page) => page;
