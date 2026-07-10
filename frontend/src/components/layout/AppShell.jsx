import { Suspense, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu, Sprout, UserRound } from "lucide-react";
import { useLogoutMutation, useMeQuery, useUnreadCountQuery } from "@/api/apiSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { clearCredentials, selectAccessToken, selectCurrentUser, setCredentials } from "@/features/auth/authSlice";
import { dashboardItems, navItems } from "@/constants/navigation";
import { useSocketNotifications } from "@/hooks/useSocketNotifications";
import { cn } from "@/lib/utils";

export function AppShell() {
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectAccessToken);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const { data: profile, error: profileError } = useMeQuery(undefined, { skip: !token });
  const { data: unread } = useUnreadCountQuery(undefined, { skip: !user });
  useSocketNotifications();

  useEffect(() => {
    if (profile && token) {
      dispatch(setCredentials({ accessToken: token, user: profile }));
    }
  }, [dispatch, profile, token]);

  useEffect(() => {
    if (profileError?.status === 401) {
      dispatch(clearCredentials());
    }
  }, [dispatch, profileError]);

  const handleLogout = async () => {
    await logout().unwrap().catch(() => null);
    dispatch(clearCredentials());
    navigate("/login");
  };

  const items = [...navItems, ...dashboardItems].filter((item) => !item.auth || user).filter((item) => !item.roles || item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-slate-950">
            <span className="rounded-xl bg-primary p-2 text-white"><Sprout className="h-5 w-5" /></span>
            KrishiSetu
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => cn("rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100", isActive && "bg-green-50 text-primary")}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {user && (
              <Button variant="ghost" size="icon" aria-label="Notifications" onClick={() => navigate("/notifications")}>
                <Bell className="h-5 w-5" />
                {!!unread?.count && <Badge className="-ml-2 -mt-5 px-1.5 py-0">{unread.count}</Badge>}
              </Button>
            )}
            {user ? (
              <>
                <div className="hidden text-right text-sm md:block">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-muted-foreground">{user.role}</p>
                </div>
                <Button variant="outline" size="icon" onClick={handleLogout} aria-label="Logout"><LogOut className="h-4 w-4" /></Button>
              </>
            ) : (
              <Button onClick={() => navigate("/login")}><UserRound className="h-4 w-4" /> Sign in</Button>
            )}
            <Button className="lg:hidden" variant="ghost" size="icon" aria-label="Menu"><Menu className="h-5 w-5" /></Button>
          </div>
        </div>
      </header>
      <Suspense fallback={<LoadingScreen />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
