<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index()
    {
        return response()->json(AcademicYear::orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|string|unique:academic_years,year',
        ]);

        $academicYear = AcademicYear::create($validated);

        return response()->json([
            'message' => 'Academic year created successfully.',
            'data' => $academicYear
        ], 201);
    }

    public function show(AcademicYear $academicYear)
    {
        return response()->json($academicYear);
    }

    public function update(Request $request, AcademicYear $academicYear)
    {
        $validated = $request->validate([
            'year' => 'required|string|unique:academic_years,year,' . $academicYear->id,
        ]);

        $academicYear->update($validated);

        return response()->json([
            'message' => 'Academic year updated successfully.',
            'data' => $academicYear
        ]);
    }

    public function destroy(AcademicYear $academicYear)
    {
        $academicYear->delete();
        return response()->json(['message' => 'Academic year deleted successfully.']);
    }
}
