import AppLogoIcon from './app-logo-icon';
import { useSidebar } from '@/components/ui/sidebar';

export default function AppLogo() {
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    return (
        <>
            <div className="flex aspect-square items-center justify-center rounded-md text-sidebar-primary-foreground">
                {isCollapsed ? (
                    <AppLogoIcon className="w-full" />
                ) : (
                    <>
                        <img src="/images/logo/logo.svg" alt="UGC Hook" className="dark:hidden" />
                        <img src="/images/logo/logo-dark.svg" alt="UGC Hook" className="hidden dark:block" />
                    </>
                )}
            </div>
        </>
    );
}
