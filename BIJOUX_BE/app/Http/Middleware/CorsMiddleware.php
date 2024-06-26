<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    protected $allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:8000',
        'https://advanced-fine-baboon.ngrok-free.app',
        'https://fair-upward-satyr.ngrok-free.app',
    ];
    public function handle(Request $request, Closure $next): Response
    {
        $origin = $request->headers->get('Origin');

        if (in_array($origin, $this->allowedOrigins)) {
            // header("Access-Control-Allow-Origin: $origin");
            // header('Access-Control-Allow-Methods: *');
            // header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization, X-Requested-With, x-xsrf-token, x-csrf-token');
            // header('Access-Control-Allow-Credentials: true');
            // header('Access-Control-Expose-Headers: Origin, Content-Type, X-Auth-Token, Authorization, X-Requested-With, x-xsrf-token, x-csrf-token');
            // header('Access-Control-Max-Age: 86400'); // 24 hours
            $headers = [
                'Access-Control-Allow-Origin' => $origin,
                'Access-Control-Allow-Methods' => '*',
                'Access-Control-Allow-Headers' => 'Origin, Content-Type, X-Auth-Token, Authorization, X-Requested-With, x-xsrf-token, x-csrf-token',
                'Access-Control-Expose-Headers' => 'Origin, Content-Type, X-Auth-Token, Authorization, X-Requested-With, x-xsrf-token, x-csrf-token',
                'Access-Control-Allow-Credentials' => 'true',
                'Access-Control-Max-Age' => '86400', // 24 hours   
            ];
        }
        // $headers = [
        //     'Access-Control-Allow-Origin' => ['http://localhost:3000', 'http://localhost:3001'],
        //     'Access-Control-Allow-Methods' => '*',
        //     'Access-Control-Allow-Headers' => 'Origin, Content-Type, X-Auth-Token, Authorization, X-Requested-With, x-xsrf-token, x-csrf-token',
        //     'Access-Control-Expose-Headers' => 'Origin, Content-Type, X-Auth-Token, Authorization, X-Requested-With, x-xsrf-token, x-csrf-token',
        //     'Access-Control-Allow-Credentials' => 'true',
        //     'Access-Control-Max-Age' => '86400', // 24 hours   
        // ];

        if ($request->isMethod('OPTIONS')) {
            return response()->json('{"method":"OPTIONS"}', 200, $headers);
        }

        $response = $next($request);

        foreach ($headers as $key => $value) {
            $response->header($key, $value);
        }

        return $response;
    }
}
