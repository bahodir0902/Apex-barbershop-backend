import * as React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Settings, 
  Star,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, Button } from '@/components/ui';

const sidebarLinks = [
  { href: '/dashboard', label: 'Overview', icon: User, exact: true },
  { href: '/dashboard/appointments', label: 'My Appointments', icon: Calendar },
  { href: '/dashboard/reviews', label: 'My Reviews', icon: Star },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardLayout() {
  const location = useLocation();
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const isActive = (href: string, exact = false) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-20 left-4 z-40">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          'fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-dark-900 border-r border-dark-200 dark:border-dark-700 transform transition-transform lg:transform-none pt-20 lg:pt-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}>
          <div className="h-full flex flex-col p-6">
            {/* User info */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-dark-200 dark:border-dark-700">
              <Avatar
                src={user?.profile_picture}
                alt={user?.full_name}
                fallback={user?.full_name}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-dark-900 dark:text-white truncate">
                  {user?.full_name}
                </p>
                <p className="text-sm text-dark-500 truncate">{user?.email}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    isActive(link.href, link.exact)
                      ? 'bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400'
                      : 'text-dark-600 hover:bg-dark-100 dark:text-dark-300 dark:hover:bg-dark-800'
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Book button */}
            <div className="pt-6 border-t border-dark-200 dark:border-dark-700">
              <Button className="w-full" asChild>
                <Link to="/book">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
