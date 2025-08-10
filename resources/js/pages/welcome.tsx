import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const words = [
        "Drive Traffic",
        "Boost Sales",
        "Increase Engagement",
        "Grow Your Brand"
    ];

    return (
        <>
            <Head title="UGC Hook - Automate TikTok, Reels that Drive Traffic">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <meta name="description" content="Automate TikTok, Reels that Drive Traffic to your website. Your 24/7 content team, powered by AI." />
                <meta name="keywords" content="AI, TikTok, Reels, automation, content creation, social media" />
                <meta property="og:title" content="UGC Hook - Automate TikTok, Reels that Drive Traffic" />
                <meta property="og:description" content="Your 24/7 content team, powered by AI. Automate your TikTok & Reels in just a few clicks!" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="UGC Hook - Automate TikTok, Reels that Drive Traffic" />
                <meta name="twitter:description" content="Your 24/7 content team, powered by AI. Automate your TikTok & Reels in just a few clicks!" />
            </Head>
            
            {/* Header */}
            <Header userId={auth.user?.id?.toString()} />
            
            <main>
                {/* Banner Section */}
                <Banner currentWord={words[0]} />
                
                {/* Features Section */}
                <Features />
                
                {/* Single Feature Section */}
                <SingleFeature />
                
                {/* Get Started Today Section */}
                <GetStartedToday />
                
                {/* Testimonial Section */}
                <Testimonial />
                
                {/* Pricing Section */}
                <Pricing />
                
                {/* FAQ Section */}
                <Faq />
            </main>
            
            {/* Footer */}
            <Footer />
        </>
    );
}

// Header Component
const Header = ({ userId }: { userId?: string }) => {
    const [open, setOpen] = useState(false);

    return (
        <header className="py-4 sticky top-0 bg-white z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="relative z-50 flex justify-between">
                    <div className="flex items-center md:gap-x-12">
                        <Link href="/" aria-label="Home">
                            <img src="/images/logo/logo.svg" alt="UGC Hook" className="h-8 lg:h-10 w-auto" />
                        </Link>
                        <div className="hidden md:flex md:gap-x-6">
                            <Link href="/#features" className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                                Features
                            </Link>
                            <Link href="/#pricing" className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                                Pricing
                            </Link>
                            <Link href="/privacy-policy" className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-of-service" className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-5 md:gap-x-8">
                        {!userId ? (
                            <>
                                <div className="hidden md:block">
                                    <Link href={route('login')} className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                                        Sign In
                                    </Link>
                                </div>
                                <Link href={route('register')} className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600">
                                    <span>Get started <span className="hidden lg:inline">today</span></span>
                                </Link>
                            </>
                        ) : (
                            <Link href={route('dashboard')} className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600">
                                <span>Go to Dashboard</span>
                            </Link>
                        )}

                        <div className="-mr-1 md:hidden">
                            <button
                                className="relative z-10 flex h-8 w-8 items-center justify-center focus:not-data-focus:outline-hidden"
                                aria-label="Toggle Navigation"
                                type="button"
                                onClick={() => setOpen(!open)}
                            >
                                <svg aria-hidden="true" className="h-3.5 w-3.5 overflow-visible stroke-slate-700" fill="none" strokeWidth="2" strokeLinecap="round">
                                    <path d="M0 1H14M0 7H14M0 13H14" className={`origin-center transition ${open ? 'scale-90 opacity-0' : ''}`}></path>
                                    <path d="M2 2L12 12M12 2L2 12" className={`origin-center transition ${open ? '' : 'scale-90 opacity-0'}`}></path>
                                </svg>
                            </button>
                            {open && (
                                <>
                                    <div onClick={() => setOpen(false)} className="fixed inset-0 bg-slate-300/50 duration-150"></div>
                                    <div className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 ring-1 shadow-xl ring-slate-900/5">
                                        <Link onClick={() => setOpen(false)} className="block w-full p-2" href="/#features">Features</Link>
                                        <Link onClick={() => setOpen(false)} className="block w-full p-2" href="/#pricing">Pricing</Link>
                                        <Link onClick={() => setOpen(false)} className="block w-full p-2" href="/privacy-policy">Privacy Policy</Link>
                                        <Link onClick={() => setOpen(false)} className="block w-full p-2" href="/terms-of-service">Terms of Service</Link>
                                        <hr className="m-2 border-slate-300/40" />
                                        {!userId ? (
                                            <Link onClick={() => setOpen(false)} className="block w-full p-2" href={route('login')}>Sign In</Link>
                                        ) : (
                                            <Link onClick={() => setOpen(false)} className="block w-full p-2" href={route('dashboard')}>Go to Dashboard</Link>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

// Banner Component
const Banner = ({ currentWord }: { currentWord: string }) => {
    const [videoMode, setVideoMode] = useState<{ [key: number]: boolean }>({});
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    const words = [
        "Drive Traffic",
        "Boost Sales",
        "Increase Engagement",
        "Grow Your Brand"
    ];

    // Rotate words every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [words.length]);

    const handlePlay = (index: number) => {
        setVideoMode(prev => ({ ...prev, [index]: true }));
    };

    const DemoItem = ({ thumbnail, video, rotate, transform, index }: { thumbnail: string; video: string; rotate: string; transform: string; index: number }) => (
        <div
            className="min-w-[164px] max-w-[180px] flex-shrink-0 group md:mt-8 z-0"
            style={{ transform: transform }}>
            <div className="relative w-[164px] shrink-0 aspect-[9/16] cursor-pointer overflow-hidden transition-all duration-300 hover:z-20 shadow-xl hover:shadow-2xl cursor-pointer" style={{ transform: rotate }}>
                {videoMode[index] ? (
                    <video src={video} className="rounded-2xl border-4 border-white shadow-lg object-cover w-full h-full" autoPlay controls playsInline/>
                ) : (
                    <div onClick={() => handlePlay(index)} className="relative w-full h-full group/item transition-all duration-300 ease-in-out">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-2xl z-10"></div>
                        <img alt="Preview" src={thumbnail} className="rounded-2xl border-4 border-white shadow-lg object-cover w-full h-full transition-transform duration-500 ease-out" />
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all duration-300 ease-in-out shadow-[0_0_10px_rgba(255,255,255,0.7)] transform group-hover/item:scale-110">
                                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-brand-500 border-b-[8px] border-b-transparent ml-1"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
                <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
                    Automate Tiktok, Reels that
                    <br />
                    <span className="relative whitespace-nowrap text-blue-600">
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 418 42"
                            className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
                            preserveAspectRatio="none"
                        >
                            <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
                        </svg>
                        <span className="relative">
                            {words[currentWordIndex]}
                        </span>
                    </span>
                    <br className='lg:hidden' />
                    {""} to your website
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
                    Your 24/7 content team, powered by AI
                </p>
                <div className="mt-10 flex justify-center gap-x-6">
                    <Link
                        href={route('register')}
                        className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900"
                    >
                        Get started
                    </Link>
                    <Link
                        href="#"
                        className="group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-hidden ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300"
                    >
                        <svg aria-hidden="true" className="h-3 w-3 flex-none fill-blue-600 group-active:fill-current">
                            <path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z"></path>
                        </svg>
                        <span className="ml-3">Watch video</span>
                    </Link>
                </div>
                <div className="mt-36 lg:mt-44">
                    <div className='flex items-center justify-center gap-1 lg:gap-0'>
                        <div className='z-10 flex -space-x-4 rtl:space-x-reverse scale-75 -ml-1'>
                            <div className='relative transition-transform hover:z-10 hover:scale-110'>
                                <img src="/images/user/user-01.jpg" className='h-10 w-10 rounded-full border-2 border-white transition-all duration-200' alt="" />
                            </div>
                            <div className='relative transition-transform hover:z-10 hover:scale-110'>
                                <img src="/images/user/user-02.jpg" className='h-10 w-10 rounded-full border-2 border-white transition-all duration-200' alt="" />
                            </div>
                            <div className='relative transition-transform hover:z-10 hover:scale-110'>
                                <img src="/images/user/user-03.jpg" className='h-10 w-10 rounded-full border-2 border-white transition-all duration-200' alt="" />
                            </div>
                            <div className='relative transition-transform hover:z-10 hover:scale-110'>
                                <img src="/images/user/user-04.jpg" className='h-10 w-10 rounded-full border-2 border-white transition-all duration-200' alt="" />
                            </div>
                            <div className='relative transition-transform hover:z-10 hover:scale-110 hidden lg:block'>
                                <img src="/images/user/user-05.jpg" className='h-10 w-10 rounded-full border-2 border-white transition-all duration-200' alt="" />
                            </div>
                            <div className='relative transition-transform hover:z-10 hover:scale-110 hidden lg:block'>
                                <img src="/images/user/user-06.jpg" className='h-10 w-10 rounded-full border-2 border-white transition-all duration-200' alt="" />
                            </div>
                        </div>
                        <p className="font-display text-base text-slate-900">Trusted by <span className='font-bold'>1000+</span> happy users</p>
                    </div>

                    <div className='relative flex h-auto w-full flex-col items-center justify-center rounded-lg my-8'>
                        <div className='flex rounded-xl flex-row items-center justify-center gap-4 md:gap-6 overflow-x-auto overflow-y-hidden w-full no-scrollbar pb-4'>
                            <DemoItem thumbnail='https://cdn.ugchook.com/landing/hook/hook_01.jpg' video='https://cdn.ugchook.com/landing/hook/hook_01.mp4' rotate='rotate(2deg)' transform='translateY(-8px)' index={0} />
                            <DemoItem thumbnail='https://cdn.ugchook.com/landing/hook/hook_02.jpg' video='https://cdn.ugchook.com/landing/hook/hook_02.mp4' rotate='rotate(-1deg)' transform='translateY(8px)' index={1} />
                            <DemoItem thumbnail='https://cdn.ugchook.com/landing/hook/hook_03.jpg' video='https://cdn.ugchook.com/landing/hook/hook_03.mp4' rotate='rotate(0deg)' transform='translateY(-8px)' index={2} />
                            <DemoItem thumbnail='https://cdn.ugchook.com/landing/hook/hook_04.jpg' video='https://cdn.ugchook.com/landing/hook/hook_04.mp4' rotate='rotate(2deg)' transform='translateY(8px)' index={3} />
                            <DemoItem thumbnail='https://cdn.ugchook.com/landing/hook/hook_05.jpg' video='https://cdn.ugchook.com/landing/hook/hook_05.mp4' rotate='rotate(-1deg)' transform='translateY(-8px)' index={4} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Features Component
const Features = () => {
    const [activeFeature, setActiveFeature] = useState(0);

    return (
        <section id="features" className="relative overflow-hidden bg-blue-600 pt-20 pb-28 sm:py-32">
            <img alt="" loading="lazy" width="2245" height="1636" decoding="async" data-nimg="1" className="absolute top-1/2 left-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]" src="/images/landing/background-features.jpg" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
                    <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
                        Everything you need to run your marketing
                    </h2>
                    <p className="mt-6 text-lg tracking-tight text-blue-100">Explore our powerful solutions to automate, optimize, and grow your brand effortlessly</p>
                </div>

                <div className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0">
                    <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                        <div className="relative z-10 flex gap-x-4 px-4 whitespace-nowrap sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                            <div onClick={() => setActiveFeature(0)} className={`group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6 ${activeFeature === 0 ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-white/10 lg:ring-inset' : 'hover:bg-white/10 lg:hover:bg-white/5'}`}>
                                <h3>
                                    <button className={`font-display text-lg data-selected:not-data-focus:outline-hidden ${activeFeature == 0 ? 'text-blue-600 ' : 'text-blue-100 hover:text-white'} lg:text-white`}>
                                        <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none"></span>
                                        AI Avatar Generator
                                    </button>
                                </h3>
                                <p className="mt-2 hidden text-sm lg:block text-white">Create ultra-realistic avatars that act as your digital spokesperson, eliminating the need to hire creators or appear on camera.</p>
                            </div>
                            <div onClick={() => setActiveFeature(1)} className={`group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6 ${activeFeature === 1 ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-white/10 lg:ring-inset' : 'hover:bg-white/10 lg:hover:bg-white/5'}`}>
                                <h3>
                                    <button className={`font-display text-lg data-selected:not-data-focus:outline-hidden ${activeFeature == 1 ? 'text-blue-600 ' : 'text-blue-100 hover:text-white'} lg:text-white`}>
                                        <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none"></span>
                                        AI Video Hook Generator
                                    </button>
                                </h3>
                                <p className="mt-2 hidden text-sm lg:block text-white">Instantly generate short, high-impact video hooks designed to grab attention and boost engagement.</p>
                            </div>
                            <div onClick={() => setActiveFeature(2)} className={`group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6 ${activeFeature === 2 ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-white/10 lg:ring-inset' : 'hover:bg-white/10 lg:hover:bg-white/5'}`}>
                                <h3>
                                    <button className={`font-display text-lg data-selected:not-data-focus:outline-hidden ${activeFeature == 2 ? 'text-blue-600 ' : 'text-blue-100 hover:text-white'} lg:text-white`}>
                                        <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none"></span>
                                        AI Video Combiner
                                    </button>
                                </h3>
                                <p className="mt-2 hidden text-sm lg:block text-white">
                                    Merge your AI-generated hook video with your video in one click. Ensure a seamless transition that keeps viewers engaged and maximizes watch time. No editing skills required!
                                </p>
                            </div>
                            <div onClick={() => setActiveFeature(3)} className={`group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6 ${activeFeature === 3 ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-white/10 lg:ring-inset' : 'hover:bg-white/10 lg:hover:bg-white/5'}`}>
                                <h3>
                                    <button className={`font-display text-lg data-selected:not-data-focus:outline-hidden ${activeFeature == 3 ? 'text-blue-600 ' : 'text-blue-100 hover:text-white'} lg:text-white`}>
                                        <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none"></span>
                                        Schedule | Automation
                                    </button>
                                </h3>
                                <p className="mt-2 hidden text-sm lg:block text-white">Plan, auto-post, and manage your TikTok & Reels effortlessly, ensuring consistency and maximizing reach without manual effort.</p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-7">
                        <div style={{ display: activeFeature === 0 ? 'block' : 'none' }}>
                            <div className="absolute -inset-x-4 top-[-6.5rem] bottom-[-4.25rem] bg-white/10 ring-1 ring-white/10 ring-inset sm:inset-x-0 sm:rounded-t-xl"></div>
                            <div className="relative sm:px-6 lg:hidden">
                                <div className="absolute -inset-x-4 top-[-6.5rem] bottom-[-4.25rem] bg-white/10 ring-1 ring-white/10 ring-inset sm:inset-x-0 sm:rounded-t-xl"></div>
                                <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">Create ultra-realistic avatars that act as your digital spokesperson, eliminating the need to hire creators or appear on camera.</p>
                            </div>
                            <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                                <img src="https://cdn.ugchook.com/landing/features/feature_1.png" alt="AI Avatar Generator" className="w-full" />
                            </div>
                        </div>
                        <div style={{ display: activeFeature === 1 ? 'block' : 'none' }}>
                            <div className="absolute -inset-x-4 top-[-6.5rem] bottom-[-4.25rem] bg-white/10 ring-1 ring-white/10 ring-inset sm:inset-x-0 sm:rounded-t-xl"></div>
                            <div className="relative sm:px-6 lg:hidden">
                                <div className="absolute -inset-x-4 top-[-6.5rem] bottom-[-4.25rem] bg-white/10 ring-1 ring-white/10 ring-inset sm:inset-x-0 sm:rounded-t-xl"></div>
                                <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">Instantly generate short, high-impact video hooks designed to grab attention and boost engagement.</p>
                            </div>
                            <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                                <img src="https://cdn.ugchook.com/landing/features/feature_2.png" alt="AI Video Hook Generator" className="w-full" />
                            </div>
                        </div>
                        <div style={{ display: activeFeature === 2 ? 'block' : 'none' }}>
                            <div className="absolute -inset-x-4 top-[-6.5rem] bottom-[-4.25rem] bg-white/10 ring-1 ring-white/10 ring-inset sm:inset-x-0 sm:rounded-t-xl"></div>
                            <div className="relative sm:px-6 lg:hidden">
                                <div className="absolute -inset-x-4 top-[-6.5rem] bottom-[-4.25rem] bg-white/10 ring-1 ring-white/10 ring-inset sm:inset-x-0 sm:rounded-t-xl"></div>
                                <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">Merge your AI-generated hook video with your video in one click. Ensure a seamless transition that keeps viewers engaged and maximizes watch time. No editing skills required!</p>
                            </div>
                            <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                                <img src="https://cdn.ugchook.com/landing/features/feature_3.png" alt="AI Video Combiner" className="w-full" />
                            </div>
                        </div>
                        <div style={{ display: activeFeature === 3 ? 'block' : 'none' }}>
                            <div className="absolute -inset-x-4 top-[-6.5rem] bottom-[-4.25rem] bg-white/10 ring-1 ring-white/10 ring-inset sm:inset-x-0 sm:rounded-t-xl"></div>
                            <div className="relative sm:px-6 lg:hidden">
                                <div className="absolute -inset-x-4 top-[-6.5rem] bottom-[-4.25rem] bg-white/10 ring-1 ring-white/10 ring-inset sm:inset-x-0 sm:rounded-t-xl"></div>
                                <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">Plan, auto-post, and manage your TikTok & Reels effortlessly, ensuring consistency and maximizing reach without manual effort.</p>
                            </div>
                            <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                                <img src="https://cdn.ugchook.com/landing/features/feature_4.png" alt="Schedule | Automation" className="w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// SingleFeature Component
const SingleFeature = () => {
    const [activeFeature, setActiveFeature] = useState(0);

    const steps = [
        {
            title: "Write hook description",
            step: "Step 1: Describe Your Video",
            description: "Write a short description of your video idea, and our AI will generate the perfect hook text and hook video to grab attention",
            icon: "M13 10V3L4 14h7v7l9-11h-7z"
        },
        {
            title: "Generate AI content",
            step: "Step 2: Generate AI Content",
            description: "Our AI creates engaging hook videos and captions that are designed to maximize engagement and drive traffic to your website",
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        },
        {
            title: "Schedule & automate",
            step: "Step 3: Schedule & Automate",
            description: "Schedule your content to be posted automatically across TikTok and Reels, ensuring consistent posting without manual effort",
            icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        }
    ];

    return (
        <section className="pt-20 pb-14 sm:pt-32 sm:pb-20 lg:pb-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl md:text-center">
                    <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">Just 3 Simple Steps to automate, stay viral</h2>
                    <p className="mt-4 text-lg tracking-tight text-slate-700">Effortlessly automate your TikTok and Reels content, saving you time while keeping your posts fresh, engaging, and viral. Schedule, optimize, and grow—without the hassle</p>
                </div>

                <div className="-mx-4 mt-20 flex flex-col gap-y-10 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
                    {steps.map((step, index) => (
                        <div key={index}>
                            <div className="mx-auto max-w-2xl">
                                <div className="w-9 h-9 rounded-lg bg-blue-600">
                                    <svg className="text-white w-full h-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                                    </svg>
                                </div>
                                <h3 className="mt-6 text-sm font-medium text-blue-600">{step.title}</h3>
                                <p className="mt-2 font-display text-xl text-slate-900">{step.step}</p>
                                <p className="mt-4 text-sm text-slate-600">{step.description}</p>
                            </div>
                            <div className="relative mt-10 pb-10">
                                <div className="absolute -inset-x-4 top-8 bottom-0 bg-slate-200 sm:-inset-x-6"></div>
                                <div className="relative mx-auto w-auto overflow-hidden rounded-xl bg-white ring-1 shadow-lg shadow-slate-900/5 ring-slate-500/10">
                                    <img src={`https://cdn.ugchook.com/landing/steps/step_${index + 1}.png`} className="w-full scale-125 -translate-x-[14%] -translate-y-[14%]" alt={step.step} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hidden lg:mt-20 lg:block">
                    <div className="grid grid-cols-3 gap-x-8">
                        {steps.map((step, index) => (
                            <div key={index} onClick={() => setActiveFeature(index)} className={activeFeature === index ? "relative" : "relative opacity-75 hover:opacity-100"}>
                                <div className={`w-9 rounded-lg ${activeFeature === index ? "bg-blue-600" : "bg-slate-500"}`}>
                                    <svg className="text-white w-full h-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                                    </svg>
                                </div>
                                <div className={`mt-6 text-sm font-medium ${activeFeature === index ? "text-blue-600" : "text-slate-600"}`}>
                                    <button className="data-selected:not-data-focus:outline-hidden">
                                        <span className="absolute inset-0"></span>
                                        {step.title}
                                    </button>
                                </div>
                                <p className="mt-2 font-display text-xl text-slate-900">{step.step}</p>
                                <p className="mt-4 text-sm text-slate-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10">
                        <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                            <img src={`https://cdn.ugchook.com/landing/steps/step_${activeFeature + 1}.png`} alt={`Step ${activeFeature + 1}`} className="w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// GetStartedToday Component
const GetStartedToday = () => {
    return (
        <section className="relative overflow-hidden bg-blue-600 py-32">
            <img src="/images/landing/background-call-to-action.jpg" className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2" alt="" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">Get started today</h2>
                    <p className="mt-4 text-lg tracking-tight text-white">Get started today and automate your TikTok & Reels in just a few clicks! Save time, boost engagement, and stay consistent effortlessly. Let AI handle the hard work while you focus on creating amazing content!</p>
                    <Link href={route('register')} className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 bg-white text-slate-900 hover:bg-blue-50 active:bg-blue-200 active:text-slate-600 focus-visible:outline-white mt-10">Get started</Link>
                </div>
            </div>
        </section>
    );
};

// Testimonial Component
const Testimonial = () => {
    const data = [
        {
            content: "UGCHook makes it incredibly easy to generate AI Avatar Videos for TikTok and Reels. It's a game-changer for our social media strategy.",
            name: "Alex Johnson",
            role: "Marketing Manager at Creative Solutions",
            avatar: "/images/user/user-01.jpg",
        },
        {
            content: "The AI Avatar Videos from UGCHook have significantly boosted our engagement on TikTok and Reels. Highly recommend!",
            name: "Emily Davis",
            role: "Social Media Specialist at Trendy Corp",
            avatar: "/images/user/user-02.jpg",
        },
        {
            content: "UGCHook's AI Avatar Video feature is a must-have for any business looking to enhance their social media presence.",
            name: "Michael Lee",
            role: "Content Creator at Viral Media",
            avatar: "/images/user/user-03.jpg",
        },
    ];

    return (
        <section className="bg-slate-50 py-20 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl md:text-center">
                    <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
                        Loved by customers worldwide.
                    </h2>
                    <p className="mt-4 text-lg tracking-tight text-slate-700">
                        Our software is so simple that people can't help but fall in love with it. Simplicity is easy when you just skip tons of mission-critical features.
                    </p>
                </div>

                <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
                    {data.map((item, index) => (
                        <li key={index}>
                            <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
                                <svg aria-hidden="true" width="105" height="78" className="absolute top-6 left-6 fill-slate-100">
                                    <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z"></path>
                                </svg>
                                <blockquote className="relative">
                                    <p className="text-lg tracking-tight text-slate-900">
                                        {item.content}
                                    </p>
                                </blockquote>
                                <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                                    <div>
                                        <div className="font-display text-base text-slate-900">{item.name}</div>
                                        <div className="mt-1 text-sm text-slate-500">{item.role}</div>
                                    </div>
                                    <div className="overflow-hidden rounded-full bg-slate-50">
                                        <img src={item.avatar} className="h-14 w-14 object-cover" alt={item.name} />
                                    </div>
                                </figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

// Pricing Component
const Pricing = () => {
    const [period, setPeriod] = useState("monthly");

    const plans = [
        {
            name: "Starter",
            description: "Perfect for individuals and small creators",
            monthlyPrice: 29,
            yearlyPrice: 290,
            features: [
                "5 AI Avatar Videos per month",
                "Basic video editing tools",
                "Email support",
                "Standard templates",
                "720p video quality"
            ],
            popular: false
        },
        {
            name: "Professional",
            description: "Ideal for growing businesses and content creators",
            monthlyPrice: 79,
            yearlyPrice: 790,
            features: [
                "25 AI Avatar Videos per month",
                "Advanced video editing tools",
                "Priority email support",
                "Custom templates",
                "1080p video quality",
                "Social media scheduling",
                "Analytics dashboard"
            ],
            popular: true
        },
        {
            name: "Enterprise",
            description: "For large teams and agencies",
            monthlyPrice: 199,
            yearlyPrice: 1990,
            features: [
                "Unlimited AI Avatar Videos",
                "Advanced AI features",
                "Dedicated support",
                "Custom branding",
                "4K video quality",
                "Team collaboration",
                "API access",
                "White-label options"
            ],
            popular: false
        }
    ];

    return (
        <section id="pricing" className="bg-slate-900 py-20 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="md:text-center">
                    <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
                        <span className="relative whitespace-nowrap">
                            <svg aria-hidden="true" viewBox="0 0 281 40" preserveAspectRatio="none" className="absolute top-1/2 left-0 h-[1em] w-full fill-blue-400">
                                <path fillRule="evenodd" clipRule="evenodd" d="M240.172 22.994c-8.007 1.246-15.477 2.23-31.26 4.114-18.506 2.21-26.323 2.977-34.487 3.386-2.971.149-3.727.324-6.566 1.523-15.124 6.388-43.775 9.404-69.425 7.31-26.207-2.14-50.986-7.103-78-15.624C10.912 20.7.988 16.143.734 14.657c-.066-.381.043-.344 1.324.456 10.423 6.506 49.649 16.322 77.8 19.468 23.708 2.65 38.249 2.95 55.821 1.156 9.407-.962 24.451-3.773 25.101-4.692.074-.104.053-.155-.058-.135-1.062.195-13.863-.271-18.848-.687-16.681-1.389-28.722-4.345-38.142-9.364-15.294-8.15-7.298-19.232 14.802-20.514 16.095-.934 32.793 1.517 47.423 6.96 13.524 5.033 17.942 12.326 11.463 18.922l-.859.874.697-.006c2.681-.026 15.304-1.302 29.208-2.953 25.845-3.07 35.659-4.519 54.027-7.978 9.863-1.858 11.021-2.048 13.055-2.145a61.901 61.901 0 0 0 4.506-.417c1.891-.259 2.151-.267 1.543-.047-.402.145-2.33.913-4.285 1.707-4.635 1.882-5.202 2.07-8.736 2.903-3.414.805-19.773 3.797-26.404 4.829Zm40.321-9.93c.1-.066.231-.085.29-.041.059.043-.024.096-.183.119-.177.024-.219-.007-.107-.079ZM172.299 26.22c9.364-6.058 5.161-12.039-12.304-17.51-11.656-3.653-23.145-5.47-35.243-5.576-22.552-.198-33.577 7.462-21.321 14.814 12.012 7.205 32.994 10.557 61.531 9.831 4.563-.116 5.372-.288 7.337-1.559Z"></path>
                            </svg>
                            <span className="relative">Simple pricing,</span>
                        </span> for everyone.
                    </h2>
                    <p className="mt-4 text-lg text-slate-400">
                        Choose the perfect plan for your content creation needs. Start free, scale as you grow.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="mt-8 flex justify-center">
                    <div className="relative rounded-full p-1 bg-slate-800">
                        <button
                            onClick={() => setPeriod("monthly")}
                            className={`relative rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                                period === "monthly" ? "text-slate-900 bg-white shadow-sm" : "text-slate-300 hover:text-white"
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setPeriod("yearly")}
                            className={`relative rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                                period === "yearly" ? "text-slate-900 bg-white shadow-sm" : "text-slate-300 hover:text-white"
                            }`}
                        >
                            Yearly
                            <span className="ml-1 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">Save 20%</span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-2xl bg-slate-800 p-8 shadow-sm ring-1 ring-slate-700 ${
                                plan.popular ? "ring-blue-500 shadow-blue-500/25" : ""
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                                    <div className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
                                        Most Popular
                                    </div>
                                </div>
                            )}
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                                <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
                                <div className="mt-6 flex items-baseline justify-center">
                                    <span className="text-4xl font-bold text-white">
                                        ${period === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                                    </span>
                                    <span className="ml-1 text-sm text-slate-400">
                                        /{period === "monthly" ? "month" : "year"}
                                    </span>
                                </div>
                                <ul className="mt-8 space-y-3 text-sm">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center">
                                            <svg className="h-4 w-4 flex-shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="ml-3 text-slate-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={route('register')}
                                    className={`mt-8 block w-full rounded-lg px-3 py-2 text-center text-sm font-semibold transition-colors ${
                                        plan.popular
                                            ? "bg-blue-500 text-white hover:bg-blue-400"
                                            : "bg-slate-700 text-white hover:bg-slate-600"
                                    }`}
                                >
                                    Get started
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// FAQ Component
const Faq = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            question: "What is UGC Hook?",
            answer: "UGC Hook is an AI-powered platform that helps you create engaging TikTok and Reels content automatically. It generates AI avatars, video hooks, and schedules your content to maximize engagement and drive traffic to your website."
        },
        {
            question: "How does the AI Avatar Generator work?",
            answer: "Our AI Avatar Generator creates ultra-realistic digital spokespersons that can represent your brand. Simply provide a description of your content, and our AI will generate a custom avatar that matches your requirements. No need to hire creators or appear on camera yourself."
        },
        {
            question: "What video quality do you support?",
            answer: "We support multiple video quality options: 720p for Starter plans, 1080p for Professional plans, and 4K for Enterprise plans. All videos are optimized for social media platforms like TikTok and Instagram Reels."
        },
        {
            question: "Can I schedule my content?",
            answer: "Yes! Our platform includes advanced scheduling features that allow you to plan and automatically post your content across multiple platforms. You can set posting schedules, review content before publishing, and track performance analytics."
        },
        {
            question: "Do you offer refunds?",
            answer: "We offer a 30-day money-back guarantee for all our plans. If you're not satisfied with our service within the first 30 days, we'll provide a full refund, no questions asked."
        },
        {
            question: "Is my content safe and secure?",
            answer: "Absolutely. We take data security seriously and use enterprise-grade encryption to protect your content and personal information. We never share your content with third parties without your explicit consent."
        }
    ];

    return (
        <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-32">
            <img src="/images/landing/background-faq.jpg" className="absolute top-0 left-1/2 max-w-none -translate-y-1/4 translate-x-[-30%]" style={{ color: "transparent", height: 946 }} alt="" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 id="faq-title" className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
                        Frequently asked questions
                    </h2>
                    <p className="mt-4 text-lg tracking-tight text-slate-700">If you can't find what you're looking for, email our support team and if you're lucky someone will get back to you.</p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {faqs.map((faq, index) => (
                        <div key={index} className="relative">
                            <button
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="flex w-full items-start justify-between text-left"
                            >
                                <span className="text-lg font-semibold text-slate-900">{faq.question}</span>
                                <span className="ml-6 flex h-7 items-center">
                                    <svg
                                        className={`h-6 w-6 transform transition-transform ${
                                            openFaq === index ? "rotate-180" : ""
                                        }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>
                            {openFaq === index && (
                                <div className="mt-4 text-base text-slate-600">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Footer Component
const Footer = () => {
    return (
        <footer className="bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="py-16">
                    <img className="h-8 w-auto mx-auto" src="/images/logo/logo.svg" alt="UGC Hook" />
                    <nav className="mt-10 text-sm" aria-label="quick links">
                        <div className="-my-1 flex justify-center gap-x-6">
                            <Link href="/#features" className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">Features</Link>
                            <Link href="/#pricing" className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">Pricing</Link>
                            <Link href="/privacy-policy" className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">Privacy Policy</Link>
                        </div>
                    </nav>
                </div>
                <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
                    <div className="flex gap-x-6">
                        <Link href="https://x.com/ugchook" className="group" aria-label="UGC Hook on X">
                            <svg className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700" aria-hidden="true" viewBox="0 0 24 24">
                                <path d="M13.3174 10.7749L19.1457 4H17.7646L12.7039 9.88256L8.66193 4H4L10.1122 12.8955L4 20H5.38119L10.7254 13.7878L14.994 20H19.656L13.3171 10.7749H13.3174ZM11.4257 12.9738L10.8064 12.0881L5.87886 5.03974H8.00029L11.9769 10.728L12.5962 11.6137L17.7652 19.0075H15.6438L11.4257 12.9742V12.9738Z"></path>
                            </svg>
                        </Link>
                        <Link href="https://www.linkedin.com/in/ugchook" className="group" aria-label="UGC Hook on Linkedin">
                            <svg
                                className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z"
                                    fill=""
                                />
                            </svg>
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-slate-500 sm:mt-0">Copyright © {new Date().getFullYear()} UGC Hook. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};


