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
    Mic, 
    Volume2, 
    Languages, 
    Copy, 
    Play, 
    Download,
    Upload,
    FileAudio,
    Clock,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';

interface AiVoiceCardProps {
    workspaceId: number;
}

interface Voice {
    voice_id: string;
    name: string;
    category: string;
}

const voiceTypes = [
    { value: 'text_to_speech', label: 'Text to Speech', icon: Volume2, description: 'Convert text to natural speech' },
    { value: 'speech_to_text', label: 'Speech to Text', icon: Mic, description: 'Transcribe audio to text' },
    { value: 'speech_to_speech', label: 'Speech to Speech', icon: Languages, description: 'Convert speech between languages' },
    { value: 'voice_clone', label: 'Voice Clone', icon: Copy, description: 'Clone voices from audio samples' },
];

const sampleVoices: Voice[] = [
    { voice_id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', category: 'Professional' },
    { voice_id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', category: 'Casual' },
    { voice_id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', category: 'Friendly' },
    { voice_id: 'ErXwobaYiN1PXXYvQEPP', name: 'Josh', category: 'Authoritative' },
];

export default function AiVoiceCard({ workspaceId }: AiVoiceCardProps) {
    const [selectedType, setSelectedType] = useState('text_to_speech');
    const [inputText, setInputText] = useState('');
    const [selectedVoice, setSelectedVoice] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const formData = new FormData();
        formData.append('name', `${selectedType.replace('_', ' ')} - ${new Date().toLocaleString()}`);
        formData.append('type', selectedType);
        formData.append('workspace_id', workspaceId.toString());

        if (selectedType === 'text_to_speech' || selectedType === 'voice_clone') {
            formData.append('input_text', inputText);
        }

        if (selectedType === 'speech_to_text' || selectedType === 'speech_to_speech') {
            if (uploadedFile) {
                formData.append('input_audio', uploadedFile);
            }
        }

        if (selectedVoice) {
            formData.append('voice_id', selectedVoice);
        }

        try {
            await router.post('/api/ai-voice', formData);
        } catch (error) {
            console.error('Error creating AI voice request:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const getTypeIcon = (type: string) => {
        const voiceType = voiceTypes.find(t => t.value === type);
        if (voiceType) {
            const IconComponent = voiceType.icon;
            return <IconComponent className="w-5 h-5" />;
        }
        return null;
    };

    const getTypeDescription = (type: string) => {
        const voiceType = voiceTypes.find(t => t.value === type);
        return voiceType?.description || '';
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-blue-600" />
                    AI Voice Generation
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Voice Type Selection */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Voice Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                        {voiceTypes.map((type) => (
                            <div
                                key={type.value}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                    selectedType === type.value
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-border hover:border-blue-300'
                                }`}
                                onClick={() => setSelectedType(type.value)}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <type.icon className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium">{type.label}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{type.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Voice Selection */}
                {(selectedType === 'text_to_speech' || selectedType === 'voice_clone') && (
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Voice</Label>
                        <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a voice" />
                            </SelectTrigger>
                            <SelectContent>
                                {sampleVoices.map((voice) => (
                                    <SelectItem key={voice.voice_id} value={voice.voice_id}>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{voice.name}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {voice.category}
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Text Input */}
                {(selectedType === 'text_to_speech' || selectedType === 'voice_clone') && (
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">
                            {selectedType === 'text_to_speech' ? 'Text to Convert' : 'Text for Voice Clone'}
                        </Label>
                        <Textarea
                            placeholder={
                                selectedType === 'text_to_speech'
                                    ? "Enter the text you want to convert to speech..."
                                    : "Enter text to generate speech in the cloned voice..."
                            }
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                    </div>
                )}

                {/* Audio Upload */}
                {(selectedType === 'speech_to_text' || selectedType === 'speech_to_speech') && (
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Audio File</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">
                                Upload an audio file (MP3, WAV, M4A)
                            </p>
                            <Input
                                type="file"
                                accept=".mp3,.wav,.m4a"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="audio-upload"
                            />
                            <Label htmlFor="audio-upload" className="cursor-pointer">
                                <Button variant="outline" size="sm">
                                    Choose File
                                </Button>
                            </Label>
                            {uploadedFile && (
                                <div className="mt-3 flex items-center gap-2 justify-center">
                                    <FileAudio className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-green-600">{uploadedFile.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Language Selection for Speech to Speech */}
                {selectedType === 'speech_to_speech' && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Source Language</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select source language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="es">Spanish</SelectItem>
                                    <SelectItem value="fr">French</SelectItem>
                                    <SelectItem value="de">German</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Target Language</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select target language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="es">Spanish</SelectItem>
                                    <SelectItem value="fr">French</SelectItem>
                                    <SelectItem value="de">German</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

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
                                Generate {selectedType.replace('_', ' ')}
                            </span>
                        </>
                    )}
                </Button>

                {/* Info Section */}
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Powered by ElevenLabs</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        High-quality AI voice generation with natural-sounding speech synthesis.
                        Credits will be deducted from your workspace balance.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}