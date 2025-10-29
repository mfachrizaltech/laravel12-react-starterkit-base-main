<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;
use App\Models\Permission;

class SyncPermissionsFromRoutes extends Command
{
    protected $signature = 'permissions:sync-from-routes';
    protected $description = 'Sync only routes with auth + verified middleware into the permissions table';

    public function handle()
    {
        $routes = Route::getRoutes();

        $count = 0;

        foreach ($routes as $route) {
            $name = $route->getName();

            // Skip routes without a name
            if (!$name) {
                continue;
            }

            // Get all middleware for this route
            $middleware = $route->gatherMiddleware();
 
            if (!in_array('auth', $middleware) || !in_array('verified', $middleware)) {
                continue;
            }

            // Extract module from route name (before the first dot)
            $module = explode('.', $name)[0] ?? 'general';

            Permission::updateOrCreate(
                ['name' => $name],
                [
                    'module' => $module,
                    'label' => ucwords(str_replace('.', ' ', $name)),
                    'description' => 'Auto-synced from route: ' . $route->uri(),
                    'is_active' => 1,
                    'guard_name' => 'web',
                ]
            );

            $count++;
        }

        $this->info("Synced $count permissions from routes with 'auth' and 'verified' middleware.");
    }
}
