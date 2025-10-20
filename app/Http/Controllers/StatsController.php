<?php
namespace App\Http\Controllers;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Department;
use App\Models\Course;

class StatsController extends Controller
{
    public function counts()
    {
        return response()->json([
            'students' => Student::count(),
            'faculties' => Faculty::count(),
            'departments' => Department::count(),
            'courses' => Course::count()
        ]);
    }
}
