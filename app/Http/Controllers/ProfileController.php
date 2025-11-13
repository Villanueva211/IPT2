<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    // GET /api/profile
    public function me(Request $request)
    {
        return response()->json($request->user()->only(['id','name','email','avatar_url']));
    }

    // PUT /api/profile (name/email)
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'  => ['required','string','max:255'],
            'email' => ['required','email','max:255', Rule::unique('users','email')->ignore($user->id)],
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated.',
            'user'    => $user->only(['id','name','email','avatar_url']),
        ]);
    }

    // PUT /api/profile/password
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'current_password'      => ['required','string'],
            'password'              => ['required','string','min:8','confirmed'],
        ]);

        if (!Hash::check($data['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }

        $user->password = Hash::make($data['password']);
        $user->save();

        return response()->json(['message' => 'Password updated.']);
    }

    // POST /api/profile/avatar  (multipart/form-data)
    public function updateAvatar(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'avatar' => ['required','image','mimes:jpg,jpeg,png,webp','max:2048'],
        ]);

        if ($user->avatar_path && Storage::disk('public')->exists($user->avatar_path)) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->avatar_path = $path;
        $user->save();

        return response()->json([
            'message'    => 'Avatar updated.',
            'avatar_url' => $user->avatar_url,
        ]);
    }
}
