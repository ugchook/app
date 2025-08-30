<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ai_lip_syncs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->enum('type', ['video_translation', 'video_dubbing']);
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->string('input_video_path');
            $table->string('input_audio_path')->nullable();
            $table->string('output_video_path')->nullable();
            $table->string('output_audio_path')->nullable();
            $table->string('source_language', 10);
            $table->string('target_language', 10);
            $table->text('transcription_text')->nullable();
            $table->text('translated_text')->nullable();
            $table->string('voice_id')->nullable(); // ElevenLabs voice ID for dubbing
            $table->json('lip_sync_settings')->nullable();
            $table->string('ai_service')->default('wav2lip');
            $table->string('service_job_id')->nullable();
            $table->integer('processing_time')->nullable();
            $table->integer('credits_used')->default(0);
            $table->json('metadata')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_lip_syncs');
    }
};