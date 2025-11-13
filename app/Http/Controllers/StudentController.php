<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        // Eager load relations used by UI
        return response()->json(
            Student::with(['department','course','academicYear'])
                   ->orderBy('name')
                   ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:students,email',
            'department_id' => 'nullable|exists:departments,id',
            'course_id' => 'nullable|exists:courses,id',
            'academic_year_id' => 'nullable|exists:academic_years,id',
            'status' => 'nullable|in:active,archived,inactive',
        ]);

        // default status to active if not provided
        if (!isset($validated['status'])) {
            $validated['status'] = 'active';
        }

        $student = Student::create($validated);

        return response()->json($student->load(['department','course','academicYear']), 201);
    }

    public function show(Student $student)
    {
        return response()->json($student->load(['department','course','academicYear']));
    }

    public function update(Request $request, Student $student)
    {
        // Allow partial updates: use sometimes so we can update only status
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|nullable|email|unique:students,email,' . $student->id,
            'department_id' => 'sometimes|nullable|exists:departments,id',
            'course_id' => 'sometimes|nullable|exists:courses,id',
            'academic_year_id' => 'sometimes|nullable|exists:academic_years,id',
            'status' => 'sometimes|in:active,archived,inactive',
        ]);

        $student->update($validated);

        return response()->json($student->load(['department','course','academicYear']));
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return response()->json(null, 204);
    }
}
