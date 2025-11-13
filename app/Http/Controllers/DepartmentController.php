<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $archived = $request->query('archived') === 'true';
        $query = Department::query();

        $query = $archived ? $query->archived() : $query->active();

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:50|unique:departments,code',
            ]);

            $department = Department::create($validated);
            return response()->json($department, 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Department store error: '.$e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Server error while creating department'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:50|unique:departments,code,' . $department->id,
            ]);

            $department->update($validated);

            return response()->json($department);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Department update error: '.$e->getMessage(), ['exception' => $e, 'id' => $id]);
            return response()->json(['message' => 'Server error while updating department'], 500);
        }
    }

    public function archive($id)
    {
        $department = Department::findOrFail($id);
        $department->status = $department->status === 'active' ? 'inactive' : 'active';
        $department->save();

        return response()->json(['message' => 'Department status updated successfully.']);
    }

    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return response()->json(['message' => 'Department deleted successfully.']);
    }
}
