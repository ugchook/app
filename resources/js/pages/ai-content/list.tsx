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
    Trash2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const words = [
    // "News & Updates"
    "Share the latest news...",
    "Breaking: Major tech company announces revolutionary product",
    "New study reveals surprising health benefits",
    "Global market trends and analysis",
    "Latest developments in renewable energy",

    // "Storytelling"
    "Tell your story...",
    "The day everything changed",
    "A journey through time and space",
    "Memories that shaped who I am",
    "Tales from the digital frontier",

    // "Advertising & Marketing"
    "Create compelling content...",
    "New product launch campaign",
    "Brand awareness strategy",
    "Social media marketing tips",
    "Customer success stories",

    // "Guides & Education"
    "Share your knowledge...",
    "Step-by-step guide to mastering a skill",
    "Understanding complex concepts made simple",
    "Best practices for beginners",
    "Expert tips and tricks",

    // "Entertainment & Interaction"
    "Entertain your audience...",
    "Fun facts and trivia",
    "Interactive content ideas",
    "Behind the scenes stories",
    "Creative challenges and games",

    // "Business & Work"
    "Business insights...",
    "Industry trends and analysis",
    "Professional development tips",
    "Workplace success strategies",
    "Entrepreneurial journey",

    // "Self-Development"
    "Personal growth...",
    "Building better habits",
    "Mindfulness and wellness",
    "Goal setting and achievement",
    "Life balance strategies",

    // "Technology & Future"
    "Tech and innovation...",
    "Future of artificial intelligence",
    "Emerging technologies",
    "Digital transformation",
    "Tech industry insights"
];

type ContentType = "News & Updates" | "Storytelling" | "Advertising & Marketing" | "Guides & Education" | "Entertainment & Interaction" | "Business & Work" | "Self-Development" | "Technology & Future";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'AI Content',
        href: '/ai-content',
    },
    {
        title: 'List',
        href: '/ai-content/list',
    },
];

const AiContent: React.FC = () => {
    const [openPrompt, setOpenPrompt] = useState<boolean>(true);
    const [prompt, setPrompt] = useState<string>("");
    const [type, setType] = useState<ContentType>("Storytelling");
    const [openType, setOpenType] = useState<boolean>(false);

    const [loadingContents, setLoadingContents] = useState<boolean>(true);
    const [contents, setContents] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const [isGenerating, setIsGenerating] = useState(false);
    const [openContent, setOpenContent] = useState<any>(null);
    const [actionType, setActionType] = useState<"list" | "tiktok" | "publish" | null>("list");

    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    const fetchContents = async (p = 1) => {
        try {
            let { data } = await axios.get(`/api/ai-content?page=${p}&limit=12`);
            if (data.status) {
                let isPending = false;
                for (let i = 0; i < data.data.length; i++) {
                    let item = data.data[i];
                    if (item.status === "processing" || item.status === "pending") {
                        isPending = true;
                        break;
                    }
                }
                setContents(data.data);
                setTotalPage(data.last_page);

                // Clear any existing polling
                if (pollingRef.current) {
                    clearTimeout(pollingRef.current);
                }

                // Set up new polling if there are pending contents
                if (isPending) {
                    pollingRef.current = setTimeout(() => {
                        fetchContents();
                    }, 3000);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchContents();
    }, []);

    const handleGenerate = async () => {
        if (isGenerating) return;
        if (!prompt) {
            toast.error("Please enter content description.");
            return;
        }
        setIsGenerating(true);
        let payload = {
            prompt: prompt.trim(),
            type: type
        };
        try {
            let { data } = await axios.post("/api/ai-content", payload);
            console.log(data);
            if (data.status) {
                toast.success("Content processing started!");
                setPrompt("");
                fetchContents();
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
        if (loadingContents || page == 1) return;
        let p = page - 1;
        setPage(p);
        setLoadingContents(true);
        await fetchContents(p);
        setLoadingContents(false);
    };

    const handleNext = async () => {
        if (loadingContents) return;
        let p = page + 1;
        setPage(p);
        setLoadingContents(true);
        await fetchContents(p);
        setLoadingContents(false);
    };

    const handleOpenContent = (item: any) => {
        setOpenContent(item);
        setActionType("list");
    };

    const handleDownload = (item: any) => {
        if (item.output && item.output.audio_url) {
            const link = document.createElement('a');
            link.href = item.output.audio_url;
            link.download = `content-${item.id}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const renderContentStatus = (status: string) => {
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

    const getContentTypeIcon = (type: string) => {
        switch (type) {
            case 'News & Updates':
                return <FileText className="h-5 w-5 text-blue-500" />;
            case 'Storytelling':
                return <Sparkles className="h-5 w-5 text-purple-500" />;
            case 'Advertising & Marketing':
                return <Share2 className="h-5 w-5 text-green-500" />;
            case 'Guides & Education':
                return <FileText className="h-5 w-5 text-orange-500" />;
            case 'Entertainment & Interaction':
                return <Play className="h-5 w-5 text-pink-500" />;
            case 'Business & Work':
                return <Settings className="h-5 w-5 text-indigo-500" />;
            case 'Self-Development':
                return <Sparkles className="h-5 w-5 text-yellow-500" />;
            case 'Technology & Future':
                return <Sparkles className="h-5 w-5 text-cyan-500" />;
            default:
                return <FileText className="h-5 w-5 text-gray-500" />;
        }
    };

    const currentWord = words[Math.floor(Math.random() * words.length)];
    const dot = "...";

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI Content Generator" />
            
            <div className="space-y-6 pb-24">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">AI Content Generator</h1>
                        <p className="text-muted-foreground">Create engaging content with AI assistance</p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Generated Content</h2>
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

                    {contents.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">No content yet</h3>
                            <p className="text-muted-foreground">Generate your first AI content to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {contents.map((content) => (
                                <div
                                    key={content.id}
                                    className="group relative rounded-xl border bg-card overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                                    onClick={() => handleOpenContent(content)}
                                >
                                    <div className="aspect-[9/16] bg-muted relative">
                                        {content.output && content.output.thumbnail_url ? (
                                            <img
                                                src={content.output.thumbnail_url}
                                                alt="Content thumbnail"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FileText className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        )}
                                        
                                        {content.status === 'completed' && (
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
                                                {getContentTypeIcon(content.type)}
                                                <Badge variant="outline" className="text-xs">
                                                    {content.type}
                                                </Badge>
                                            </div>
                                            {renderContentStatus(content.status)}
                                        </div>
                                        
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                            {content.prompt}
                                        </p>
                                        
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{new Date(content.created_at).toLocaleDateString()}</span>
                                            {content.status === 'completed' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownload(content);
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
                                            {getContentTypeIcon(type)}
                                            <span>{type}</span>
                                        </Button>
                                        <div className={`${openType ? "opacity-100" : "invisible opacity-0"} absolute p-2 z-40 left-0 -top-[300px] w-[250px] rounded-xl border bg-background shadow-lg transition-all duration-300`}>
                                            <ul className="flex flex-col gap-1">
                                                {[
                                                    "News & Updates",
                                                    "Storytelling", 
                                                    "Advertising & Marketing",
                                                    "Guides & Education",
                                                    "Entertainment & Interaction",
                                                    "Business & Work",
                                                    "Self-Development",
                                                    "Technology & Future"
                                                ].map((contentType) => (
                                                    <li 
                                                        key={contentType}
                                                        onClick={() => {
                                                            setType(contentType as ContentType);
                                                            setOpenType(false);
                                                        }} 
                                                        className="cursor-pointer px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg font-medium flex items-center gap-2"
                                                    >
                                                        {getContentTypeIcon(contentType)}
                                                        <span>{contentType}</span>
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

                {/* Content Modal */}
                <Dialog open={!!openContent} onOpenChange={() => setOpenContent(null)}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Generated Content</DialogTitle>
                        </DialogHeader>
                        {openContent && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 mb-4">
                                    {getContentTypeIcon(openContent.type)}
                                    <div>
                                        <h3 className="font-semibold">{openContent.type}</h3>
                                        <p className="text-sm text-muted-foreground">{openContent.prompt}</p>
                                    </div>
                                    {renderContentStatus(openContent.status)}
                                </div>
                                
                                {openContent.output && (
                                    <div className="space-y-4">
                                        {openContent.output.audio_url && (
                                            <div className="bg-muted rounded-lg p-4">
                                                <h4 className="font-medium mb-2">Audio Content</h4>
                                                <audio controls className="w-full">
                                                    <source src={openContent.output.audio_url} type="audio/mpeg" />
                                                    Your browser does not support the audio element.
                                                </audio>
                                            </div>
                                        )}
                                        
                                        {openContent.output.text && (
                                            <div className="bg-muted rounded-lg p-4">
                                                <h4 className="font-medium mb-2">Text Content</h4>
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                    {openContent.output.text}
                                                </p>
                                            </div>
                                        )}
                                        
                                        {openContent.output.scenes && (
                                            <div className="bg-muted rounded-lg p-4">
                                                <h4 className="font-medium mb-2">Content Scenes</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {openContent.output.scenes.map((scene: any, index: number) => (
                                                        <div key={index} className="space-y-2">
                                                            {scene.image_url && (
                                                                <img 
                                                                    src={scene.image_url} 
                                                                    alt={`Scene ${index + 1}`}
                                                                    className="w-full h-32 object-cover rounded-lg"
                                                                />
                                                            )}
                                                            {scene.text && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    {scene.text}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Created: {new Date(openContent.created_at).toLocaleDateString()}</span>
                                    {openContent.status === 'completed' && (
                                        <Button 
                                            onClick={() => handleDownload(openContent)} 
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

export default AiContent;
