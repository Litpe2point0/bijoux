<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\DB;
use Throwable;

class checkUserLogin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next): Response
    {
        $authorizationHeader = $request->header('Authorization');
        $token = null;
        $decodedToken = null;

        if ($authorizationHeader && strpos($authorizationHeader, 'Bearer ') === 0) {
            $token = substr($authorizationHeader, 7); // Extract the token part after 'Bearer '
            try {
                $decodedToken = JWTAuth::decode(new \Tymon\JWTAuth\Token($token));
            } catch (JWTException $e) {
                try {
                    $decodedToken = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            }
        }

        if ($decodedToken) {
            try {
                $id = $decodedToken['id'];
            } catch (Throwable $e) {
                $id = $decodedToken->id;
            }
            $account = DB::table('account')->where('id', $id)->first();
            $deactivated = (bool) $account->deactivated;
            $status = (bool) $account->status;
            if ($account->role_id == 5) {
                if ($status) {
                    if ($deactivated) {
                        return response()->json(['error' => 'isDeactivated'], 500);
                    } else {
                        return $next($request);
                    }
                } else {
                    return response()->json(['error' => 'Wrong username or password'], 500);
                }
            } else {
                return $next($request);
            }
        } else {
            return response()->json(['error' => 'User hasn\'t logged in'], 500);
        }
    }
}
