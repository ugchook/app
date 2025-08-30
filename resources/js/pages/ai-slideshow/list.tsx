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
    MessageSquareShare, 
    X,
    Play,
    Pause,
    Volume2,
    VolumeX,
    FileText,
    Sparkles,
    Share2,
    Settings,
    Trash2,
    Image as ImageIcon,
    Film
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const words = [
    // "Educational Listical"
    "Describe your educational content...",
    "5 effective study techniques for students",
    "Top 10 historical events that shaped modern society",
    "Understanding photosynthesis: A step-by-step guide",
    "Essential math concepts every student should know",

    // "Personal Relatable"
    "Share your personal story...",
    "My journey through college and what I learned",
    "How I overcame social anxiety and made new friends",
    "My morning routine that changed my life",
    "Living abroad: My experience in a new culture",

    // "Poetic Emotional"
    "Express your feelings...",
    "The sunset reminds me of childhood memories",
    "Dancing in the rain, finding joy in simple moments",
    "Letters I never sent to those I've loved",
    "Whispers of autumn leaves falling gently",

    // "AI Narrative"
    "Create an AI story...",
    "When machines learned to dream",
    "The first AI that understood human emotions",
    "Digital consciousness: A new form of existence",
    "Robots and humans: A tale of two species",

    // "Text Wall"
    "Write your detailed content...",
    "Complete guide to starting a successful business",
    "Understanding climate change and its global impact",
    "The history of internet and digital revolution",
    "Deep dive into quantum computing basics",
];

type SlideshowType = "Educational Listical" | "Personal Relatable" | "Poetic Emotional" | "AI Narrative" | "Text Wall";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'AI Slideshow',
        href: '/ai-slideshow',
    },
    {
        title: 'List',
        href: '/ai-slideshow/list',
    },
];

const AiSlideshow: React.FC = () => {
    const [openPrompt, setOpenPrompt] = useState<boolean>(true);
    const [prompt, setPrompt] = useState<string>("");
    const [type, setType] = useState<SlideshowType>("Educational Listical");
    const [openType, setOpenType] = useState<boolean>(false);

    const [loadingSlideshows, setLoadingSlideshows] = useState<boolean>(true);
    const [slideshows, setSlideshows] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const [isGenerating, setIsGenerating] = useState(false);
    const [openSlideshow, setOpenSlideshow] = useState<any>(null);
    const [viewMode, setViewMode] = useState<"image" | "video">("image");
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    const fetchSlideshows = async (p = 1) => {
        try {
            let { data } = await axios.get(`/api/ai-slideshow?page=${p}&limit=12`);
            if (data.status) {
                let isPending = false;
                for (let i = 0; i < data.data.length; i++) {
                    let item = data.data[i];
                    if (item.status === "processing" || item.status === "pending") {
                        isPending = true;
                        break;
                    }
                }
                setSlideshows(data.data);
                setTotalPage(data.last_page);

                // Clear any existing polling
                if (pollingRef.current) {
                    clearTimeout(pollingRef.current);
                }

                // Set up new polling if there are pending slideshows
                if (isPending) {
                    pollingRef.current = setTimeout(() => {
                        fetchSlideshows();
                    }, 3000);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchSlideshows();
    }, []);

    const handleGenerate = async () => {
        if (isGenerating) return;
        if (!prompt) {
            toast.error("Please enter slideshow description.");
            return;
        }
        setIsGenerating(true);
        let payload = {
            prompt: prompt.trim(),
            type: type
        };
        try {
            let { data } = await axios.post("/api/ai-slideshow", payload);
            console.log(data);
            if (data.status) {
                toast.success(data.message || "Slideshow generation started!");
                setPrompt("");
                fetchSlideshows();
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
        if (loadingSlideshows || page == 1) return;
        let p = page - 1;
        setPage(p);
        setLoadingSlideshows(true);
        await fetchSlideshows(p);
        setLoadingSlideshows(false);
    };

    const handleNext = async () => {
        if (loadingSlideshows) return;
        let p = page + 1;
        setPage(p);
        setLoadingSlideshows(true);
        await fetchSlideshows(p);
        setLoadingSlideshows(false);
    };

    const handleOpenSlideshow = (item: any) => {
        setOpenSlideshow(item);
        setActiveImageIndex(0);
        setViewMode("image");
    };

    const handleDownload = (item: any) => {
        if (item.output && item.output.video_url) {
            const link = document.createElement('a');
            link.href = item.output.video_url;
            link.download = `slideshow-${item.id}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const renderSlideshowStatus = (status: string) => {
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

    const getSlideshowTypeIcon = (type: string) => {
        switch (type) {
            case 'Educational Listical':
                return <FileText className="h-5 w-5 text-blue-500" />;
            case 'Personal Relatable':
                return <Sparkles className="h-5 w-5 text-purple-500" />;
            case 'Poetic Emotional':
                return <Sparkles className="h-5 w-5 text-pink-500" />;
            case 'AI Narrative':
                return <Settings className="h-5 w-5 text-indigo-500" />;
            case 'Text Wall':
                return <FileText className="h-5 w-5 text-orange-500" />;
            default:
                return <FileText className="h-5 w-5 text-gray-500" />;
        }
    };

    const currentWord = words[Math.floor(Math.random() * words.length)];
    const dot = "...";

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI Slideshow Generator" />
            
            <div className="space-y-6 pb-24">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">AI Slideshow Generator</h1>
                        <p className="text-muted-foreground">Create engaging slideshows with AI assistance</p>
                    </div>
                </div>

                {/* Slideshow Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Generated Slideshows</h2>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handlePrev} disabled={page === 1}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                {page} / {totalPage}
                            </span>
                            <Button variant="outline" size="sm" onClick={handleNext} disabled={page === totalPage}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {slideshows.length === 0 ? (
                        <div className="text-center py-12">
                            <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">No slideshows yet</h3>
                            <p className="text-muted-foreground">Generate your first AI slideshow to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {slideshows.map((slideshow) => (
                                <div
                                    key={slideshow.id}
                                    className="group relative rounded-xl border bg-card overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                                    onClick={() => handleOpenSlideshow(slideshow)}
                                >
                                    <div className="aspect-[9/16] bg-muted relative">
                                        {slideshow.output && slideshow.output.thumbnail_url ? (
                                            <img
                                                src={slideshow.output.thumbnail_url}
                                                alt="Slideshow thumbnail"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Film className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        )}
                                        
                                        {slideshow.status === 'completed' && (
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button size="icon" className="bg-white/20 hover:bg-white/30">
                                                    <Play className="h-6 w-6" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getSlideshowTypeIcon(slideshow.type)}
                                                <Badge variant="outline" className="text-xs">
                                                    {slideshow.type}
                                                </Badge>
                                            </div>
                                            {renderSlideshowStatus(slideshow.status)}
                                        </div>
                                        
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                            {slideshow.prompt}
                                        </p>
                                        
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{new Date(slideshow.created_at).toLocaleDateString()}</span>
                                            {slideshow.status === 'completed' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownload(slideshow);
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
                                    <div className="relative group">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => setOpenType(!openType)} 
                                            className="inline-flex items-center gap-1"
                                        >
                                            {getSlideshowTypeIcon(type)}
                                            <span>{type}</span>
                                        </Button>
                                        <div className={`${openType ? "opacity-100" : "invisible opacity-0"} absolute p-2 z-40 left-0 -top-[300px] w-[250px] rounded-xl border bg-background shadow-lg transition-all duration-300`}>
                                            <ul className="flex flex-col gap-1">
                                                {[
                                                    "Educational Listical",
                                                    "Personal Relatable", 
                                                    "Poetic Emotional",
                                                    "AI Narrative",
                                                    "Text Wall"
                                                ].map((slideshowType) => (
                                                    <li 
                                                        key={slideshowType}
                                                        onClick={() => {
                                                            setType(slideshowType as SlideshowType);
                                                            setOpenType(false);
                                                        }} 
                                                        className="cursor-pointer px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg font-medium flex items-center gap-2"
                                                    >
                                                        {getSlideshowTypeIcon(slideshowType)}
                                                        <span>{slideshowType}</span>
                                                    </li>
                                                ))}
                                            </ul>
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

                {/* Slideshow Modal */}
                <Dialog open={!!openSlideshow} onOpenChange={() => setOpenSlideshow(null)}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Generated Slideshow</DialogTitle>
                        </DialogHeader>
                        {openSlideshow && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 mb-4">
                                    {getSlideshowTypeIcon(openSlideshow.type)}
                                    <div>
                                        <h3 className="font-semibold">{openSlideshow.type}</h3>
                                        <p className="text-sm text-muted-foreground">{openSlideshow.prompt}</p>
                                    </div>
                                    {renderSlideshowStatus(openSlideshow.status)}
                                </div>
                                
                                {/* View Mode Toggle */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={viewMode === "image" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setViewMode("image")}
                                    >
                                        <ImageIcon className="h-4 w-4 mr-2" />
                                        Images
                                    </Button>
                                    <Button
                                        variant={viewMode === "video" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setViewMode("video")}
                                    >
                                        <Film className="h-4 w-4 mr-2" />
                                        Video
                                    </Button>
                                </div>
                                
                                {openSlideshow.output && (
                                    <div className="space-y-4">
                                        {viewMode === "image" && openSlideshow.output.images && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium">Slideshow Images</h4>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setActiveImageIndex(Math.max(0, activeImageIndex - 1))}
                                                            disabled={activeImageIndex === 0}
                                                        >
                                                            <ChevronLeft className="h-4 w-4" />
                                                        </Button>
                                                        <span className="text-sm text-muted-foreground">
                                                            {activeImageIndex + 1} / {openSlideshow.output.images.length}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setActiveImageIndex(Math.min(openSlideshow.output.images.length - 1, activeImageIndex + 1))}
                                                            disabled={activeImageIndex === openSlideshow.output.images.length - 1}
                                                        >
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-muted rounded-lg p-4">
                                                    <div className="relative aspect-[9/16] max-w-[300px] mx-auto bg-muted rounded-lg overflow-hidden">
                                                        <img
                                                            className="w-full h-full object-cover"
                                                            src={openSlideshow.output.images[activeImageIndex]?.image_url}
                                                            alt={`Slide ${activeImageIndex + 1}`}
                                                        />
                                                        {openSlideshow.output.images[activeImageIndex]?.text && (
                                                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                                                <div className="text-white text-center font-medium text-shadow-lg">
                                                                    {openSlideshow.output.images[activeImageIndex].text}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {viewMode === "video" && openSlideshow.output.video_url && (
                                            <div className="bg-muted rounded-lg p-4">
                                                <h4 className="font-medium mb-2">Slideshow Video</h4>
                                                <video 
                                                    className="w-full rounded-lg" 
                                                    controls 
                                                    autoPlay 
                                                    src={openSlideshow.output.video_url}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Created: {new Date(openSlideshow.created_at).toLocaleDateString()}</span>
                                    {openSlideshow.status === 'completed' && (
                                        <Button 
                                            onClick={() => handleDownload(openSlideshow)} 
                                            variant="outline"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
};

export default AiSlideshow;
