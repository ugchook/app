import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'FAQ',
        href: '/faq',
    },
];

export default function FaqIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="FAQ" />
            <div className="rounded-2xl p-5 lg:p-6">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold dark:text-white/90">Frequently Asked Questions</h1>
                            <p className="text-gray-500 dark:text-white/70">Find answers to common questions about UGCHook</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Coming Soon</h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                This feature is currently under development.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
