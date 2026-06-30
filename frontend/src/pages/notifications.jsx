import ProtectedRoute from '@/components/common/ProtectedRoute';
import NotificationsView from '@/views/Notifications';

export default function NotificationsPage() {
  return <ProtectedRoute><NotificationsView /></ProtectedRoute>;
}
