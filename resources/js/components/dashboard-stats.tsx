import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
    Mic, 
    Image, 
    Video, 
    Users, 
    CreditCard, 
    HardDrive, 
    TrendingUp,
    Activity,
    Clock,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';

interface DashboardStatsProps {
    workspace: {
        id: number;
        name: string;
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

const subscriptionColors = {
    free: 'bg-gray-100 text-gray-800',
    basic: 'bg-blue-100 text-blue-800',
    pro: 'bg-purple-100 text-purple-800',
    enterprise: 'bg-orange-100 text-orange-800',
};

const subscriptionLimits = {
    free: { users: 5, storage: 10, credits: 100 },
    basic: { users: 10, storage: 50, credits: 200 },
    pro: { users: 20, storage: 100, credits: 500 },
    enterprise: { users: 50, storage: 500, credits: 1000 },
};

export default function DashboardStats({ workspace, stats }: DashboardStatsProps) {
    const limits = subscriptionLimits[workspace.subscription_plan as keyof typeof subscriptionLimits] || subscriptionLimits.free;
    
    const getUsagePercentage = (current: number, max: number) => {
        return Math.min((current / max) * 100, 100);
    };

    const getUsageColor = (percentage: number) => {
        if (percentage < 50) return 'bg-green-500';
        if (percentage < 80) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-6">
            {/* Workspace Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        Workspace Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.users_count}</div>
                            <div className="text-sm text-muted-foreground">Active Members</div>
                            <div className="text-xs text-muted-foreground">
                                {limits.users} max
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{workspace.credits_balance}</div>
                            <div className="text-sm text-muted-foreground">Credits Available</div>
                            <div className="text-xs text-muted-foreground">
                                {limits.credits} total
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{workspace.max_storage_gb}GB</div>
                            <div className="text-sm text-muted-foreground">Storage Used</div>
                            <div className="text-xs text-muted-foreground">
                                {limits.storage}GB max
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Subscription Plan</span>
                            <Badge className={subscriptionColors[workspace.subscription_plan as keyof typeof subscriptionColors]}>
                                {workspace.subscription_plan}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Badge variant={stats.subscription_status === 'active' ? 'default' : 'destructive'}>
                                {stats.subscription_status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* AI Generation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI Voices</CardTitle>
                        <Mic className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.ai_voices_count}</div>
                        <p className="text-xs text-muted-foreground">
                            Voice generations
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI Avatars</CardTitle>
                        <Image className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.ai_avatars_count}</div>
                        <p className="text-xs text-muted-foreground">
                            Image & video generations
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI Lip Sync</CardTitle>
                        <Video className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.ai_lip_syncs_count}</div>
                        <p className="text-xs text-muted-foreground">
                            Video translations
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.campaigns_count}</div>
                        <p className="text-xs text-muted-foreground">
                            Active campaigns
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Usage Progress Bars */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Resource Usage
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Users Usage */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Team Members</span>
                            <span className="text-sm text-muted-foreground">
                                {stats.users_count} / {limits.users}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(stats.users_count, limits.users))}`}
                                style={{ width: `${getUsagePercentage(stats.users_count, limits.users)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Credits Usage */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Credits</span>
                            <span className="text-sm text-muted-foreground">
                                {workspace.credits_balance} / {limits.credits}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(limits.credits - workspace.credits_balance, limits.credits))}`}
                                style={{ width: `${getUsagePercentage(limits.credits - workspace.credits_balance, limits.credits)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Storage Usage */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Storage</span>
                            <span className="text-sm text-muted-foreground">
                                {workspace.max_storage_gb}GB / {limits.storage}GB
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(workspace.max_storage_gb, limits.storage))}`}
                                style={{ width: `${getUsagePercentage(workspace.max_storage_gb, limits.storage)}%` }}
                            ></div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Button variant="outline" size="sm" className="h-auto py-3 flex flex-col items-center gap-2">
                            <Mic className="w-4 h-4" />
                            <span className="text-xs">AI Voice</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-auto py-3 flex flex-col items-center gap-2">
                            <Image className="w-4 h-4" />
                            <span className="text-xs">AI Avatar</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-auto py-3 flex flex-col items-center gap-2">
                            <Video className="w-4 h-4" />
                            <span className="text-xs">Lip Sync</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-auto py-3 flex flex-col items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span className="text-xs">Invite User</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}