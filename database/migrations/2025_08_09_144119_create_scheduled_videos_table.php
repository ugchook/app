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
        Schema::create('scheduled_videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('platform'); // tiktok | instagram
            $table->unsignedBigInteger('user_platform_id'); // userTiktok.id or userInstagram.id
            $table->string('video_type'); // slideshow | video | content
            $table->unsignedBigInteger('video_id');
            $table->json('options');
            $table->timestamp('schedule_at');
            $table->string('status')->default('pending'); // pending, completed, failed, deleted
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scheduled_videos');
    }
};
