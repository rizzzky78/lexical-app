import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  Bell,
  Calendar,
  ChevronDown,
  Home,
  Inbox,
  LogOut,
  Plus,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";

export function ComplexSidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const items = [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      badge: 3,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];

  const subItems = [
    {
      title: "Users",
      url: "#",
      icon: Users,
    },
    {
      title: "Add User",
      url: "#",
      icon: Plus,
    },
  ];

  return (
    <Sidebar>
      {/* Sidebar Header */}
      <SidebarHeader>
        <div className="flex items-center justify-between w-full px-4 py-2">
          <Bell className="h-6 w-6" /> {/* Header Icon */}
          <span className="font-bold text-lg">Dashboard</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Sidebar Group */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center justify-between">
              <span>Application</span> <Inbox className="h-4 w-4 ml-2" />{" "}
              {/* Group Header Icon */}
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center">
                      <item.icon className="h-5 w-5 mr-2" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs font-bold leading-none text-white">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* Sidebar Sub Menu */}
              <SidebarMenuItem>
                <SidebarMenuSub>
                  <SidebarMenuSubTrigger>
                    <div className="flex items-center">
                      <span>Management</span>{" "}
                      <ChevronDown className="h-4 w-4 ml-2" />{" "}
                      {/* Sub Header Icon */}
                    </div>
                  </SidebarMenuSubTrigger>
                  <SidebarMenuSubContent>
                    {subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuButton asChild>
                          <a href={subItem.url} className="flex items-center">
                            <subItem.icon className="h-5 w-5 mr-2" />
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSubContent>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        <div className="px-4 py-2">
          <button className="flex items-center w-full text-left">
            <User className="h-5 w-5 mr-2" /> {/* Footer Icon */}
            Account
          </button>
          <button className="flex items-center w-full text-left mt-2">
            <LogOut className="h-5 w-5 mr-2" /> {/* Footer Icon */}
            Logout
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
