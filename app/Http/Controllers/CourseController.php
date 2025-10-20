<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        return response()->json(Course::with('department')->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $course = Course::create($validated);
        return response()->json($course, 201);
    }

    public function show(Course $course)
    {
        return response()->json($course->load('department'));
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $course->update($validated);
        return response()->json($course);
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return response()->json(null, 204);
    }
}
