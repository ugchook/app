import { ChevronLeft, ChevronRight, Download, Image, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

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
    const [generating, setGenerating] = useState(false);

    const fetchImages = async (p = 1) => {
        try {
            // TODO: Implement API call to Laravel backend
            setLoadingImages(false);
        } catch (e) {
            console.error(e);
            setLoadingImages(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        
        setGenerating(true);
        try {
            // TODO: Implement API call to Laravel backend
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            setGenerating(false);
            setPrompt('');
            fetchImages();
        } catch (e) {
            console.error(e);
            setGenerating(false);
        }
    };

    const handlePrev = async () => {
        if (page > 1) {
            setPage(page - 1);
            await fetchImages(page - 1);
        }
    };

    const handleNext = async () => {
        if (page < totalPage) {
            setPage(page + 1);
            await fetchImages(page + 1);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI Image Generator" />
            <div className="rounded-2xl p-5 lg:p-6">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold dark:text-white/90">AI Image Generator</h1>
                            <p className="text-gray-500 dark:text-white/70">Create realistic AI avatars for your UGC videos</p>
                        </div>
                    </div>

                    {/* Prompt Section */}
                    {openPrompt && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Describe your image
                                    </label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Describe the person you want to generate..."
                                        className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={handleGenerate}
                                        disabled={generating || !prompt.trim()}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                    >
                                        {generating ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Generating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Image className="w-4 h-4" />
                                                <span>Generate Image</span>
                                            </>
                                        )}
                                    </button>
                                    
                                    <button
                                        onClick={() => setOpenPrompt(false)}
                                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Images Grid */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold dark:text-white/90">Generated Images</h2>
                            {!openPrompt && (
                                <button
                                    onClick={() => setOpenPrompt(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Generate New Image
                                </button>
                            )}
                        </div>

                        {loadingImages ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : images.length === 0 ? (
                            <div className="text-center py-12">
                                <Image className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No images yet</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Generate your first AI avatar image to get started.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {images.map((image, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <div className="aspect-square bg-gray-200 dark:bg-gray-600 rounded-lg mb-4"></div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {image.status || 'completed'}
                                            </span>
                                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPage > 1 && (
                            <div className="flex items-center justify-center space-x-2 mt-6">
                                <button
                                    onClick={handlePrev}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                    Page {page} of {totalPage}
                                </span>
                                <button
                                    onClick={handleNext}
                                    disabled={page === totalPage}
                                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
