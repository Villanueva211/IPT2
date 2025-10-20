<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index()
    {
        return response()->json(AcademicYear::orderBy('year','desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|string|max:50',
            'semester' => 'required|string|max:100',
        ]);

        $ay = AcademicYear::create($validated);
        return response()->json($ay, 201);
    }

    public function update(Request $request, AcademicYear $academicYear)
    {
        $validated = $request->validate([
            'year' => 'required|string|max:50',
            'semester' => 'required|string|max:100',
        ]);

        $academicYear->update($validated);
        return response()->json($academicYear);
    }

    public function destroy(AcademicYear $academicYear)
    {
        $academicYear->delete();
        return response()->json(null, 204);
    }
}
