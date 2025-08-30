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
        // Add workspace_id to existing tables
        Schema::table('ai_images', function (Blueprint $table) {
            $table->foreignId('workspace_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            $table->softDeletes();
        });

        Schema::table('ai_videos', function (Blueprint $table) {
            $table->foreignId('workspace_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            $table->softDeletes();
        });

        Schema::table('ai_contents', function (Blueprint $table) {
            $table->foreignId('workspace_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            $table->softDeletes();
        });

        Schema::table('ai_slideshows', function (Blueprint $table) {
            $table->foreignId('workspace_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            $table->softDeletes();
        });

        Schema::table('campaigns', function (Blueprint $table) {
            $table->foreignId('workspace_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            $table->softDeletes();
        });

        Schema::table('scheduled_videos', function (Blueprint $table) {
            $table->foreignId('workspace_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            $table->softDeletes();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('workspace_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            $table->softDeletes();
        });

        Schema::table('demos', function (Blueprint $table) {
            $table->foreignId('workspace_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            $table->softDeletes();
        });

        Schema::table('music', function (Blueprint $table) {
            $table->foreignId('workspace_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            $table->softDeletes();
        });

        Schema::table('ads', function (Blueprint $table) {
            $table->foreignId('workspace_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove workspace_id from existing tables
        Schema::table('ai_images', function (Blueprint $table) {
            $table->dropForeign(['workspace_id']);
            $table->dropColumn('workspace_id');
            $table->dropSoftDeletes();
        });

        Schema::table('ai_videos', function (Blueprint $table) {
            $table->dropForeign(['workspace_id']);
            $table->dropColumn('workspace_id');
            $table->dropSoftDeletes();
        });

        Schema::table('ai_contents', function (Blueprint $table) {
            $table->dropForeign(['workspace_id']);
            $table->dropColumn('workspace_id');
            $table->dropSoftDeletes();
        });

        Schema::table('ai_slideshows', function (Blueprint $table) {
            $table->dropForeign(['workspace_id']);
            $table->dropColumn('workspace_id');
            $table->dropSoftDeletes();
        });

        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropForeign(['workspace_id']);
            $table->dropColumn('workspace_id');
            $table->dropSoftDeletes();
        });

        Schema::table('scheduled_videos', function (Blueprint $table) {
            $table->dropForeign(['workspace_id']);
            $table->dropColumn('workspace_id');
            $table->dropSoftDeletes();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['workspace_id']);
            $table->dropColumn('workspace_id');
            $table->dropSoftDeletes();
        });

        Schema::table('demos', function (Blueprint $table) {
            $table->dropForeign(['workspace_id']);
            $table->dropColumn('workspace_id');
            $table->dropSoftDeletes();
        });

        Schema::table('music', function (Blueprint $table) {
            $table->dropForeign(['workspace_id']);
            $table->dropColumn('workspace_id');
            $table->dropSoftDeletes();
        });

        Schema::table('ads', function (Blueprint $table) {
            $table->dropForeign(['workspace_id']);
            $table->dropColumn('workspace_id');
            $table->dropSoftDeletes();
        });
    }
};