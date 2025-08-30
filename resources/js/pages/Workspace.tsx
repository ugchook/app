import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { 
    Building2, 
    Users, 
    CreditCard, 
    HardDrive, 
    Plus,
    Settings,
    Crown,
    Shield,
    User,
    Eye,
    Edit,
    Trash2,
    UserPlus,
    ArrowLeft
} from 'lucide-react';

interface WorkspaceProps {
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
}

const subscriptionPlans = [
    { value: 'free', label: 'Free', users: 5, storage: 10, credits: 100 },
    { value: 'basic', label: 'Basic', users: 10, storage: 50, credits: 200 },
    { value: 'pro', label: 'Pro', users: 20, storage: 100, credits: 500 },
    { value: 'enterprise', label: 'Enterprise', users: 50, storage: 500, credits: 1000 },
];

const roleIcons = {
    owner: Crown,
    admin: Shield,
    member: User,
    viewer: Eye,
};

const roleColors = {
    owner: 'bg-yellow-100 text-yellow-800',
    admin: 'bg-blue-100 text-blue-800',
    member: 'bg-green-100 text-green-800',
    viewer: 'bg-gray-100 text-gray-800',
};

export default function Workspace({ auth, workspaces }: WorkspaceProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [newWorkspace, setNewWorkspace] = useState({
        name: '',
        description: '',
        subscription_plan: 'free'
    });

    const handleCreateWorkspace = () => {
        router.post('/api/workspace', newWorkspace, {
            onSuccess: () => {
                setIsCreating(false);
                setNewWorkspace({ name: '', description: '', subscription_plan: 'free' });
            }
        });
    };

    const handleDeleteWorkspace = (workspaceId: number) => {
        if (confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
            router.delete(`/api/workspace/${workspaceId}`);
        }
    };

    const getPlanLimits = (plan: string) => {
        return subscriptionPlans.find(p => p.value === plan) || subscriptionPlans[0];
    };

    return (
        <>
            <Head title="Workspace Management" />
            
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => router.get('/dashboard')}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Dashboard
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-8 h-8 text-blue-600" />
                                    <h1 className="text-2xl font-bold">Workspace Management</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6">
                    <div className="space-y-6">
                        {/* Create New Workspace */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-green-600" />
                                    Create New Workspace
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!isCreating ? (
                                    <Button onClick={() => setIsCreating(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Workspace
                                    </Button>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Workspace Name</Label>
                                                <Input
                                                    id="name"
                                                    value={newWorkspace.name}
                                                    onChange={(e) => setNewWorkspace({...newWorkspace, name: e.target.value})}
                                                    placeholder="Enter workspace name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="plan">Subscription Plan</Label>
                                                <Select 
                                                    value={newWorkspace.subscription_plan} 
                                                    onValueChange={(value) => setNewWorkspace({...newWorkspace, subscription_plan: value})}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {subscriptionPlans.map((plan) => (
                                                            <SelectItem key={plan.value} value={plan.value}>
                                                                {plan.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description (Optional)</Label>
                                            <Textarea
                                                id="description"
                                                value={newWorkspace.description}
                                                onChange={(e) => setNewWorkspace({...newWorkspace, description: e.target.value})}
                                                placeholder="Describe your workspace"
                                                rows={3}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button onClick={handleCreateWorkspace} disabled={!newWorkspace.name}>
                                                Create Workspace
                                            </Button>
                                            <Button variant="outline" onClick={() => setIsCreating(false)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Existing Workspaces */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">Your Workspaces</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {workspaces.map((workspace) => {
                                    const limits = getPlanLimits(workspace.subscription_plan);
                                    return (
                                        <Card key={workspace.id} className="relative">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-lg">{workspace.name}</CardTitle>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {workspace.description || 'No description'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => handleDeleteWorkspace(workspace.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {/* Plan Info */}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Plan</span>
                                                    <Badge className={subscriptionColors[workspace.subscription_plan as keyof typeof subscriptionColors]}>
                                                        {workspace.subscription_plan}
                                                    </Badge>
                                                </div>

                                                {/* Stats */}
                                                <div className="grid grid-cols-3 gap-4 text-center">
                                                    <div>
                                                        <div className="text-lg font-bold text-blue-600">
                                                            {workspace.users.length}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Members
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {limits.users} max
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-lg font-bold text-green-600">
                                                            {workspace.credits_balance}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Credits
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {limits.credits} total
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-lg font-bold text-purple-600">
                                                            {workspace.max_storage_gb}GB
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Storage
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {limits.storage}GB max
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Members */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">Team Members</span>
                                                        <Button variant="outline" size="sm">
                                                            <UserPlus className="w-4 h-4 mr-2" />
                                                            Invite
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {workspace.users.slice(0, 3).map((user) => (
                                                            <div key={user.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-2 h-2 rounded-full ${roleColors[user.pivot.role as keyof typeof roleColors]}`}></div>
                                                                    <span className="text-sm">{user.name}</span>
                                                                </div>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {user.pivot.role}
                                                                </Badge>
                                                            </div>
                                                        ))}
                                                        {workspace.users.length > 3 && (
                                                            <div className="text-center text-sm text-muted-foreground">
                                                                +{workspace.users.length - 3} more members
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" className="flex-1">
                                                        <Settings className="w-4 h-4 mr-2" />
                                                        Settings
                                                    </Button>
                                                    <Button size="sm" className="flex-1">
                                                        Open Workspace
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}