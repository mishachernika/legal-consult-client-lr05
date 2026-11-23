import { Outlet } from 'react-router';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Footer from './Footer';
import Header from './Header';

// Єдиний каркас сторінок: Header + контент маршруту (<Outlet />) + Footer.
// Помилки відтворення дочірніх сторінок перехоплює ErrorBoundary.
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header />
      <main className="container mx-auto flex-grow px-4 py-8">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
