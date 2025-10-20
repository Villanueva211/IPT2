<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Faculty;
use App\Models\Department;
use App\Models\Course;
use App\Models\AcademicYear;

class DashboardController extends Controller
{
    public function getCounts()
    {
        return response()->json([
            'students' => Student::count(),
            'faculties' => Faculty::count(),
            'departments' => Department::count(),
            'courses' => Course::count(),
            'academic_years' => AcademicYear::count(),
        ]);
    }
}
