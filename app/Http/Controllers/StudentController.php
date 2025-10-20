<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json(Student::with(['department','course','academicYear'])->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:students,email',
            'department_id' => 'nullable|exists:departments,id',
            'course_id' => 'nullable|exists:courses,id',
            'academic_year_id' => 'nullable|exists:academic_years,id',
            'status' => 'nullable|in:active,inactive',
        ]);

        $student = Student::create($validated);
        return response()->json($student, 201);
    }

    public function show(Student $student)
    {
        return response()->json($student->load(['department','course','academicYear']));
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:students,email,' . $student->id,
            'department_id' => 'nullable|exists:departments,id',
            'course_id' => 'nullable|exists:courses,id',
            'academic_year_id' => 'nullable|exists:academic_years,id',
            'status' => 'nullable|in:active,inactive',
        ]);

        $student->update($validated);
        return response()->json($student);
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return response()->json(null, 204);
    }
}
