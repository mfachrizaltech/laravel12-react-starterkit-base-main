<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthRoutePermission
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        // Bypass permission check if user is a superuser
        if ($user && $user->hasRole('superuser')) {
            return $next($request);
        }

        // Get current route name or URI
        $routeName = $request->route()->getName();  
        $routeUri  = $request->route()->uri();   

        // Decide which to check (usually route name is better)
        $permissionToCheck = $routeName ?: $routeUri;

        // Check if user has the permission
        if ($user && $permissionToCheck && !$user->can($permissionToCheck)) {
            abort(403, 'You do not have permission to access this resource.');
        }

        return $next($request);
    }
}
