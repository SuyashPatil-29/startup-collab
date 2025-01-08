"use client"
import { Home, Inbox, WalletCards } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

// Menu items.
const items = [
  {
    title: "Community",
    url: "/community",
    icon: Home,
  },
  {
    title: "My Posts",
    url: "/my-posts",
    icon: WalletCards,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Inbox,
  },
]

export function AppSidebar() {
  const router = useRouter()
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter>
          <Button
            onClick={async () => {
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/sign-in"); // redirect to login page
                  },
                },
              });
            }}
          >
            Sign out
          </Button>
        </SidebarFooter>
      </SidebarContent>
      <SidebarRail />
    </Sidebar >
  )
}
