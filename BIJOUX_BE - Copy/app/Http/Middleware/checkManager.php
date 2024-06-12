<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;


class checkManager
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $authorizationHeader = $request->header('Authorization');
        $token = null;
        $decodedToken = null;

        if ($authorizationHeader && strpos($authorizationHeader, 'Bearer ') === 0) {
            $token = substr($authorizationHeader, 7); // Extract the token part after 'Bearer '
            try {
                $decodedToken = JWTAuth::decode(new \Tymon\JWTAuth\Token($token));
            } catch (JWTException $e) {
                return response()->json(['error' => 'Invalid Token'], 401);
            }
        }
        if ($decodedToken) {
            $role_id = $decodedToken['role_id'];
            if ($role_id == '1') {
                return $next($request);
            } else {
                return response()->json(['error' => 'Unauthorized'], 500);
            }
        } else {
            return response()->json(['error' => 'User hasn\'t logged in'], 500);
        }
    }
}
