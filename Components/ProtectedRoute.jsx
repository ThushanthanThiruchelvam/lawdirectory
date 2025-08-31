'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsChecking(false);
      
      // If not authenticated and trying to access protected routes
      if (!isAuthenticated && pathname !== '/admin/login') {
        router.push('/admin/login');
        return;
      }
      
      // If authenticated and trying to access login page
      if (isAuthenticated && pathname === '/admin/login') {
        router.push('/admin/add-blog');
        return;
      }
    }
  }, [isAuthenticated, loading, router, pathname]);

  // Show loading spinner while checking authentication
  if (loading || isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  // Allow access to login page for unauthenticated users
  if (pathname === '/admin/login') {
    return children;
  }

  // Protect other admin routes
  return isAuthenticated ? children : null;
}