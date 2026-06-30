import ProtectedRoute from '@/components/common/ProtectedRoute';
import SendNotification from '@/views/admin/SendNotification';

export default function SendNotificationPage() {
  return <ProtectedRoute adminOnly><SendNotification /></ProtectedRoute>;
}
SendNotificationPage.getLayout = (page) => page;
