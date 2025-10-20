<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function index()
    {
        return response()->json(Faculty::with('department')->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:faculties,email',
            'position' => 'nullable|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'status' => 'nullable|in:active,inactive',
        ]);

        $faculty = Faculty::create($validated);
        return response()->json($faculty, 201);
    }

    public function show(Faculty $faculty)
    {
        return response()->json($faculty->load('department'));
    }

    public function update(Request $request, Faculty $faculty)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:faculties,email,' . $faculty->id,
            'position' => 'nullable|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'status' => 'nullable|in:active,inactive',
        ]);

        $faculty->update($validated);
        return response()->json($faculty);
    }

    public function destroy(Faculty $faculty)
    {
        $faculty->delete();
        return response()->json(null, 204);
    }
}
