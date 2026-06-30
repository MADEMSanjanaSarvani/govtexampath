import ProtectedRoute from '@/components/common/ProtectedRoute';
import BookmarksView from '@/views/Bookmarks';

export default function BookmarksPage() {
  return <ProtectedRoute><BookmarksView /></ProtectedRoute>;
}
