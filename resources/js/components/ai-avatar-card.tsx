import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
    Image, 
    Video, 
    Palette, 
    Upload,
    Download,
    FileImage,
    FileVideo,
    Settings,
    Sparkles,
    CheckCircle,
    Loader2,
    Wand2
} from 'lucide-react';

interface AiAvatarCardProps {
    workspaceId: number;
}

interface AiService {
    value: string;
    label: string;
    description: string;
    credits: number;
    supports: string[];
}

const avatarTypes = [
    { value: 'text_to_image', label: 'Text to Image', icon: Image, description: 'Generate images from text descriptions' },
    { value: 'image_to_video', label: 'Image to Video', icon: Video, description: 'Convert static images to animated videos' },
];

const aiServices: AiService[] = [
    { 
        value: 'stable_diffusion', 
        label: 'Stable Diffusion', 
        description: 'Open source text-to-image model',
        credits: 1,
        supports: ['text_to_image']
    },
    { 
        value: 'midjourney', 
        label: 'Midjourney', 
        description: 'High-quality AI art generation',
        credits: 2,
        supports: ['text_to_image']
    },
    { 
        value: 'dalle', 
        label: 'DALL-E', 
        description: 'OpenAI\'s text-to-image model',
        credits: 2,
        supports: ['text_to_image']
    },
    { 
        value: 'leonardo', 
        label: 'Leonardo AI', 
        description: 'Professional AI art platform',
        credits: 1,
        supports: ['text_to_image', 'image_to_video']
    }
];

export default function AiAvatarCard({ workspaceId }: AiAvatarCardProps) {
    const [selectedType, setSelectedType] = useState('text_to_image');
    const [selectedService, setSelectedService] = useState('stable_diffusion');
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const formData = new FormData();
        formData.append('name', `${selectedType.replace('_', ' ')} - ${new Date().toLocaleString()}`);
        formData.append('type', selectedType);
        formData.append('workspace_id', workspaceId.toString());
        formData.append('prompt', prompt);
        formData.append('ai_service', selectedService);

        if (negativePrompt) {
            formData.append('negative_prompt', negativePrompt);
        }

        if (selectedType === 'image_to_video' && uploadedImage) {
            formData.append('input_image', uploadedImage);
        }

        // Add generation settings
        const generationSettings = {
            width: 512,
            height: 512,
            steps: 20,
            guidance_scale: 7.5,
            quality: 'high'
        };
        formData.append('generation_settings', JSON.stringify(generationSettings));

        try {
            await router.post('/api/ai-avatar', formData);
        } catch (error) {
            console.error('Error creating AI avatar request:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedImage(file);
        }
    };

    const getTypeIcon = (type: string) => {
        const avatarType = avatarTypes.find(t => t.value === type);
        if (avatarType) {
            const IconComponent = avatarType.icon;
            return <IconComponent className="w-5 h-5" />;
        }
        return null;
    };

    const getFilteredServices = () => {
        return aiServices.filter(service => 
            service.supports.includes(selectedType)
        );
    };

    const getServiceIcon = (service: string) => {
        switch (service) {
            case 'stable_diffusion':
                return <Sparkles className="w-4 h-4" />;
            case 'midjourney':
                return <Wand2 className="w-4 h-4" />;
            case 'dalle':
                return <Palette className="w-4 h-4" />;
            case 'leonardo':
                return <Image className="w-4 h-4" />;
            default:
                return <Sparkles className="w-4 h-4" />;
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-purple-600" />
                    AI Avatar Generation
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Avatar Type Selection */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Generation Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                        {avatarTypes.map((type) => (
                            <div
                                key={type.value}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                    selectedType === type.value
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-border hover:border-purple-300'
                                }`}
                                onClick={() => setSelectedType(type.value)}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <type.icon className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-medium">{type.label}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{type.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Service Selection */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">AI Service</Label>
                    <div className="grid grid-cols-2 gap-3">
                        {getFilteredServices().map((service) => (
                            <div
                                key={service.value}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                    selectedService === service.value
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-border hover:border-purple-300'
                                }`}
                                onClick={() => setSelectedService(service.value)}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    {getServiceIcon(service.value)}
                                    <span className="text-sm font-medium">{service.label}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{service.description}</p>
                                <Badge variant="outline" className="text-xs">
                                    {service.credits} credit{service.credits !== 1 ? 's' : ''}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prompt Input */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Prompt</Label>
                    <Textarea
                        placeholder={
                            selectedType === 'text_to_image'
                                ? "Describe the image you want to generate... (e.g., 'A beautiful sunset over mountains, digital art style')"
                                : "Describe the video you want to create from the image... (e.g., 'Gentle camera movement, subtle zoom effect')"
                        }
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        className="resize-none"
                    />
                </div>

                {/* Negative Prompt */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Negative Prompt (Optional)</Label>
                    <Textarea
                        placeholder="What you don't want in the image... (e.g., 'blurry, low quality, distorted')"
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        rows={2}
                        className="resize-none"
                    />
                </div>

                {/* Image Upload for Image to Video */}
                {selectedType === 'image_to_video' && (
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Source Image</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">
                                Upload an image file (JPG, PNG, WebP)
                            </p>
                            <Input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                            <Label htmlFor="image-upload" className="cursor-pointer">
                                <Button variant="outline" size="sm">
                                    Choose Image
                                </Button>
                            </Label>
                            {uploadedImage && (
                                <div className="mt-3 flex items-center gap-2 justify-center">
                                    <FileImage className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-green-600">{uploadedImage.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Generation Settings */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Generation Settings</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Width</Label>
                            <Select defaultValue="512">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="256">256px</SelectItem>
                                    <SelectItem value="512">512px</SelectItem>
                                    <SelectItem value="768">768px</SelectItem>
                                    <SelectItem value="1024">1024px</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Height</Label>
                            <Select defaultValue="512">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="256">256px</SelectItem>
                                    <SelectItem value="512">512px</SelectItem>
                                    <SelectItem value="768">768px</SelectItem>
                                    <SelectItem value="1024">1024px</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isProcessing}
                    onClick={handleSubmit}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            {getTypeIcon(selectedType)}
                            <span className="ml-2">
                                Generate {selectedType.replace('_', ' ')}
                            </span>
                        </>
                    )}
                </Button>

                {/* Info Section */}
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Multiple AI Services</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Choose from various AI services including Stable Diffusion, Midjourney, DALL-E, and Leonardo AI.
                        Each service has different credit costs and quality levels.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}