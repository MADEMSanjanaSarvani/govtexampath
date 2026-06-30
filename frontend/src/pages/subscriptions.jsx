import ProtectedRoute from '@/components/common/ProtectedRoute';
import ManageSubscriptionsView from '@/views/ManageSubscriptions';

export default function SubscriptionsPage() {
  return <ProtectedRoute><ManageSubscriptionsView /></ProtectedRoute>;
}
