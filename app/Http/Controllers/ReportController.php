<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Faculty;

class ReportController extends Controller
{
    public function generate($type)
    {
        if ($type === 'students') {
            $data = Student::with(['department', 'course'])->get();
        } elseif ($type === 'faculty') {
            $data = Faculty::with('department')->get();
        } else {
            return response()->json(['error' => 'Invalid report type'], 400);
        }

        return response()->json($data);
    }
}
