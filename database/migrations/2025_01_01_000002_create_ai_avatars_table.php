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
        Schema::create('ai_avatars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->enum('type', ['text_to_image', 'image_to_video']);
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->text('prompt');
            $table->text('negative_prompt')->nullable();
            $table->string('input_image_path')->nullable();
            $table->string('output_image_path')->nullable();
            $table->string('output_video_path')->nullable();
            $table->json('generation_settings')->nullable();
            $table->string('ai_service')->default('stable_diffusion');
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
        Schema::dropIfExists('ai_avatars');
    }
};