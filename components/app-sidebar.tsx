"use client"

import * as React from "react"
import {BookOpen, Bot, Command, Frame, LifeBuoy, Map, PieChart, Send, Settings2, SquareTerminal,} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {NavProjects} from "@/components/nav-projects"
import {NavSecondary} from "@/components/nav-secondary"
import {NavUser} from "@/components/nav-user"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
	navMain: [
		{
			title: "Keys",
			url: "/dashboard/keys",
			icon: BookOpen,
			items: [
				{
					title: "Add new key",
					url: "/dashboard/keys/add",
				},
			],
		},
		{
			title: "Computers",
			url: "/dashboard/computers",
			icon: SquareTerminal,
			isActive: true,
		},
		{
			title: "Users",
			url: "/dashboard/users",
			icon: Bot,
			items: [
				{
					title: "Add new user",
					url: "/dashboard/users/add",
				},
			],
		},
		{
			title: "Settings",
			url: "#",
			icon: Settings2,
			items: [
				{
					title: "General",
					url: "#",
				},
				{
					title: "Team",
					url: "#",
				},
				{
					title: "Billing",
					url: "#",
				},
				{
					title: "Limits",
					url: "#",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Support",
			url: "#",
			icon: LifeBuoy,
		},
		{
			title: "Feedback",
			url: "#",
			icon: Send,
		},
	],
	projects: [
		{
			name: "Design Engineering",
			url: "#",
			icon: Frame,
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: PieChart,
		},
		{
			name: "Travel",
			url: "#",
			icon: Map,
		},
	],
}

// Định nghĩa các prop của AppSidebar
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	user: {username: string};  // Thông tin người dùng
}

export function AppSidebar({...props}: AppSidebarProps) {
	return (
		<Sidebar
			className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
			{...props}
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="#">
								<div
									className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<Command className="size-4"/>
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">Laundry</span>
									<span className="truncate text-xs">Dashboard</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain}/>
				<NavProjects projects={data.projects}/>
				<NavSecondary items={data.navSecondary} className="mt-auto"/>
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={props.user}/>
			</SidebarFooter>
		</Sidebar>
	)
}
