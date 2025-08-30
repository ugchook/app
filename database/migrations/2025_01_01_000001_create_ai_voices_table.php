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
        Schema::create('ai_voices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->enum('type', ['text_to_speech', 'speech_to_text', 'speech_to_speech', 'voice_clone']);
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->text('input_text')->nullable();
            $table->string('input_audio_path')->nullable();
            $table->string('output_audio_path')->nullable();
            $table->text('output_text')->nullable();
            $table->string('voice_id')->nullable(); // ElevenLabs voice ID
            $table->json('voice_settings')->nullable();
            $table->string('elevenlabs_job_id')->nullable();
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
        Schema::dropIfExists('ai_voices');
    }
};