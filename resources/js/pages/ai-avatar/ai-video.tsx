import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { 
    ChevronLeft, 
    ChevronRight, 
    Download, 
    Film, 
    Image, 
    MessageSquareShare, 
    RectangleVertical, 
    TriangleAlert, 
    VideoIcon, 
    X,
    Play,
    Pause,
    Volume2,
    VolumeX
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AiVideoProps {
    cdn: string;
    image?: any;
}

const words = [
    "Create a captivating video...",
    "Transform this image into a story...",
    "Bring this avatar to life...",
    "Generate an engaging video...",
    "Make this image move and speak..."
];

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
        title: 'AI Video',
        href: '/ai-avatar/ai-video',
    },
];

const AiVideo: React.FC<AiVideoProps> = ({ cdn, image: initialImage }) => {
    const [openPrompt, setOpenPrompt] = useState<boolean>(true);
    const [prompt, setPrompt] = useState<string>("");
    const [image, setImage] = useState<any>(initialImage);

    const [openGallery, setOpenGallery] = useState<boolean>(false);

    const [loadingVideos, setLoadingVideos] = useState<boolean>(true);
    const [videos, setVideos] = useState<any[]>([]);
    const [videoPage, setVideoPage] = useState(1);
    const [totalVideoPage, setTotalVideoPage] = useState(1);

    const [loadingImages, setLoadingImages] = useState<boolean>(true);
    const [images, setImages] = useState<any[]>([]);
    const [imagePage, setImagePage] = useState(1);
    const [totalImagePage, setTotalImagePage] = useState(1);

    const [isGenerating, setIsGenerating] = useState(false);
    const [openVideo, setOpenVideo] = useState<any>(null);
    const [openImage, setOpenImage] = useState<any>(null);

    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    const fetchImages = async (p = 1, limit = 12) => {
        try {
            let { data } = await axios.get(`/api/ai-image?page=${p}&status=completed&limit=${limit}`);
            if (data.status) {
                setImages(data.data);
                setTotalImagePage(data.last_page);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchVideos = async (p = 1) => {
        try {
            let { data } = await axios.get(`/api/ai-video?page=${p}&limit=12`);
            if (data.status) {
                let isPending = false;
                for (let i = 0; i < data.data.length; i++) {
                    let item = data.data[i];
                    if (item.status === "processing" || item.status === "pending") {
                        isPending = true;
                        break;
                    }
                }
                setVideos(data.data);
                setTotalVideoPage(data.last_page);

                // Clear any existing polling
                if (pollingRef.current) {
                    clearTimeout(pollingRef.current);
                }

                // Set up new polling if there are pending videos
                if (isPending) {
                    pollingRef.current = setTimeout(() => {
                        fetchVideos();
                    }, 3000);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchImages();
        fetchVideos();
    }, []);

    const handleGenerate = async () => {
        if (isGenerating) return;
        if (!prompt) {
            toast.error("Please enter video description");
            return;
        }
        if (!image) {
            toast.error("Please select an avatar image to generate video");
            return;
        }
        setIsGenerating(true);
        let payload = {
            prompt: prompt.trim(),
            imageId: image.id
        };
        try {
            let { data } = await axios.post("/api/ai-video", payload);
            console.log(data);
            if (data.status) {
                toast.success("Video processing started!");
                setPrompt("");
                setImage(null);
                fetchVideos();
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

    const handlePrevVideo = async () => {
        if (loadingVideos || videoPage == 1) return;
        let p = videoPage - 1;
        setVideoPage(p);
        setLoadingVideos(true);
        await fetchVideos(p);
        setLoadingVideos(false);
    };

    const handleNextVideo = async () => {
        if (loadingVideos) return;
        let p = videoPage + 1;
        setVideoPage(p);
        setLoadingVideos(true);
        await fetchVideos(p);
        setLoadingVideos(false);
    };

    const handlePrevImage = async () => {
        if (loadingImages || imagePage == 1) return;
        let p = imagePage - 1;
        setImagePage(p);
        setLoadingImages(true);
        await fetchImages(p);
        setLoadingImages(false);
    };

    const handleNextImage = async () => {
        if (loadingImages) return;
        let p = imagePage + 1;
        setImagePage(p);
        setLoadingImages(true);
        await fetchImages(p);
        setLoadingImages(false);
    };

    const handleOpenImage = async (item: any) => {
        setOpenImage(item);
        try {
            let { data } = await axios.get(`/api/ai-video?image_id=${item.id}`);
            if (data.status) {
                setVideos(data.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleOpenVideo = (item: any) => {
        setOpenVideo(item);
    };

    const handleDownload = (item: any) => {
        if (item.url) {
            const link = document.createElement('a');
            link.href = `${cdn}/${item.url}`;
            link.download = `video-${item.id}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const renderVideoStatus = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>;
            case 'processing':
                return <Badge variant="default">Processing</Badge>;
            case 'completed':
                return <Badge variant="default" className="bg-green-500">Completed</Badge>;
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const currentWord = words[Math.floor(Math.random() * words.length)];
    const dot = "...";

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI Avatar Video" />
            
            <div className="space-y-6 pb-24">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">AI Avatar Video</h1>
                        <p className="text-muted-foreground">Transform your AI avatar images into engaging videos</p>
                    </div>
                    <Button onClick={() => setOpenGallery(true)} variant="outline">
                        <Image className="h-4 w-4 mr-2" />
                        Select Image
                    </Button>
                </div>

                {/* Image Gallery Modal */}
                <Dialog open={openGallery} onOpenChange={setOpenGallery}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Select Avatar Image</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images.map((img) => (
                                    <div
                                        key={img.id}
                                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                            image?.id === img.id ? 'border-primary' : 'border-border'
                                        }`}
                                        onClick={() => {
                                            setImage(img);
                                            setOpenGallery(false);
                                        }}
                                    >
                                        <img
                                            src={`${cdn}/${img.url}`}
                                            alt="Avatar"
                                            className="w-full h-32 object-cover"
                                        />
                                        {image?.id === img.id && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                <div className="bg-primary text-primary-foreground rounded-full p-2">
                                                    <Image className="h-4 w-4" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Pagination */}
                            {totalImagePage > 1 && (
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handlePrevImage}
                                        disabled={imagePage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        {imagePage} / {totalImagePage}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleNextImage}
                                        disabled={imagePage === totalImagePage}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Selected Image Display */}
                {image && (
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    src={`${cdn}/${image.url}`}
                                    alt="Selected Avatar"
                                    className="w-20 h-20 rounded-lg object-cover"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground"
                                    onClick={() => setImage(null)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                            <div>
                                <h3 className="font-semibold">Selected Image</h3>
                                <p className="text-sm text-muted-foreground">{image.prompt}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Video Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Generated Videos</h2>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handlePrevVideo} disabled={videoPage === 1}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                {videoPage} / {totalVideoPage}
                            </span>
                            <Button variant="outline" size="sm" onClick={handleNextVideo} disabled={videoPage === totalVideoPage}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {videos.length === 0 ? (
                        <div className="text-center py-12">
                            <VideoIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">No videos yet</h3>
                            <p className="text-muted-foreground">Generate your first AI avatar video to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map((video) => (
                                <div
                                    key={video.id}
                                    className="group relative rounded-xl border bg-card overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                                    onClick={() => handleOpenVideo(video)}
                                >
                                    <div className="aspect-[9/16] bg-muted relative">
                                        {video.thumbnail_url ? (
                                            <img
                                                src={`${cdn}/${video.thumbnail_url}`}
                                                alt="Video thumbnail"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <VideoIcon className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        )}
                                        
                                        {video.status === 'completed' && (
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button size="icon" className="bg-white/20 hover:bg-white/30">
                                                    <Play className="h-6 w-6" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="text-sm text-muted-foreground line-clamp-2">{video.prompt}</p>
                                            {renderVideoStatus(video.status)}
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{new Date(video.created_at).toLocaleDateString()}</span>
                                            {video.status === 'completed' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownload(video);
                                                    }}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                                value={prompt} 
                                onChange={e => setPrompt(e.target.value)} 
                                maxLength={2000} 
                                className="w-full outline-none resize-none border-none bg-transparent text-sm placeholder:text-muted-foreground" 
                                placeholder={currentWord + dot} 
                                name="prompt"
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="relative group hidden md:block">
                                        <Button variant="outline" size="sm" className="inline-flex items-center gap-1">
                                            <RectangleVertical className="h-4 w-4" /> 9:16
                                        </Button>
                                        <div className="invisible absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
                                            <div className="relative">
                                                <div className="whitespace-nowrap rounded-lg bg-popover text-popover-foreground px-3 py-2 text-xs font-medium drop-shadow-lg">
                                                    Video will be generated to 9:16 aspect ratio
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

                {/* Video Modal */}
                <Dialog open={!!openVideo} onOpenChange={() => setOpenVideo(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Generated Video</DialogTitle>
                        </DialogHeader>
                        {openVideo && (
                            <div className="space-y-4">
                                <div className="aspect-[9/16] bg-muted rounded-lg overflow-hidden">
                                    {openVideo.url ? (
                                        <video 
                                            className="w-full h-full object-cover" 
                                            controls 
                                            autoPlay 
                                            src={`${cdn}/${openVideo.url}`}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <VideoIcon className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Description:</span>
                                        <span className="text-sm text-muted-foreground">{openVideo.prompt}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Status:</span>
                                        {renderVideoStatus(openVideo.status)}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Created:</span>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(openVideo.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                
                                {openVideo.status === 'completed' && (
                                    <Button 
                                        onClick={() => handleDownload(openVideo)} 
                                        className="w-full"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Video
                                    </Button>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
};

export default AiVideo;
