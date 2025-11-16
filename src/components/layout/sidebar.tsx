'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Building2,
  Users,
  ClipboardCheck,
  Settings,
  LogOut,
  Map,
  FolderOpen,
  Scale,
  Globe
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: any;
  adminOnly?: boolean;
  showBadge?: boolean;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'GIS Map',
    href: '/dashboard/map',
    icon: Globe,
  },
  {
    title: 'Division Requests',
    href: '/dashboard/legal-requests',
    icon: Scale,
    showBadge: true,
  },
  {
    title: 'Applications',
    href: '/dashboard/applications',
    icon: FileText,
  },
  {
    title: 'Land Parcels',
    href: '/dashboard/parcels',
    icon: MapPin,
  },
  {
    title: 'Zoning Districts',
    href: '/dashboard/zoning',
    icon: Map,
  },
  {
    title: 'Development Plans',
    href: '/dashboard/plans',
    icon: Building2,
  },
  {
    title: 'Inspections',
    href: '/dashboard/inspections',
    icon: ClipboardCheck,
  },
  {
    title: 'Compliance',
    href: '/dashboard/compliance',
    icon: FolderOpen,
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: Users,
    adminOnly: true,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch unread count on mount
    fetchUnreadCount();

    // Set up interval to refresh count every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/legal-requests/unread-count');
      const data = await response.json();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = async () => {
    // Development mode: Just refresh
    // Production: Uncomment below to enable logout
    // await supabase.auth.signOut();
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white shadow-2xl">
      {/* Logo Header */}
      <div className="flex h-20 items-center gap-3 border-b border-white/20 px-6 bg-black/10">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2 shadow-lg">
          <Image
            src="/logo.svg"
            alt="Department Logo"
            width={40}
            height={40}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-tight">Physical Planning</span>
          <span className="text-xs text-green-100 leading-tight">Land Department</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const showBadge = item.showBadge && unreadCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative',
                isActive
                  ? 'bg-white text-green-700 shadow-lg scale-105'
                  : 'text-green-50 hover:bg-white/20 hover:text-white hover:scale-102'
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-green-600" : "")} />
              <span>{item.title}</span>
              {showBadge && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Badge */}
      <div className="border-t border-white/20 p-4 bg-black/10">
        <div className="text-center">
          <p className="text-xs font-semibold text-green-100">Papua New Guinea</p>
          <p className="text-xs text-green-200 mt-0.5">Lands & Physical Planning</p>
        </div>
      </div>

      {/* Development Mode: Logout disabled */}
      {/* TODO: Uncomment when authentication is re-enabled
      <div className="border-t border-white/20 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-green-50 hover:bg-white/20 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      */}
    </div>
  );
}
