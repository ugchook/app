import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen flex flex-col bg-brand-950">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/40">
                <Link href="/" className="flex items-center gap-2">
                    <AppLogoIcon className="h-8 w-8" />
                    <span className="text-xl font-bold">UGC Hook</span>
                </Link>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
                        <p className="text-muted-foreground">{description}</p>
                    </div>
                    {children}
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border/40 p-4 text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} UGC Hook. All rights reserved.</p>
            </div>
        </div>
    );
}
