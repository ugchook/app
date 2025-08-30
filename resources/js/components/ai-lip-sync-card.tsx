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
    Video, 
    Languages, 
    Upload,
    FileVideo,
    FileAudio,
    Globe,
    Settings,
    CheckCircle,
    Loader2,
    Play,
    Download,
    Sync
} from 'lucide-react';

interface AiLipSyncCardProps {
    workspaceId: number;
}

interface LipSyncService {
    value: string;
    label: string;
    description: string;
    credits: number;
    supports: string[];
}

const lipSyncTypes = [
    { value: 'video_translation', label: 'Video Translation', icon: Languages, description: 'Translate video content to different languages' },
    { value: 'video_dubbing', label: 'Video Dubbing', icon: Video, description: 'Replace audio with translated speech while maintaining lip sync' },
];

const lipSyncServices: LipSyncService[] = [
    { 
        value: 'wav2lip', 
        label: 'Wav2Lip', 
        description: 'Open source lip sync solution',
        credits: 2,
        supports: ['video_dubbing']
    },
    { 
        value: 'sync_labs', 
        label: 'Sync Labs', 
        description: 'Professional lip sync platform',
        credits: 3,
        supports: ['video_translation', 'video_dubbing']
    },
    { 
        value: 'elevenlabs', 
        label: 'ElevenLabs', 
        description: 'AI voice synthesis with lip sync',
        credits: 2,
        supports: ['video_dubbing']
    },
    { 
        value: 'hey_gen', 
        label: 'HeyGen', 
        description: 'AI video generation and translation',
        credits: 4,
        supports: ['video_translation', 'video_dubbing']
    }
];

const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
];

export default function AiLipSyncCard({ workspaceId }: AiLipSyncCardProps) {
    const [selectedType, setSelectedType] = useState('video_translation');
    const [selectedService, setSelectedService] = useState('sync_labs');
    const [sourceLanguage, setSourceLanguage] = useState('en');
    const [targetLanguage, setTargetLanguage] = useState('es');
    const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
    const [uploadedAudio, setUploadedAudio] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const formData = new FormData();
        formData.append('name', `${selectedType.replace('_', ' ')} - ${new Date().toLocaleString()}`);
        formData.append('type', selectedType);
        formData.append('workspace_id', workspaceId.toString());
        formData.append('source_language', sourceLanguage);
        formData.append('target_language', targetLanguage);
        formData.append('ai_service', selectedService);

        if (uploadedVideo) {
            formData.append('input_video', uploadedVideo);
        }

        if (uploadedAudio) {
            formData.append('input_audio', uploadedAudio);
        }

        // Add lip sync settings
        const lipSyncSettings = {
            quality: 'high',
            preserve_original_audio: false,
            sync_precision: 0.8,
            voice_id: 'default'
        };
        formData.append('lip_sync_settings', JSON.stringify(lipSyncSettings));

        try {
            await router.post('/api/ai-lip-sync', formData);
        } catch (error) {
            console.error('Error creating AI lip sync request:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedVideo(file);
        }
    };

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedAudio(file);
        }
    };

    const getTypeIcon = (type: string) => {
        const lipSyncType = lipSyncTypes.find(t => t.value === type);
        if (lipSyncType) {
            const IconComponent = lipSyncType.icon;
            return <IconComponent className="w-5 h-5" />;
        }
        return null;
    };

    const getFilteredServices = () => {
        return lipSyncServices.filter(service => 
            service.supports.includes(selectedType)
        );
    };

    const getServiceIcon = (service: string) => {
        switch (service) {
            case 'wav2lip':
                return <Sync className="w-4 h-4" />;
            case 'sync_labs':
                return <Video className="w-4 h-4" />;
            case 'elevenlabs':
                return <Globe className="w-4 h-4" />;
            case 'hey_gen':
                return <Play className="w-4 h-4" />;
            default:
                return <Sync className="w-4 h-4" />;
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-green-600" />
                    AI Lip Sync & Translation
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Lip Sync Type Selection */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Processing Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                        {lipSyncTypes.map((type) => (
                            <div
                                key={type.value}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                    selectedType === type.value
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-border hover:border-green-300'
                                }`}
                                onClick={() => setSelectedType(type.value)}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <type.icon className="w-4 h-4 text-green-600" />
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
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-border hover:border-green-300'
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

                {/* Language Selection */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Language Pair</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Source Language</Label>
                            <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map((language) => (
                                        <SelectItem key={language.code} value={language.code}>
                                            {language.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Target Language</Label>
                            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map((language) => (
                                        <SelectItem key={language.code} value={language.code}>
                                            {language.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Video Upload */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Input Video</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                            Upload a video file (MP4, AVI, MOV, WMV)
                        </p>
                        <Input
                            type="file"
                            accept=".mp4,.avi,.mov,.wmv"
                            onChange={handleVideoUpload}
                            className="hidden"
                            id="video-upload"
                        />
                        <Label htmlFor="video-upload" className="cursor-pointer">
                            <Button variant="outline" size="sm">
                                Choose Video
                            </Button>
                        </Label>
                        {uploadedVideo && (
                            <div className="mt-3 flex items-center gap-2 justify-center">
                                <FileVideo className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-600">{uploadedVideo.name}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Audio Upload (Optional) */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Input Audio (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                            Upload an audio file for dubbing (MP3, WAV, M4A)
                        </p>
                        <Input
                            type="file"
                            accept=".mp3,.wav,.m4a"
                            onChange={handleAudioUpload}
                            className="hidden"
                            id="audio-upload"
                        />
                        <Label htmlFor="audio-upload" className="cursor-pointer">
                            <Button variant="outline" size="sm">
                                Choose Audio
                            </Button>
                        </Label>
                        {uploadedAudio && (
                            <div className="mt-3 flex items-center gap-2 justify-center">
                                <FileAudio className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-600">{uploadedAudio.name}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Processing Settings */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Processing Settings</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Quality</Label>
                            <Select defaultValue="high">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Sync Precision</Label>
                            <Select defaultValue="0.8">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0.6">0.6</SelectItem>
                                    <SelectItem value="0.7">0.7</SelectItem>
                                    <SelectItem value="0.8">0.8</SelectItem>
                                    <SelectItem value="0.9">0.9</SelectItem>
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
                            Processing...
                        </>
                    ) : (
                        <>
                            {getTypeIcon(selectedType)}
                            <span className="ml-2">
                                Process {selectedType.replace('_', ' ')}
                            </span>
                        </>
                    )}
                </Button>

                {/* Info Section */}
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Advanced Lip Sync</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Professional video translation and dubbing with AI-powered lip sync technology.
                        Supports multiple languages and maintains natural speech patterns.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}