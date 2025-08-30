import { ChevronLeft, ChevronRight, Download, Film, Image, Instagram, MessageSquareShare, RectangleVertical, ScanFace, TriangleAlert, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'AI Avatar',
        href: '/ai-avatar',
    },
    {
        title: 'AI Image',
        href: '/ai-avatar/ai-image',
    },
];

const words = [
    "Describe your image...",
    "Girl with long blonde hair, bookshelf in background",
    "Asian man, modern office setting",
    "Woman with short hair, gym environment",
    "Indian girl, sunset in background",
    "Elderly woman, garden background",
    "Woman with curly hair, kitchen background",
    "Teenage boy, bedroom setting",
    "Girl sitting in car, girl wearing blue sweater",
    "Guy student sitting in lecture hall",
    "Bald guy wearing suit"
];

export default function AiImage() {
    const [openPrompt, setOpenPrompt] = useState(true);
    const [prompt, setPrompt] = useState('');
    const [selfie, setSelfie] = useState(true);
    const [openSelfie, setOpenSelfie] = useState(false);
    const [loadingImages, setLoadingImages] = useState(true);
    const [images, setImages] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [openImage, setOpenImage] = useState<any>(null);
    const [loadingVideos, setLoadingVideos] = useState(false);
    const [videos, setVideos] = useState<any[]>([]);
    const [openVideo, setOpenVideo] = useState<any>(null);

    const pollingRef = useRef<NodeJS.Timeout | null>(null);
    const [currentWord, setCurrentWord] = useState('');
    const [index, setIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [dot, setDot] = useState('|');

    const fetchImages = async (p = 1) => {
        try {
            const response = await fetch(`/api/image/list?page=${p}`);
            const data = await response.json();
            
            if (data.status) {
                let isPending = false;
                for (let i = 0; i < data.images.length; i++) {
                    let item = data.images[i];
                    if (item.status === "processing") {
                        isPending = true;
                        break;
                    }
                }
                setImages(data.images);
                setTotalPage(data.totalPage);

                // Clear any existing polling
                if (pollingRef.current) {
                    clearTimeout(pollingRef.current);
                }

                // Set up new polling if there are pending images
                if (isPending) {
                    pollingRef.current = setTimeout(() => {
                        fetchImages();
                    }, 3000);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchImages().then(() => {
            setLoadingImages(false);
        });

        // Cleanup polling on unmount
        return () => {
            if (pollingRef.current) {
                clearTimeout(pollingRef.current);
            }
        };
    }, []);

    // Typing animation effect
    useEffect(() => {
        const typeSpeed = 50;
        const deleteSpeed = 10;
        const pauseAfterTyping = 5000;
        const pauseAfterDeleting = 500;

        const handleTyping = () => {
            const currentText = words[index];
            if (!isDeleting) {
                setCurrentWord(currentText.substring(0, currentWord.length + 1));
                if (currentWord === currentText) {
                    setTimeout(() => setIsDeleting(true), pauseAfterTyping);
                }
            } else {
                setCurrentWord(currentText.substring(0, currentWord.length - 1));
                if (currentWord === "") {
                    setIsDeleting(false);
                    setIndex((prevIndex) => (prevIndex + 1) % words.length);
                    setTimeout(() => { }, pauseAfterDeleting);
                }
            }
        };

        const timer = setTimeout(
            handleTyping,
            isDeleting ? deleteSpeed : typeSpeed
        );

        return () => clearTimeout(timer);
    }, [currentWord, isDeleting, index, words]);

    // Blinking cursor effect
    useEffect(() => {
        const timer = setInterval(() => {
            setDot(dot => dot === "" ? "|" : "");
        }, 500);
        return () => clearInterval(timer);
    }, []);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target;
        let currentHeight = textarea.scrollHeight;
        if (currentHeight > 120) {
            return;
        }

        textarea.style.height = 'auto';
        const totalHeight = textarea.scrollHeight;
        textarea.style.height = `${totalHeight}px`;
    };

    const handleGenerate = async () => {
        if (isGenerating) return;
        if (!prompt) {
            toast.error("Please enter image description.");
            return;
        }
        
        setIsGenerating(true);
        const payload = {
            prompt: prompt.trim(),
            selfie
        };
        
        try {
            const response = await fetch("/api/image/generate", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(payload)
            });
            
            const data = await response.json();
            
            if (data.status) {
                toast.success("Image processing started!");
                setPrompt("");
                fetchImages();
                let el = document.querySelector("textarea");
                if (el) {
                    el.style.height = 'auto';
                }
            } else {
                if (data.message) {
                    toast.error(data.message);
                } else {
                    toast.error("An error occurred. Please try again later.");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again later.");
        }
        setIsGenerating(false);
    };

    const handlePrev = async () => {
        if (loadingImages || page == 1) return;
        let p = page - 1;
        setPage(p);
        setLoadingImages(true);
        await fetchImages(p);
        setLoadingImages(false);
    };

    const handleNext = async () => {
        if (loadingImages) return;
        let p = page + 1;
        setPage(p);
        setLoadingImages(true);
        await fetchImages(p);
        setLoadingImages(false);
    };

    const handleOpenImage = async (item: any) => {
        setOpenImage(item);
        setOpenVideo(null);
        setVideos([]);
        setLoadingVideos(true);
        try {
            const response = await fetch(`/api/video/list?image_id=${item.id}&status=completed`);
            const data = await response.json();
            if (data.status) {
                setVideos(data.videos);
            }
        } catch (e) {
            console.error(e);
        }
        setLoadingVideos(false);
    };

    const renderImage = (item: any) => {
        if (item.status == "failed") {
            return (
                <div className="bg-destructive/10 rounded-xl text-destructive w-full h-full flex flex-col gap-1 items-center justify-center">
                    <TriangleAlert className="w-8 h-8 stroke-[1] mx-auto" />
                    <span className="text-xs">Failed</span>
                </div>
            );
        }
        if (item.status == "nsfw") {
            return (
                <div className="bg-destructive/10 rounded-xl text-destructive w-full h-full flex flex-col gap-1 items-center justify-center">
                    <TriangleAlert className="w-8 h-8 stroke-[1] mx-auto" />
                    <span className="text-xs">NSFW content</span>
                </div>
            );
        }
        if (item.status == "completed" && item.url) {
            return (
                <img 
                    onClick={() => handleOpenImage(item)} 
                    src={item.image_url} 
                    loading="lazy" 
                    className="object-cover rounded-xl w-full h-full hover:opacity-70 transition-opacity duration-300 cursor-pointer" 
                />
            );
        } else {
            return (
                <div className="bg-muted animate-pulse object-cover rounded-xl w-full h-full flex flex-col gap-1 items-center justify-center">
                    <img loading="lazy" src="/images/logo/logo-icon.svg" className="w-12 h-12 mx-auto" />
                    <div className="text-xs text-muted-foreground">Generating...</div>
                    <div className="text-xs text-muted-foreground">Est 10-30s</div>
                </div>
            );
        }
    };

    const handleDownload = async (item: any) => {
        if (item.url) {
            const link = document.createElement('a');
            link.href = item.image_url;
            link.download = `ai-avatar-${item.id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        setOpenImage(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI Image Generator" />
            
            {totalPage > 1 ? (
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <h2 className="text-xl font-semibold text-foreground">
                        Avatar Images
                    </h2>
                    <div className="flex items-center justify-end gap-2">
                        <Button 
                            variant="outline" 
                            size="icon"
                            onClick={handlePrev} 
                            disabled={page == 1 || loadingImages}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="text-sm text-muted-foreground">
                            Page {page} of {totalPage}
                        </div>
                        <Button 
                            variant="outline" 
                            size="icon"
                            onClick={handleNext} 
                            disabled={page == totalPage || loadingImages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="mb-3">
                    <h2 className="text-xl font-semibold text-foreground">
                        Avatar Images
                    </h2>
                </div>
            )}

            <div className="flex-1 rounded-2xl pb-24">
                <div className="space-y-6">
                    {loadingImages ? (
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 lg:gap-3">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="aspect-[9/16] w-full">
                                    <div className="bg-muted animate-pulse object-cover rounded-xl w-full h-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {images.length ? (
                                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 lg:gap-3">
                                    {images.map((item, index) => (
                                        <div key={index} className="aspect-[9/16] w-full">
                                            {renderImage(item)}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="mx-auto flex flex-col items-center justify-center gap-4 h-full">
                                        <Image className="w-18 h-18 stroke-[1] text-muted-foreground" />
                                        <h3 className="font-semibold text-foreground text-theme-xl sm:text-2xl text-center">
                                            You haven't created any Avatar Image yet
                                        </h3>
                                        <p className="text-sm text-muted-foreground sm:text-base">
                                            Let's generate your first Avatar Image!
                                        </p>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Floating Prompt */}
            <div className={`fixed z-50 bottom-6 fixed-prompt transition-all duration-300 ${openPrompt ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className="relative bg-background border rounded-xl shadow-lg mx-auto max-w-[600px]">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className="absolute -top-3 -right-3 rounded-full shadow-lg hover:bg-muted" 
                        onClick={() => setOpenPrompt(false)}
                    >
                        <X className="w-5 h-5" />
                    </Button>
                    <div className="flex w-full flex-col gap-2 px-4 py-3">
                        <textarea 
                            onInput={handleInput} 
                            value={prompt} 
                            onChange={e => setPrompt(e.target.value)} 
                            maxLength={2000} 
                            className="w-full outline-none resize-none border-none bg-transparent text-sm placeholder:text-muted-foreground" 
                            placeholder={currentWord + dot} 
                            name="prompt"
                        />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="relative group">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setOpenSelfie(!openSelfie)} 
                                        className="inline-flex items-center gap-1"
                                    >
                                        {selfie ? (
                                            <>
                                                <ScanFace className="h-4 w-4" /> 
                                                <span>Selfie</span>
                                            </>
                                        ) : (
                                            <>
                                                <Instagram className="h-4 w-4" /> 
                                                <span>No selfie</span>
                                            </>
                                        )}
                                    </Button>
                                    <div className={`${openSelfie ? "opacity-100" : "invisible opacity-0"} absolute p-2 z-40 left-0 -top-[100px] w-[200px] rounded-xl border bg-background shadow-lg transition-all duration-300`}>
                                        <ul className="flex flex-col gap-1">
                                            <li 
                                                onClick={() => {
                                                    setSelfie(true);
                                                    setOpenSelfie(false);
                                                }} 
                                                className="cursor-pointer px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg font-medium flex items-center gap-2"
                                            >
                                                <ScanFace className="h-4 w-4" /> 
                                                <span>Selfie</span>
                                            </li>
                                            <li 
                                                onClick={() => {
                                                    setSelfie(false);
                                                    setOpenSelfie(false);
                                                }} 
                                                className="cursor-pointer px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg font-medium flex items-center gap-2"
                                            >
                                                <Instagram className="h-4 w-4" /> 
                                                <span>No selfie</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative group hidden md:block">
                                    <Button variant="outline" size="sm" className="inline-flex items-center gap-1">
                                        <RectangleVertical className="h-4 w-4" /> 9:16
                                    </Button>
                                    <div className="invisible absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
                                        <div className="relative">
                                            <div className="whitespace-nowrap rounded-lg bg-popover text-popover-foreground px-3 py-2 text-xs font-medium drop-shadow-lg">
                                                Image will be generated to 9:16 aspect ratio
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative group hidden md:block">
                                    <Button variant="outline" size="icon" className="inline-flex">
                                        <svg className="h-5 w-5 stroke-[2]" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.71 9.005a.734.734 0 0 0 .295-.295l2.35-4.327a.734.734 0 0 1 1.29 0l2.35 4.327c.068.125.17.227.295.295l4.327 2.35a.734.734 0 0 1 0 1.29l-4.327 2.35a.735.735 0 0 0-.295.295l-2.35 4.327a.734.734 0 0 1-1.29 0l-2.35-4.327a.734.734 0 0 0-.294-.295l-4.327-2.35a.734.734 0 0 1 0-1.29l4.327-2.35Z"></path>
                                        </svg>
                                    </Button>
                                    <div className="invisible absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
                                        <div className="relative">
                                            <div className="whitespace-nowrap rounded-lg bg-popover text-popover-foreground px-3 py-2 text-xs font-medium drop-shadow-lg">
                                                Generate will use 1 credit
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    onClick={handleGenerate} 
                                    disabled={isGenerating} 
                                    className="inline-flex items-center gap-1"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                            Generating...
                                        </>
                                    ) : (
                                        "Generate"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Bubble */}
            <div className={`fixed z-50 bottom-6 fixed-bubble transition-all duration-300 ${!openPrompt ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-muted shadow-lg hover:bg-muted/80" 
                    onClick={() => setOpenPrompt(true)}
                >
                    <MessageSquareShare className="h-8 w-8" />
                </Button>
            </div>

            {/* Image Dialog */}
            <Dialog open={!!openImage} onOpenChange={() => setOpenImage(null)}>
                <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Generated Avatar Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {openImage && (
                            <>
                                <div className="flex flex-col md:flex-row items-start gap-4">
                                    <div className="h-[300px] lg:h-[400px] aspect-[9/16] mx-auto flex items-center justify-center relative">
                                        {openVideo ? (
                                            <video className="object-contain rounded-xl" controls autoPlay src={openVideo.url} />
                                        ) : (
                                            <img className="object-contain rounded-xl" src={openImage.image_url} />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="space-y-2">
                                            <div className="text-sm">
                                                <span className="font-semibold">Description: </span> 
                                                <span>{openImage.prompt}</span>
                                            </div>
                                            <div className="font-semibold">Actions</div>
                                            <div className="flex flex-col gap-2">
                                                <Button 
                                                    onClick={() => handleDownload(openImage)} 
                                                    className="w-full"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download
                                                </Button>
                                                <Button 
                                                    variant="destructive"
                                                    onClick={() => {
                                                        setOpenImage(null);
                                                        router.visit(`/ai-avatar/ai-video?ai_image_id=${openImage.id}`);
                                                    }} 
                                                    className="w-full"
                                                >
                                                    <Film className="w-4 h-4 mr-2" />
                                                    Create Video Avatar
                                                </Button>
                                                <Button 
                                                    variant="outline"
                                                    onClick={() => setOpenImage(null)} 
                                                    className="w-full"
                                                >
                                                    Close
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="font-semibold">
                                                Avatar Videos ({videos.length})
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                {loadingVideos ? (
                                                    <>
                                                        {Array.from({ length: 6 }).map((_, i) => (
                                                            <div key={i} className="aspect-[9/16] w-full">
                                                                <div className="bg-muted animate-pulse object-cover rounded-lg w-full h-full"></div>
                                                            </div>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <>
                                                        {videos.map((item, index) => (
                                                            <div 
                                                                onClick={() => setOpenVideo(openVideo?.id == item.id ? null : item)} 
                                                                key={index} 
                                                                className={`relative cursor-pointer border-2 rounded-lg ${openVideo?.id == item.id ? "border-primary" : "border-transparent"}`}
                                                            >
                                                                <img 
                                                                    src={item.image_thumbnail} 
                                                                    loading="lazy" 
                                                                    className="object-cover rounded-lg w-full h-full hover:opacity-70 transition-opacity duration-300" 
                                                                />
                                                                <img 
                                                                    src="/assets/play-button.png" 
                                                                    alt="Play" 
                                                                    className="w-[42px] h-[42px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" 
                                                                />
                                                            </div>
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
