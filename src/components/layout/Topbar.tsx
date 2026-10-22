// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { LogOut, Menu } from "lucide-react";
// import { toast } from "sonner";
// import { getInitials } from "@/lib/utils";
// import { api } from "@/services/api";
// import { useGetMeQuery, useLogoutMutation } from "@/services/authApi";
// import { useAppDispatch } from "@/store/hooks";
// import { setSidebarOpen } from "@/store/uiSlice";
// import { Avatar } from "@/components/ui/Avatar";
// import { Button, IconButton } from "@/components/ui/Button";

// export function Topbar() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const { data: user } = useGetMeQuery();
//   const [logout, { isLoading }] = useLogoutMutation();

//   const handleLogout = async () => {
//     try {
//       await logout().unwrap();
//     } catch {
//       toast.error("Could not sign out cleanly. Redirecting…");
//     }
//     dispatch(api.util.resetApiState());
//     router.replace("/login");
//   };

//   return (
//     <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6">
//       <IconButton
//         label="Open menu"
//         className="lg:hidden"
//         onClick={() => dispatch(setSidebarOpen(true))}
//       >
//         <Menu className="h-5 w-5" />
//       </IconButton>
//       <div className="hidden lg:block" />

//       <div className="flex items-center gap-3">
//         {user && (
//           <Link
//             href="/profile"
//             aria-label="My profile"
//             className="flex items-center gap-2.5 rounded-lg p-1 transition-colors hover:bg-slate-100"
//           >
//             <Avatar
//               initials={getInitials(user.name)}
//               src={user.profile}
//               alt={user.name}
//             />
//             <div className="hidden text-left leading-tight sm:block">
//               <p className="text-sm font-medium text-slate-900">{user.name}</p>
//               <p className="text-xs capitalize text-slate-500">
//                 {user.role.toLowerCase()}
//               </p>
//             </div>
//           </Link>
//         )}
//         <Button
//           variant="secondary"
//           size="sm"
//           onClick={handleLogout}
//           loading={isLoading}
//         >
//           <LogOut className="h-3.5 w-3.5" />
//           <span className="hidden sm:inline">Sign out</span>
//         </Button>
//       </div>
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useGetMeQuery } from "@/services/authApi";
import { useAppDispatch } from "@/store/hooks";
import { setSidebarOpen } from "@/store/uiSlice";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/Button";

export function Topbar() {
  const dispatch = useAppDispatch();
  const { data: user } = useGetMeQuery();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6">
      <IconButton
        label="Open menu"
        className="lg:hidden"
        onClick={() => dispatch(setSidebarOpen(true))}
      >
        <Menu className="h-5 w-5" />
      </IconButton>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        {user && (
          <Link
            href="/profile"
            aria-label="My profile"
            className="flex items-center gap-2.5 rounded-lg p-1 transition-colors hover:bg-slate-100"
          >
            <Avatar
              initials={getInitials(user.name)}
              src={user.profile}
              alt={user.name}
            />
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs capitalize text-slate-500">
                {user.role.toLowerCase()}
              </p>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}
