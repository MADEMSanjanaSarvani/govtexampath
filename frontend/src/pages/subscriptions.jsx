import SEO from '@/components/common/SEO';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import ManageSubscriptionsView from '@/views/ManageSubscriptions';

export default function SubscriptionsPage() {
  return (
    <>
      <SEO
        title="Manage Exam Subscriptions"
        path="/subscriptions"
        description="Subscribe to specific government exam categories to receive alerts. Manage your UPSC, SSC, Banking, Railways and other exam notification preferences."
      />
      <ProtectedRoute><ManageSubscriptionsView /></ProtectedRoute>
    </>
  );
}
