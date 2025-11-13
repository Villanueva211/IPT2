<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code', 'status'];

    protected $attributes = [
        'status' => 'active',
    ];

    // Relationships
    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function faculties()
    {
        return $this->hasMany(Faculty::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeArchived($query)
    {
        return $query->where('status', 'inactive');
    }
}
