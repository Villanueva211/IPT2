<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function index(Request $request)
    {
        $archived = $request->query('archived') === 'true';
        $query = Faculty::with('department')->orderBy('name');

        $query->where('status', $archived ? 'inactive' : 'active');
        return response()->json($query->get());
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

    // ✅ Archive or Restore Faculty
    public function archive(Faculty $faculty)
    {
        $faculty->status = $faculty->status === 'active' ? 'inactive' : 'active';
        $faculty->save();
        return response()->json(['message' => 'Status toggled', 'faculty' => $faculty]);
    }
}
