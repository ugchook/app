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
        Schema::create('ads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('hook_text');
            $table->unsignedBigInteger('video_id');
            $table->unsignedBigInteger('demo_id')->nullable();
            $table->unsignedBigInteger('music_id')->nullable();
            $table->json('configuration');
            $table->string('thumbnail_url')->nullable();
            $table->string('url')->nullable();
            $table->string('status')->default('pending'); // pending, processing, completed, failed, deleted
            $table->string('source')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ads');
    }
};
