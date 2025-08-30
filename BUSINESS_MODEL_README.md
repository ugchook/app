# AI Application Business Model - Complete Redesign

## Overview

This application has been completely redesigned to support a multi-workspace architecture with comprehensive AI features including AI Voices, AI Avatars, and AI LipSync capabilities.

## 🏗️ Architecture

### Multi-Workspace System
- **Users can belong to multiple workspaces** with different roles and permissions
- **Role-based access control**: Owner, Admin, Member, Viewer
- **Workspace isolation**: All AI content is scoped to specific workspaces
- **Credit management**: Each workspace has its own credit balance

### Core Features

#### 1. AI Voices (ElevenLabs Integration)
- **Text to Speech**: Convert text to natural-sounding speech
- **Speech to Text**: Transcribe audio to text
- **Speech to Speech**: Convert speech in one language to another
- **Voice Cloning**: Clone voices from audio samples

#### 2. AI Avatars
- **Text to Image**: Generate images from text descriptions
- **Image to Video**: Convert static images to animated videos
- **Multiple AI Services**: Support for Stable Diffusion, Midjourney, DALL-E, Leonardo AI

#### 3. AI LipSync
- **Video Translation**: Translate video content to different languages
- **Video Dubbing**: Replace audio with translated speech while maintaining lip sync
- **Multiple AI Services**: Support for Wav2Lip, Sync Labs, ElevenLabs, HeyGen

## 🗄️ Database Schema

### New Tables

#### `workspaces`
- Core workspace information
- Subscription plans and credit management
- User limits and storage quotas

#### `workspace_users`
- Many-to-many relationship between users and workspaces
- Role and permission management
- Join timestamps

#### `ai_voices`
- AI voice generation requests
- Input/output file paths
- ElevenLabs integration data

#### `ai_avatars`
- AI image and video generation
- Prompt and generation settings
- Multiple AI service support

#### `ai_lip_syncs`
- Video translation and dubbing
- Language pair management
- Lip sync processing settings

### Updated Tables
All existing AI-related tables now include `workspace_id` for multi-workspace support.

## 🚀 API Endpoints

### Workspace Management
```
GET    /api/workspace                    - List user's workspaces
POST   /api/workspace                    - Create new workspace
GET    /api/workspace/{id}              - Get workspace details
PUT    /api/workspace/{id}              - Update workspace
DELETE /api/workspace/{id}              - Delete workspace
POST   /api/workspace/{id}/add-user     - Add user to workspace
POST   /api/workspace/{id}/remove-user  - Remove user from workspace
GET    /api/workspace/{id}/statistics   - Get workspace statistics
```

### AI Voices
```
GET    /api/ai-voice                    - List AI voices
POST   /api/ai-voice                    - Create AI voice request
GET    /api/ai-voice/{id}              - Get AI voice details
PUT    /api/ai-voice/{id}              - Update AI voice
DELETE /api/ai-voice/{id}              - Delete AI voice
GET    /api/ai-voice/available-voices  - Get ElevenLabs voices
```

### AI Avatars
```
GET    /api/ai-avatar                   - List AI avatars
POST   /api/ai-avatar                   - Create AI avatar request
GET    /api/ai-avatar/{id}             - Get AI avatar details
PUT    /api/ai-avatar/{id}             - Update AI avatar
DELETE /api/ai-avatar/{id}             - Delete AI avatar
GET    /api/ai-avatar/available-services - Get AI services
```

### AI LipSync
```
GET    /api/ai-lip-sync                 - List AI lip syncs
POST   /api/ai-lip-sync                 - Create AI lip sync request
GET    /api/ai-lip-sync/{id}           - Get AI lip sync details
PUT    /api/ai-lip-sync/{id}           - Update AI lip sync
DELETE /api/ai-lip-sync/{id}           - Delete AI lip sync
GET    /api/ai-lip-sync/available-services - Get AI services
GET    /api/ai-lip-sync/supported-languages - Get languages
```

## 🔐 Authentication & Authorization

### Workspace Selection
- Use `X-Workspace-ID` header to specify workspace
- Middleware automatically validates workspace access
- Users can only access workspaces they belong to

### Role-Based Permissions
- **Owner**: Full access to all features
- **Admin**: Manage users, content, and billing
- **Member**: Create and manage content
- **Viewer**: Read-only access

## 💰 Credit System

### Credit Costs
- **Text to Speech**: 1 credit
- **Speech to Text**: 2 credits
- **Speech to Speech**: 3 credits
- **Voice Clone**: 5 credits
- **Text to Image**: 1 credit
- **Image to Video**: 3 credits
- **Video Translation**: 3 credits
- **Video Dubbing**: 5 credits

### Subscription Plans
- **Free**: 100 credits, 5 users, 10GB storage
- **Basic**: 200 credits, 10 users, 50GB storage
- **Pro**: 500 credits, 20 users, 100GB storage
- **Enterprise**: 1000+ credits, 50+ users, 500GB+ storage

## 🛠️ Configuration

### Environment Variables
```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_BASE_URL=https://api.elevenlabs.io/v1
```

### Services Configuration
```php
// config/services.php
'elevenlabs' => [
    'api_key' => env('ELEVENLABS_API_KEY'),
    'base_url' => env('ELEVENLABS_BASE_URL', 'https://api.elevenlabs.io/v1'),
],
```

## 📁 File Storage

### Directory Structure
```
storage/app/public/
├── ai-voices/
│   ├── input/          # Audio input files
│   └── output/         # Generated audio files
├── ai-avatars/
│   ├── input/          # Image input files
│   └── output/         # Generated images/videos
└── ai-lip-syncs/
    ├── input/          # Video/audio input files
    └── output/         # Processed videos
```

## 🔄 Migration & Setup

### 1. Run Migrations
```bash
php artisan migrate
```

### 2. Seed Database
```bash
php artisan db:seed
```

### 3. Create Storage Link
```bash
php artisan storage:link
```

### 4. Set Environment Variables
Configure your ElevenLabs API key and other required services.

## 🧪 Testing

### API Testing
Use the provided API endpoints with proper authentication and workspace headers.

### Example Request
```bash
curl -X POST http://localhost:8000/api/ai-voice \
  -H "Authorization: Bearer {token}" \
  -H "X-Workspace-ID: {workspace_id}" \
  -F "name=My TTS Request" \
  -F "type=text_to_speech" \
  -F "input_text=Hello, world!"
```

## 🔮 Future Enhancements

### Planned Features
- **Real-time processing**: WebSocket support for live updates
- **Batch processing**: Handle multiple requests simultaneously
- **Advanced analytics**: Usage statistics and performance metrics
- **API rate limiting**: Prevent abuse and ensure fair usage
- **Webhook support**: Notify external systems of completion
- **Export functionality**: Download generated content in various formats

### Integration Opportunities
- **Payment gateways**: Stripe, PayPal for subscription management
- **Cloud storage**: AWS S3, Google Cloud Storage for file management
- **CDN integration**: Fastly, Cloudflare for content delivery
- **Analytics**: Google Analytics, Mixpanel for user behavior tracking

## 📚 Additional Resources

### Documentation
- [ElevenLabs API Documentation](https://docs.elevenlabs.io/)
- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev/)

### Support
For technical support or feature requests, please contact the development team.

---

**Note**: This is a complete redesign of the business model. All existing functionality has been preserved and enhanced with the new multi-workspace architecture and AI capabilities.