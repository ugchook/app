import { Calendar, CalendarClock, Clapperboard, Image, Images, SquareUserRound, VideoIcon } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="rounded-2xl p-5 lg:p-6">
                <div className="space-y-6">
                    <div className="flex flex-col items-center mb-4 md:mb-8 px-4">
                        <img 
                            src="/images/logo/logo-icon.svg" 
                            alt="UGCHook Icon" 
                            className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 rounded-[16px]" 
                        />
                        <h1 className="text-lg md:text-xl font-bold text-center dark:text-white/90">
                            Welcome to UGCHook
                        </h1>
                    </div>
                    <div className="max-w-2xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full px-4 md:px-0">
                            <Link 
                                href="/ai-avatar/ai-image" 
                                className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 md:p-6 rounded-[16px] cursor-pointer transition-all hover:bg-brand-50 dark:hover:bg-white/[0.09]"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-success-50 flex items-center justify-center">
                                        <Image className="text-success-500" />
                                    </div>
                                </div>
                                <h3 className="text-sm md:text-md font-medium mt-auto pt-4 md:pt-16 dark:text-white/90">
                                    Create AI Avatar Images
                                </h3>
                                <p className="text-xs md:text-sm text-gray-500 dark:text-white/70 mt-1">
                                    Create Realistic AI Avatars for UGC videos to promote your product demo
                                </p>
                            </Link>

                            <Link 
                                href="/ai-avatar/ai-video" 
                                className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 md:p-6 rounded-[16px] cursor-pointer transition-all hover:bg-brand-50 dark:hover:bg-white/[0.09]"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <SquareUserRound className="text-blue-500" />
                                    </div>
                                </div>
                                <h3 className="text-sm md:text-md font-medium mt-auto pt-4 md:pt-16 dark:text-white/90">
                                    Create AI Avatar Videos
                                </h3>
                                <p className="text-xs md:text-sm text-gray-500 dark:text-white/70 mt-1">
                                    Generate AI Avatar videos from AI Avatar images to promote your product demo
                                </p>
                            </Link>

                            <Link 
                                href="/ai-ugc" 
                                className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 md:p-6 rounded-[16px] cursor-pointer transition-all hover:bg-brand-50 dark:hover:bg-white/[0.09]"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-50 flex items-center justify-center">
                                        <VideoIcon className="text-orange-500" />
                                    </div>
                                </div>
                                <h3 className="text-sm md:text-md font-medium mt-auto pt-4 md:pt-16 dark:text-white/90">
                                    Hook + Demo Generator
                                </h3>
                                <p className="text-xs md:text-sm text-gray-500 dark:text-white/70 mt-1">
                                    Generate engaging hooks for your UGC videos to capture audience attention.
                                </p>
                            </Link>

                            <Link 
                                href="/ai-slideshow/list" 
                                className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 md:p-6 rounded-[16px] cursor-pointer transition-all hover:bg-brand-50 dark:hover:bg-white/[0.09]"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-50 flex items-center justify-center">
                                        <Images className="text-purple-500" />
                                    </div>
                                </div>
                                <h3 className="text-sm md:text-md font-medium mt-auto pt-4 md:pt-16 dark:text-white/90">
                                    AI Slideshows Generator
                                </h3>
                                <p className="text-xs md:text-sm text-gray-500 dark:text-white/70 mt-1">
                                    Generate stunning AI-powered slideshows from your images and text for engaging social media content.
                                </p>
                            </Link>

                            <Link 
                                href="/ai-content/list" 
                                className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 md:p-6 rounded-[16px] cursor-pointer transition-all hover:bg-brand-50 dark:hover:bg-white/[0.09]"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-pink-50 flex items-center justify-center">
                                        <Clapperboard className="text-pink-500" />
                                    </div>
                                </div>
                                <h3 className="text-sm md:text-md font-medium mt-auto pt-4 md:pt-16 dark:text-white/90">
                                    AI Stories Generator
                                </h3>
                                <p className="text-xs md:text-sm text-gray-500 dark:text-white/70 mt-1">
                                    Generate engaging AI-powered content and captions for your social media posts.
                                </p>
                            </Link>

                            <Link 
                                href="/schedule/calendar" 
                                className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 md:p-6 rounded-[16px] cursor-pointer transition-all hover:bg-brand-50 dark:hover:bg-white/[0.09]"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                                        <CalendarClock className="text-yellow-500" />
                                    </div>
                                </div>
                                <h3 className="text-sm md:text-md font-medium mt-auto pt-4 md:pt-16 dark:text-white/90">
                                    Schedule Calendar
                                </h3>
                                <p className="text-xs md:text-sm text-gray-500 dark:text-white/70 mt-1">
                                    Schedule your UGC videos for optimal social media engagement.
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
