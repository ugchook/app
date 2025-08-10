import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Moon, Sun, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { appearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        if (appearance === 'dark') {
            updateAppearance('light');
        } else {
            updateAppearance('dark');
        }
    };

    return (
        <div className="relative p-6 bg-white dark:bg-gray-900 sm:p-0">
            <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
                {/* Content Area */}
                <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
                    <div className="w-full max-w-md mx-auto mb-5 sm:pt-5">
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            <ArrowLeft className="size-5 mr-2" />
                            Back to home page
                        </Link>
                    </div>
                    
                    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                        <div>
                            <div className="sm:hidden mb-3 flex items-center justify-center">
                                <div className="dark:hidden">
                                    <img src="/images/logo/logo.svg" alt="Logo" />
                                </div>
                                <div className="hidden dark:block">
                                    <img src="/images/logo/logo-dark.svg" alt="Logo" />
                                </div>
                            </div>
                            
                            {title && (
                                <div className="mb-5 sm:mb-8">
                                    <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                                        {title}
                                    </h1>
                                    {description && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            )}
                            
                            {children}
                        </div>
                    </div>
                </div>

                {/* Right Side - Brand Area */}
                <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
                    <div className="relative flex items-center justify-center z-1">
                        {/* Grid Shape */}
                        <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
                            <img src="/images/shape/grid-01.svg" alt="grid" />
                        </div>
                        <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
                            <img src="/images/shape/grid-01.svg" alt="grid" />
                        </div>
                        
                        <div className="flex flex-col items-center max-w-xs">
                            <Link href="/" className="block mb-4">
                                <img
                                    width={231}
                                    height={48}
                                    src="/images/logo/auth-logo.svg"
                                    alt="Logo"
                                />
                            </Link>
                            <p className="text-center text-gray-400 dark:text-white/60">
                                Automated UGC for e-commerce brands
                            </p>
                        </div>
                    </div>
                </div>

                {/* Theme Toggler */}
                <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
                    <Button
                        onClick={toggleTheme}
                        className="inline-flex items-center justify-center text-white transition-colors rounded-full size-14 bg-brand-500 hover:bg-brand-600"
                    >
                        <Sun className="hidden dark:block h-5 w-5" />
                        <Moon className="dark:hidden h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
