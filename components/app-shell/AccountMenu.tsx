"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/app/context/AuthContext";

type AccountMenuProps = {
  displayName?: string | null;
  userEmail?: string | null;
  /** public = browse site chrome; partner = workspace chrome */
  variant?: "public" | "partner";
};

/**
 * Shared signed-in account control for PublicShell and PartnerShell.
 */
export function AccountMenu({
  displayName,
  userEmail,
  variant = "public",
}: AccountMenuProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const initials = (displayName || userEmail || "G").slice(0, 2).toUpperCase();

  async function handleSignOut() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{displayName || "Account"}</span>
            {userEmail ? (
              <span className="text-xs font-normal text-muted-foreground">
                {userEmail}
              </span>
            ) : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {variant === "public" ? (
          <>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/personal">Workspace</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/">Homepage</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/marketplace">Marketplace</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/connect">Connect</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/notifications">Notifications</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/customer">Customer app</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/ops">Operations</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            void handleSignOut();
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
