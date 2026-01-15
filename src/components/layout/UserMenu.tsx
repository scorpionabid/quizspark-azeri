import { Link, useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Shield, GraduationCap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function UserMenu() {
  const { user, profile, role, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <Button variant="default" size="sm" asChild>
        <Link to="/auth">Daxil Ol</Link>
      </Button>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "İ";
  };

  const getRoleBadge = () => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="destructive" className="ml-2 text-xs">
            <Shield className="mr-1 h-3 w-3" />
            Admin
          </Badge>
        );
      case "teacher":
        return (
          <Badge variant="secondary" className="ml-2 text-xs">
            <GraduationCap className="mr-1 h-3 w-3" />
            Müəllim
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="ml-2 text-xs">
            Şagird
          </Badge>
        );
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-destructive" />;
      case "teacher":
        return <GraduationCap className="h-4 w-4 text-primary" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar_url || ""} alt="Avatar" />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center">
              <p className="text-sm font-medium leading-none">
                {profile?.full_name || "İstifadəçi"}
              </p>
              {getRoleBadge()}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Ayarlar
          </Link>
        </DropdownMenuItem>
        {role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/admin/dashboard" className="flex items-center">
                {getRoleIcon()}
                <span className="ml-2">Admin Paneli</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        {role === "teacher" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/teacher/dashboard" className="flex items-center">
                {getRoleIcon()}
                <span className="ml-2">Müəllim Paneli</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Çıxış
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
