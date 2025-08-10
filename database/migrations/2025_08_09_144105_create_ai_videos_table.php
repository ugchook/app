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
        Schema::create('ai_videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('prompt');
            $table->foreignId('image_id')->constrained('ai_images')->onDelete('cascade');
            $table->string('image_thumbnail');
            $table->json('options');
            $table->string('url')->nullable();
            $table->string('fal_id')->nullable();
            $table->string('fal_url')->nullable();
            $table->string('status')->default('processing'); // processing, completed, failed
            $table->string('source')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_videos');
    }
};
