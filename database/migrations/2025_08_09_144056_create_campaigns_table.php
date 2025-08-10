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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('platform')->nullable(); // tiktok | instagram
            $table->unsignedBigInteger('user_platform_id')->nullable(); // userTiktok.id or userInstagram.id
            $table->string('content_type'); // slideshow_video | slideshow_image | ads | content
            $table->text('content_description');
            $table->string('status')->default('active'); // active | inactive | deleted
            $table->json('configuration');
            $table->timestamp('next_video_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
