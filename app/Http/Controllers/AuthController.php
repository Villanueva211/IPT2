<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        // Invalidate old tokens
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        // ✅ Return explicit shape including avatar_url
        return response()->json([
            'user'  => [
                'id'          => $user->id,
                'name'        => $user->name,
                'email'       => $user->email,
                'avatar_url'  => $user->avatar_url, // comes from accessor in User model
            ],
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        $u = $request->user();

        // ✅ Explicitly include avatar_url for the sidebar/App.js fetch
        return response()->json([
            'id'          => $u->id,
            'name'        => $u->name,
            'email'       => $u->email,
            'avatar_url'  => $u->avatar_url, // accessor in App\Models\User
        ]);
    }
}
