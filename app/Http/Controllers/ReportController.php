<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Faculty;

class ReportController extends Controller
{
    public function generate($type)
    {
        if ($type === 'students') {
            // Include related models for display
            $students = Student::with(['department', 'course'])->get();

            // Transform for consistent frontend structure
            return response()->json($students->map(function ($s) {
                return [
                    'id' => $s->id,
                    'first_name' => $s->first_name ?? '',
                    'last_name' => $s->last_name ?? '',
                    'email' => $s->email ?? '',
                    'department' => [
                        'name' => $s->department->name ?? '',
                    ],
                    'course' => [
                        'name' => $s->course->name ?? '',
                    ],
                ];
            }));
        }

        if ($type === 'faculty') {
            $faculty = Faculty::with('department')->get();

            return response()->json($faculty->map(function ($f) {
                return [
                    'id' => $f->id,
                    // Normalize naming so frontend doesn’t need conditions
                    'first_name' => $f->first_name ?? '',
                    'last_name' => $f->last_name ?? '',
                    'name' => $f->name ?? trim(($f->first_name ?? '') . ' ' . ($f->last_name ?? '')),
                    'email' => $f->email ?? '',
                    'department' => [
                        'name' => $f->department->name ?? '',
                    ],
                ];
            }));
        }

        return response()->json(['error' => 'Invalid report type'], 400);
    }
}
