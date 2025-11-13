<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'position',
        'department_id',
        'status'
    ];

    // Relationship: belongs to a department
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    // Scope for active and archived (inactive)
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeArchived($query)
    {
        return $query->where('status', 'inactive');
    }
}
