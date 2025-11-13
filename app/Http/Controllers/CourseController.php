<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $archived = $request->query('archived') === 'true';
        $query = Course::with('department');

        $query = $archived ? $query->archived() : $query->active();

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:50|unique:courses,code',
                'department_id' => 'required|exists:departments,id',
            ]);

            $course = Course::create($validated);

            // Return created resource with relation
            $course = Course::with('department')->find($course->id);

            return response()->json($course, 201);
        } catch (ValidationException $e) {
            // Return validation errors as JSON (422)
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Course store error: '.$e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Server error while creating course'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:50|unique:courses,code,' . $course->id,
                'department_id' => 'required|exists:departments,id',
            ]);

            $course->update($validated);

            $course = Course::with('department')->find($course->id);
            return response()->json($course);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Course update error: '.$e->getMessage(), ['exception' => $e, 'id' => $id]);
            return response()->json(['message' => 'Server error while updating course'], 500);
        }
    }

    public function archive($id)
    {
        $course = Course::findOrFail($id);
        $course->status = $course->status === 'active' ? 'inactive' : 'active';
        $course->save();

        return response()->json(['message' => 'Course status updated successfully.']);
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return response()->json(['message' => 'Course deleted successfully.']);
    }
}
