<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Workspace;
use App\Models\User;
use Illuminate\Support\Str;

class WorkspaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a default workspace for existing users
        $users = User::all();
        
        foreach ($users as $user) {
            $workspace = Workspace::create([
                'name' => $user->name . '\'s Workspace',
                'description' => 'Default workspace for ' . $user->name,
                'slug' => Str::slug($user->name) . '-workspace-' . Str::random(6),
                'subscription_plan' => 'free',
                'credits_balance' => 100,
                'max_users' => 5,
                'max_storage_gb' => 10,
                'settings' => [
                    'theme' => 'light',
                    'language' => 'en',
                    'timezone' => 'UTC'
                ]
            ]);

            // Add user as owner
            $workspace->users()->attach($user->id, [
                'role' => 'owner',
                'permissions' => ['*'],
                'joined_at' => now()
            ]);
        }

        // Create some additional sample workspaces
        $sampleWorkspaces = [
            [
                'name' => 'Creative Studio',
                'description' => 'Professional creative content production',
                'subscription_plan' => 'pro',
                'credits_balance' => 500,
                'max_users' => 20,
                'max_storage_gb' => 100,
            ],
            [
                'name' => 'Marketing Team',
                'description' => 'Marketing and advertising content creation',
                'subscription_plan' => 'basic',
                'credits_balance' => 200,
                'max_users' => 10,
                'max_storage_gb' => 50,
            ],
            [
                'name' => 'Educational Content',
                'description' => 'Educational videos and materials',
                'subscription_plan' => 'enterprise',
                'credits_balance' => 1000,
                'max_users' => 50,
                'max_storage_gb' => 500,
            ]
        ];

        foreach ($sampleWorkspaces as $workspaceData) {
            $workspace = Workspace::create([
                'name' => $workspaceData['name'],
                'description' => $workspaceData['description'],
                'slug' => Str::slug($workspaceData['name']) . '-' . Str::random(6),
                'subscription_plan' => $workspaceData['subscription_plan'],
                'credits_balance' => $workspaceData['credits_balance'],
                'max_users' => $workspaceData['max_users'],
                'max_storage_gb' => $workspaceData['max_storage_gb'],
                'settings' => [
                    'theme' => 'light',
                    'language' => 'en',
                    'timezone' => 'UTC'
                ]
            ]);

            // Add first user as admin
            if ($users->count() > 0) {
                $workspace->users()->attach($users->first()->id, [
                    'role' => 'admin',
                    'permissions' => ['manage_users', 'manage_content', 'manage_billing'],
                    'joined_at' => now()
                ]);
            }
        }
    }
}