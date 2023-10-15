"use client";
import { Search } from "../search";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
          alt="Your Company"
        />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <Button className="rounded" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}
