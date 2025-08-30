import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { 
    ChevronLeft, 
    ChevronRight, 
    Plus, 
    Video, 
    Images, 
    Clapperboard,
    Clock,
    Play,
    Pause,
    Edit,
    Trash2
} from 'lucide-react';
import axios from 'axios';

interface Campaign {
    id: number;
    name: string;
    status: "active" | "inactive" | "deleted";
    content_type: string;
    content_description: string;
    configuration: any;
    created_at: string;
    updated_at: string;
    nextVideoAt?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Campaigns',
        href: '/campaign',
    },
    {
        title: 'List',
        href: '/campaign/list',
    },
];

const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const config = campaign.configuration || {};
    const scheduleTimes = config.scheduleTimes || [];

    const getContentTypeIcon = (type: string) => {
        switch (type) {
            case 'ai-avatar':
                return <Video className="h-5 w-5 text-blue-500" />;
            case 'ai-content':
                return <Clapperboard className="h-5 w-5 text-green-500" />;
            case 'ai-slideshow':
                return <Images className="h-5 w-5 text-purple-500" />;
            default:
                return <Clapperboard className="h-5 w-5 text-gray-500" />;
        }
    };

    const getContentTypeName = (type: string) => {
        switch (type) {
            case 'ai-avatar':
                return 'AI Avatar';
            case 'ai-content':
                return 'AI Content';
            case 'ai-slideshow':
                return 'AI Slideshow';
            default:
                return type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
    };

    const formatNextVideoTime = (nextVideoAt: string) => {
        if (!nextVideoAt) return 'No schedule';
        
        const date = new Date(nextVideoAt);
        const now = new Date();
        const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Next: < 1 hour';
        } else if (diffInHours < 24) {
            return `Next: ${diffInHours} hours`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `Next: ${diffInDays} days`;
        }
    };

    return (
        <Link
            href={`/campaign/edit/${campaign.id}`}
            className="block bg-card border rounded-xl p-6 hover:bg-accent/50 transition-all duration-200 cursor-pointer"
        >
            <div className="flex items-start mb-4">
                <div className="flex items-center gap-3 w-full">
                    {getContentTypeIcon(campaign.content_type)}
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">
                            {campaign.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {getContentTypeName(campaign.content_type)}
                        </p>
                    </div>
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            campaign.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                        }`}>
                            {campaign.status === "active" ? "Running" : "Paused"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {/* Description */}
                <div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {campaign.content_description}
                    </p>
                </div>

                {/* Schedule Info */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatNextVideoTime(campaign.nextVideoAt || '')}</span>
                </div>

                {/* Schedule Times */}
                {scheduleTimes.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {scheduleTimes.slice(0, 3).map((time: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {time}
                            </Badge>
                        ))}
                        {scheduleTimes.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{scheduleTimes.length - 3} more
                            </Badge>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
};

const CampaignList: React.FC = () => {
    const [loadingCampaigns, setLoadingCampaigns] = useState<boolean>(true);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);

    const fetchCampaigns = async (p = 1) => {
        try {
            let { data } = await axios.get(`/api/campaign?page=${p}&limit=12`);
            if (data.status) {
                setCampaigns(data.campaigns);
                setTotalPage(data.totalPage);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCampaigns(1).then(() => {
            setLoadingCampaigns(false);
        });
    }, []);

    const handlePrev = async () => {
        if (page > 1) {
            let newPage = page - 1;
            setLoadingCampaigns(true);
            setPage(newPage);
            await fetchCampaigns(newPage);
            setLoadingCampaigns(false);
        }
    };

    const handleNext = async () => {
        if (page < totalPage) {
            let newPage = page + 1;
            setLoadingCampaigns(true);
            setPage(newPage);
            await fetchCampaigns(newPage);
            setLoadingCampaigns(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Campaigns" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
                        <p className="text-muted-foreground">Manage your automated content campaigns</p>
                    </div>
                    <Link href="/campaign/create">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Campaign
                        </Button>
                    </Link>
                </div>

                {/* Campaigns Grid */}
                {loadingCampaigns ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-12">
                        <Clapperboard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">No campaigns yet</h3>
                        <p className="text-muted-foreground mb-4">Create your first automated campaign to get started</p>
                        <Link href="/campaign/create">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Campaign
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* New Campaign Card */}
                            <Link
                                href="/campaign/create"
                                className="block bg-card border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 hover:bg-accent/50 transition-all duration-200 cursor-pointer text-center"
                            >
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <Plus className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        New Campaign
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Create a new automated campaign
                                    </p>
                                </div>
                            </Link>

                            {campaigns.map((campaign) => (
                                <CampaignCard key={campaign.id} campaign={campaign} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPage > 1 && (
                            <div className="flex items-center justify-center gap-4">
                                <Button
                                    variant="outline"
                                    onClick={handlePrev}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Previous
                                </Button>
                                
                                <span className="text-sm text-muted-foreground">
                                    Page {page} of {totalPage}
                                </span>
                                
                                <Button
                                    variant="outline"
                                    onClick={handleNext}
                                    disabled={page === totalPage}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
};

export default CampaignList;
