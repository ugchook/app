import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from './ui/select';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
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
    Eye
} from 'lucide-react';

interface Workspace {
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
}

interface WorkspaceSwitcherProps {
    workspaces: Workspace[];
    currentWorkspace: Workspace;
    onWorkspaceChange: (workspaceId: number) => void;
}

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

const subscriptionColors = {
    free: 'bg-gray-100 text-gray-800',
    basic: 'bg-blue-100 text-blue-800',
    pro: 'bg-purple-100 text-purple-800',
    enterprise: 'bg-orange-100 text-orange-800',
};

export default function WorkspaceSwitcher({ 
    workspaces, 
    currentWorkspace, 
    onWorkspaceChange 
}: WorkspaceSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleWorkspaceChange = (workspaceId: string) => {
        const id = parseInt(workspaceId);
        onWorkspaceChange(id);
        setIsOpen(false);
    };

    const getCurrentUserRole = () => {
        const currentUser = currentWorkspace.users.find(user => 
            user.id === window.Inertia?.page?.props?.auth?.user?.id
        );
        return currentUser?.pivot.role || 'member';
    };

    const getCurrentUserIcon = () => {
        const role = getCurrentUserRole();
        const IconComponent = roleIcons[role as keyof typeof roleIcons] || User;
        return <IconComponent className="w-4 h-4" />;
    };

    const getCurrentUserColor = () => {
        const role = getCurrentUserRole();
        return roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="relative">
            <Select value={currentWorkspace.id.toString()} onValueChange={handleWorkspaceChange}>
                <SelectTrigger className="w-[280px] bg-background border-border">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <div className="flex flex-col items-start">
                            <span className="font-medium text-sm">{currentWorkspace.name}</span>
                            <div className="flex items-center gap-1">
                                <Badge 
                                    variant="secondary" 
                                    className={`text-xs ${subscriptionColors[currentWorkspace.subscription_plan as keyof typeof subscriptionColors]}`}
                                >
                                    {currentWorkspace.subscription_plan}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {currentWorkspace.credits_balance} credits
                                </Badge>
                            </div>
                        </div>
                    </div>
                </SelectTrigger>
                <SelectContent className="w-[280px]">
                    {workspaces.map((workspace) => (
                        <SelectItem key={workspace.id} value={workspace.id.toString()}>
                            <div className="flex items-center gap-2 w-full">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                <div className="flex flex-col items-start flex-1">
                                    <span className="font-medium">{workspace.name}</span>
                                    <div className="flex items-center gap-1">
                                        <Badge 
                                            variant="secondary" 
                                            className={`text-xs ${subscriptionColors[workspace.subscription_plan as keyof typeof subscriptionColors]}`}
                                        >
                                            {workspace.subscription_plan}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {workspace.credits_balance} credits
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Workspace Info Card */}
            <Card className="mt-4">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Workspace Info
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Your Role</span>
                        <Badge className={getCurrentUserColor()}>
                            <div className="flex items-center gap-1">
                                {getCurrentUserIcon()}
                                {getCurrentUserRole()}
                            </div>
                        </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Members</span>
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                                {currentWorkspace.users.length}/{currentWorkspace.max_users}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Storage</span>
                        <div className="flex items-center gap-1">
                            <HardDrive className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                                {currentWorkspace.max_storage_gb}GB
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Credits</span>
                        <div className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                                {currentWorkspace.credits_balance}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2 border-t">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => router.get('/workspace')}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Manage Workspaces
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}