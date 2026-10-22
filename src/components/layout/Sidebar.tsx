// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { HeartPulse, LayoutDashboard, Stethoscope, Users, X } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { setSidebarOpen } from '@/store/uiSlice';
// import { IconButton } from '@/components/ui/Button';

// const NAV_ITEMS = [
//   { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//   { href: '/doctors', label: 'Doctors', icon: Stethoscope },
//   { href: '/patients', label: 'Patients', icon: Users },
// ];

// function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
//   const pathname = usePathname();

//   return (
//     <div className="flex h-full flex-col bg-slate-900 text-slate-300">
//       <div className="flex h-16 shrink-0 items-center gap-2.5 px-5">
//         <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
//           <HeartPulse className="h-5 w-5" />
//         </span>
//         <span className="text-lg font-semibold tracking-tight text-white">Doctor Tracker</span>
//       </div>

//       <nav aria-label="Main" className="flex-1 space-y-1 px-3 py-4">
//         {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
//           const active = pathname === href || pathname.startsWith(`${href}/`);
//           return (
//             <Link
//               key={href}
//               href={href}
//               onClick={onNavigate}
//               aria-current={active ? 'page' : undefined}
//               className={cn(
//                 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
//                 active ? 'bg-brand-600 text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white',
//               )}
//             >
//               <Icon className="h-[18px] w-[18px]" />
//               {label}
//             </Link>
//           );
//         })}
//       </nav>

//       <p className="px-5 py-4 text-xs text-slate-500">© {new Date().getFullYear()} Doctor Tracker</p>
//     </div>
//   );
// }

// export function Sidebar() {
//   const dispatch = useAppDispatch();
//   const open = useAppSelector((state) => state.ui.sidebarOpen);
//   const close = () => dispatch(setSidebarOpen(false));

//   return (
//     <>
//       <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
//         <SidebarContent />
//       </aside>

//       {open && (
//         <div className="fixed inset-0 z-40 lg:hidden">
//           <div className="absolute inset-0 animate-fade-in bg-slate-900/50" onClick={close} aria-hidden />
//           <aside className="relative h-full w-64 animate-slide-in">
//             <SidebarContent onNavigate={close} />
//             <IconButton label="Close menu" onClick={close} className="absolute right-2 top-4 text-slate-400 hover:bg-slate-800 hover:text-white">
//               <X className="h-4 w-4" />
//             </IconButton>
//           </aside>
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HeartPulse,
  LayoutDashboard,
  Stethoscope,
  Users,
  X,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSidebarOpen } from "@/store/uiSlice";
import { api } from "@/services/api";
import { useLogoutMutation } from "@/services/authApi";
import { IconButton, Button } from "@/components/ui/Button";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/patients", label: "Patients", icon: Users },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      toast.error("Could not sign out cleanly. Redirecting…");
    }

    dispatch(api.util.resetApiState());
    dispatch(setSidebarOpen(false));
    router.replace("/login");
  };

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-300">
      <div className="flex h-16 shrink-0 items-center gap-2.5 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
          <HeartPulse className="h-5 w-5" />
        </span>
        <span className="text-lg font-semibold tracking-tight text-white">
          Doctor Tracker
        </span>
      </div>

      <nav aria-label="Main" className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-600 text-white shadow-sm"
                  : "hover:bg-slate-800 hover:text-white",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 px-3 pb-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleLogout}
          loading={isLoading}
          className="w-full justify-center border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <LogOut className="h-4 w-4 text-center" />
          Sign out
        </Button>
      </div>

      {/* <p className="px-5 py-4 text-xs text-slate-500">
        © {new Date().getFullYear()} Doctor Tracker
      </p> */}
    </div>
  );
}

export function Sidebar() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.ui.sidebarOpen);
  const close = () => dispatch(setSidebarOpen(false));

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-slate-900/50"
            onClick={close}
            aria-hidden
          />
          <aside className="relative h-full w-64 animate-slide-in">
            <SidebarContent onNavigate={close} />
            <IconButton
              label="Close menu"
              onClick={close}
              className="absolute right-2 top-4 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </IconButton>
          </aside>
        </div>
      )}
    </>
  );
}
