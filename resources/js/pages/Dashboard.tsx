import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import WorkspaceSwitcher from '../components/workspace-switcher';
import DashboardStats from '../components/dashboard-stats';
import AiVoiceCard from '../components/ai-voice-card';
import AiAvatarCard from '../components/ai-avatar-card';
import AiLipSyncCard from '../components/ai-lip-sync-card';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
    Mic, 
    Image, 
    Video, 
    Users, 
    Settings, 
    Plus,
    Building2,
    Sparkles,
    Zap
} from 'lucide-react';
import { Badge } from '../components/ui/badge';

interface DashboardProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    workspaces: Array<{
        id: number;
        name: string;
        description?: string;
        slug: string;
        subscription_plan: string;
        credits_balance: number;
        max_users: number;
        max_storage_gb: number;
        users: Array<{
            id: number;
            name: string;
            email: string;
            pivot: {
                role: string;
                permissions: string[];
            };
        }>;
    }>;
    currentWorkspace: {
        id: number;
        name: string;
        description?: string;
        slug: string;
        subscription_plan: string;
        credits_balance: number;
        max_users: number;
        max_storage_gb: number;
        users: Array<{
            id: number;
            name: string;
            email: string;
            pivot: {
                role: string;
                permissions: string[];
            };
        }>;
    };
    stats: {
        ai_voices_count: number;
        ai_avatars_count: number;
        ai_lip_syncs_count: number;
        ai_images_count: number;
        ai_videos_count: number;
        campaigns_count: number;
        users_count: number;
        subscription_status: string;
    };
}

export default function Dashboard({ 
    auth, 
    workspaces, 
    currentWorkspace, 
    stats 
}: DashboardProps) {
    const [activeTab, setActiveTab] = useState('overview');

    const handleWorkspaceChange = (workspaceId: number) => {
        // In a real app, this would update the current workspace
        console.log('Switching to workspace:', workspaceId);
    };

    return (
        <>
            <Head title="Dashboard" />
            
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-8 h-8 text-blue-600" />
                                    <h1 className="text-2xl font-bold">AI Studio</h1>
                                </div>
                                <div className="hidden md:block text-muted-foreground">
                                    Professional AI content creation platform
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <Button variant="outline" size="sm">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </Button>
                                <Button size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Project
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Left Sidebar - Workspace Management */}
                        <div className="lg:col-span-1">
                            <WorkspaceSwitcher
                                workspaces={workspaces}
                                currentWorkspace={currentWorkspace}
                                onWorkspaceChange={handleWorkspaceChange}
                            />
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="overview" className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger value="ai-voice" className="flex items-center gap-2">
                                        <Mic className="w-4 h-4" />
                                        AI Voice
                                    </TabsTrigger>
                                    <TabsTrigger value="ai-avatar" className="flex items-center gap-2">
                                        <Image className="w-4 h-4" />
                                        AI Avatar
                                    </TabsTrigger>
                                    <TabsTrigger value="ai-lip-sync" className="flex items-center gap-2">
                                        <Video className="w-4 h-4" />
                                        Lip Sync
                                    </TabsTrigger>
                                </TabsList>

                                {/* Overview Tab */}
                                <TabsContent value="overview" className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-bold tracking-tight">
                                                Welcome back, {auth.user.name}!
                                            </h2>
                                            <p className="text-muted-foreground">
                                                Here's what's happening in your {currentWorkspace.name} workspace.
                                            </p>
                                        </div>
                                    </div>

                                    <DashboardStats 
                                        workspace={currentWorkspace}
                                        stats={stats}
                                    />
                                </TabsContent>

                                {/* AI Voice Tab */}
                                <TabsContent value="ai-voice" className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-bold tracking-tight">
                                                AI Voice Generation
                                            </h2>
                                            <p className="text-muted-foreground">
                                                Create natural-sounding speech with ElevenLabs technology.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        <AiVoiceCard workspaceId={currentWorkspace.id} />
                                        
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Zap className="w-5 h-5 text-yellow-600" />
                                                    Voice Features
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-3">
                                                    <h4 className="font-medium">Available Voice Types</h4>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="p-3 bg-blue-50 rounded-lg">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Mic className="w-4 h-4 text-blue-600" />
                                                                <span className="text-sm font-medium">Text to Speech</span>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">1 credit</p>
                                                        </div>
                                                        <div className="p-3 bg-green-50 rounded-lg">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Video className="w-4 h-4 text-green-600" />
                                                                <span className="text-sm font-medium">Speech to Text</span>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">2 credits</p>
                                                        </div>
                                                        <div className="p-3 bg-purple-50 rounded-lg">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Users className="w-4 h-4 text-purple-600" />
                                                                <span className="text-sm font-medium">Speech to Speech</span>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">3 credits</p>
                                                        </div>
                                                        <div className="p-3 bg-orange-50 rounded-lg">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Settings className="w-4 h-4 text-orange-600" />
                                                                <span className="text-sm font-medium">Voice Clone</span>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">5 credits</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>

                                {/* AI Avatar Tab */}
                                <TabsContent value="ai-avatar" className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-bold tracking-tight">
                                                AI Avatar Generation
                                            </h2>
                                            <p className="text-muted-foreground">
                                                Create stunning images and videos with AI-powered generation.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        <AiAvatarCard workspaceId={currentWorkspace.id} />
                                        
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Zap className="w-5 h-5 text-yellow-600" />
                                                    Avatar Features
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-3">
                                                    <h4 className="font-medium">Available Services</h4>
                                                    <div className="space-y-2">
                                                        <div className="p-3 bg-blue-50 rounded-lg">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium">Stable Diffusion</span>
                                                                <Badge variant="outline">1 credit</Badge>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">Open source text-to-image</p>
                                                        </div>
                                                        <div className="p-3 bg-purple-50 rounded-lg">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium">Midjourney</span>
                                                                <Badge variant="outline">2 credits</Badge>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">High-quality AI art</p>
                                                        </div>
                                                        <div className="p-3 bg-green-50 rounded-lg">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium">Leonardo AI</span>
                                                                <Badge variant="outline">1 credit</Badge>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">Professional platform</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>

                                {/* AI Lip Sync Tab */}
                                <TabsContent value="ai-lip-sync" className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-bold tracking-tight">
                                                AI Lip Sync & Translation
                                            </h2>
                                            <p className="text-muted-foreground">
                                                Translate and dub videos with AI-powered lip sync technology.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        <AiLipSyncCard workspaceId={currentWorkspace.id} />
                                        
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Zap className="w-5 h-5 text-yellow-600" />
                                                    Lip Sync Features
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-3">
                                                    <h4 className="font-medium">Supported Languages</h4>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Japanese'].map((lang) => (
                                                            <div key={lang} className="p-2 bg-gray-50 rounded text-center">
                                                                <span className="text-sm">{lang}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    <h4 className="font-medium mt-4">Processing Options</h4>
                                                    <div className="space-y-2">
                                                        <div className="p-3 bg-blue-50 rounded-lg">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium">Video Translation</span>
                                                                <Badge variant="outline">3 credits</Badge>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">Translate video content</p>
                                                        </div>
                                                        <div className="p-3 bg-green-50 rounded-lg">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium">Video Dubbing</span>
                                                                <Badge variant="outline">5 credits</Badge>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">Replace audio with lip sync</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}