import ProtectedRoute from '@/components/common/ProtectedRoute';
import ManageExams from '@/views/admin/ManageExams';

export default function ManageExamsPage() {
  return <ProtectedRoute adminOnly><ManageExams /></ProtectedRoute>;
}
ManageExamsPage.getLayout = (page) => page;
