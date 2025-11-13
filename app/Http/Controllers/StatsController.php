<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Faculty;
use App\Models\Department;
use App\Models\Course;

class StatsController extends Controller
{
    /**
     * GET /api/stats/counts
     * Summary cards
     */
    public function counts()
    {
        return response()->json([
            'students'    => Student::count(),
            'faculties'   => Faculty::count(),
            'departments' => Department::count(),
            'courses'     => Course::count(),
        ]);
    }

    /**
     * GET /api/stats/course-enrollment
     * Pie chart: students per course
     * Returns one row per course (BSIT/BSCS/BSEMF…), even if count is 0
     */
    public function courseEnrollment()
    {
        $rows = Course::select('id', 'name', 'code')
            ->withCount('students') // uses Course::students() relationship
            ->orderBy('name')
            ->get()
            ->map(function (Course $c) {
                return [
                    'course_id'     => (int) $c->id,
                    'course_name'   => $c->code ?: $c->name, // label in your pie
                    'student_count' => (int) $c->students_count,
                ];
            });

        return response()->json($rows);
    }
}
