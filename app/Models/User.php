<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name','email','password','avatar_path'];
    protected $hidden = ['password','remember_token'];
    protected $appends = ['avatar_url'];

    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar_path && Storage::disk('public')->exists($this->avatar_path)) {
            return Storage::url($this->avatar_path);
        }
        // fallback avatar
        return 'https://ui-avatars.com/api/?name='.urlencode($this->name).'&background=0D8ABC&color=fff';
    }
}
