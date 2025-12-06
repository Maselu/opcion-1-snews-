<?php

namespace App\Guards;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;
use Illuminate\Support\Facades\Log;

class SupabaseGuard implements Guard
{
    protected $request;
    protected $provider;
    protected $user;

    public function __construct(UserProvider $provider, Request $request)
    {
        $this->provider = $provider;
        $this->request = $request;
    }

    public function check()
    {
        return !is_null($this->user());
    }

    public function guest()
    {
        return !$this->check();
    }

    public function user()
    {
        if ($this->user) {
            return $this->user;
        }

        $token = $this->request->bearerToken();

        if (!$token) {
            Log::warning('SupabaseGuard: No bearer token found in request');
            return null;
        }

        Log::info('SupabaseGuard: Token received (first 20 chars): ' . substr($token, 0, 20) . '...');

        try {
            $secret = env('SUPABASE_JWT_SECRET');
            if (!$secret) {
                Log::error('SupabaseGuard: SUPABASE_JWT_SECRET not configured');
                throw new Exception('Supabase JWT Secret not configured.');
            }

            Log::info('SupabaseGuard: JWT Secret configured (first 10 chars): ' . substr($secret, 0, 10) . '...');

            $credentials = JWT::decode($token, new Key($secret, 'HS256'));

            // The 'sub' claim contains the user UUID
            $id = $credentials->sub;
            Log::info('SupabaseGuard: Decoded user ID: ' . $id);

            // Retrieve the user from the provider (which maps to public.users)
            $this->user = $this->provider->retrieveById($id);

            if ($this->user) {
                Log::info('SupabaseGuard: User found in database: ' . $this->user->email);
            } else {
                Log::warning('SupabaseGuard: User ID ' . $id . ' not found in public.users table');
            }

            return $this->user;
        } catch (Exception $e) {
            Log::error('SupabaseGuard: JWT decode error: ' . $e->getMessage());
            return null;
        }
    }

    public function id()
    {
        if ($this->user()) {
            return $this->user()->getAuthIdentifier();
        }
        return null;
    }

    public function validate(array $credentials = [])
    {
        return false; // Not used for stateless JWT
    }

    public function hasUser()
    {
        return !is_null($this->user);
    }

    public function setUser(Authenticatable $user)
    {
        $this->user = $user;
        return $this;
    }
}
