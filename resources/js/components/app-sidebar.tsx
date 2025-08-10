import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from '@/components/ui/sidebar';
import { type NavItemWithSub } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, 
    Image, 
    Clapperboard, 
    Images, 
    Calendar, 
    User, 
    HelpCircle, 
    CreditCard,
    Folder,
    BookOpen,
    Headphones,
    MessageSquare,
    Send,
} from 'lucide-react';
import {
    AudioIcon,
    LayoutDashboardIcon,
    SquareUserRoundIcon,
    VideoIcon,
    CalendarClockIcon,
    CircleHelpIcon,
    CreditCardIcon,
    SettingIcon,
    HorizontaLDots,
    ChevronDownIcon,
} from '@/components/icons';
import AppLogo from './app-logo';
import { useState, useEffect, useCallback } from 'react';

const dashboardItems: NavItemWithSub[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboardIcon,
    },
];

const navItems: NavItemWithSub[] = [
    {
        title: 'AI Voices',
        icon: AudioIcon,
        subItems: [
            { title: 'Text To Speech', href: '/ai-voice/text-to-speech', pro: false },
            { title: 'Speech To Text', href: '/ai-voice/speech-to-text', pro: false },
            { title: 'Speech To Speech', href: '/ai-voice/speech-to-speech', pro: false },
            { title: 'Voice Clone', href: '/ai-voice/voice-clone', pro: false },
        ],
    },
    {
        title: 'AI Avatars',
        icon: SquareUserRoundIcon,
        subItems: [
            { title: 'Text To Image', href: '/ai-avatar/ai-image', pro: false },
            { title: 'Image To Video', href: '/ai-avatar/ai-video', pro: false },
        ],
    },
    {
        title: 'Hook + Demo',
        href: '/ai-ugc',
        icon: VideoIcon,
    },
    {
        title: 'AI Avatar Talk',
        href: '/ai-avatar-talk',
        icon: MessageSquare,
    },
    {
        title: 'AI Slideshows',
        href: '/ai-slideshow/list',
        icon: Images,
    },
    {
        title: 'AI Stories',
        href: '/ai-content/list',
        icon: Clapperboard,
    },
];

const automationsItems: NavItemWithSub[] = [
    {
        title: 'Campaigns',
        href: '/campaign/list',
        icon: Send,
    },
    {
        title: 'Schedule & Calendar',
        href: '/schedule/calendar',
        icon: CalendarClockIcon,
    },
];

const othersItems: NavItemWithSub[] = [
    {
        title: 'FAQs',
        href: '/faq',
        icon: CircleHelpIcon,
    },
    {
        title: 'Subscription',
        href: '/subscription',
        icon: CreditCardIcon,
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: SettingIcon,
    },
];

const footerNavItems = [
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const page = usePage();
    const [openSubmenu, setOpenSubmenu] = useState<{
        type: "main" | "others";
        index: number;
    } | null>(null);

    const isActive = useCallback(
        (href: string) => {
            if (href === "/ai-content/list") {
                return page.url.includes(href) || page.url.includes("/ai-content/generate");
            }
            if (href === "/ai-slideshow/list") {
                return page.url.includes(href) || page.url.includes("/ai-slideshow/generate");
            }
            if (href === "/campaign/list") {
                return page.url.includes(href) || page.url.includes("/campaign/create");
            }
            return page.url.includes(href);
        },
        [page.url]
    );

    useEffect(() => {
        let submenuMatched = false;
        ["main", "others"].forEach((menuType) => {
            const items = menuType === "main" ? navItems : othersItems;
            items.forEach((nav, index) => {
                if (nav.subItems) {
                    nav.subItems.forEach((subItem) => {
                        if (isActive(subItem.href)) {
                            setOpenSubmenu({
                                type: menuType as "main" | "others",
                                index,
                            });
                            submenuMatched = true;
                        }
                    });
                }
            });
        });

        if (!submenuMatched) {
            setOpenSubmenu(null);
        }
    }, [page.url, isActive]);

    const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (
                prevOpenSubmenu &&
                prevOpenSubmenu.type === menuType &&
                prevOpenSubmenu.index === index
            ) {
                return null;
            }
            return { type: menuType, index };
        });
    };

    const renderMenuItems = (items: NavItemWithSub[], menuType: "dashboard" | "main" | "others" | "automations") => (
        <SidebarMenu>
            {items.map((nav, index) => (
                <SidebarMenuItem key={nav.title}>
                    {nav.subItems ? (
                        <SidebarMenuButton
                            onClick={() => handleSubmenuToggle(index, menuType)}
                            isActive={openSubmenu?.type === menuType && openSubmenu?.index === index}
                        >
                            {nav.icon && <nav.icon />}
                            <span>{nav.title}</span>
                            <ChevronDownIcon
                                className={`ml-auto w-4 h-4 transition-transform duration-200 ${
                                    openSubmenu?.type === menuType && openSubmenu?.index === index
                                        ? "rotate-180"
                                        : ""
                                }`}
                            />
                        </SidebarMenuButton>
                    ) : (
                        nav.href && (
                            <SidebarMenuButton asChild isActive={isActive(nav.href)}>
                                <Link href={nav.href} prefetch>
                                    {nav.icon && <nav.icon />}
                                    <span>{nav.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        )
                    )}
                    {nav.subItems && (
                        <SidebarMenuSub className={openSubmenu?.type === menuType && openSubmenu?.index === index ? "block" : "hidden"}>
                            {nav.subItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                        asChild
                                        isActive={isActive(subItem.href)}
                                    >
                                        <Link href={subItem.href} prefetch>
                                            {subItem.title}
                                            <span className="flex items-center gap-1 ml-auto">
                                                {subItem.new && (
                                                    <span className="ml-auto px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        new
                                                    </span>
                                                )}
                                                {subItem.pro && (
                                                    <span className="ml-auto px-2 py-1 text-xs font-medium rounded-md bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                        pro
                                                    </span>
                                                )}
                                            </span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    )}
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {renderMenuItems(dashboardItems, "dashboard")}
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Tools</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {renderMenuItems(navItems, "main")}
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Automations</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {renderMenuItems(automationsItems, "automations")}
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {renderMenuItems(othersItems, "others")}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
