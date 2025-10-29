<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; 
use Illuminate\Support\Str;

class LogRequestResponse
{
    public function handle(Request $request, Closure $next)
    {
        $traceId = (string) Str::uuid();
        $userId = optional($request->user())->id;

        // ✅ This MUST match the custom channel names
        Log::channel('logstash')->info('Request', [
            'trace_id' => $traceId,
            'user_id' => $userId,
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip' => $request->ip(),
            'body' => $request->except(['password', 'token']),
        ]);

        $response = $next($request);

        Log::channel('logstash')->info('Response', [
            'trace_id' => $traceId,
            'user_id' => $userId,
            'status' => $response->getStatusCode(),
            'content' => method_exists($response, 'getContent') ? substr($response->getContent(), 0, 1000) : '[binary]',
        ]);

        $response->headers->set('X-Trace-ID', $traceId);

        return $response;
    }
}