<?php

namespace App\Guards;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

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
            return null;
        }

        try {
            $secret = env('SUPABASE_JWT_SECRET');
            if (!$secret) {
                throw new Exception('Supabase JWT Secret not configured.');
            }

            $credentials = JWT::decode($token, new Key($secret, 'HS256'));

            // The 'sub' claim contains the user UUID
            $id = $credentials->sub;

            // Retrieve the user from the provider (which maps to public.users)
            $this->user = $this->provider->retrieveById($id);

            return $this->user;
        } catch (Exception $e) {
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
