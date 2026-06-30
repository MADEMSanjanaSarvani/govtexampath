import ProtectedRoute from '@/components/common/ProtectedRoute';
import ProfileView from '@/views/Profile';

export default function ProfilePage() {
  return <ProtectedRoute><ProfileView /></ProtectedRoute>;
}
