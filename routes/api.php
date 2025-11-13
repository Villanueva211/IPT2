<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AuthController,
    DashboardController,
    FacultyController,
    StudentController,
    CourseController,
    DepartmentController,
    AcademicYearController,
    StatsController,
    ProfileController // ✅ Added for profile section
};

// =======================
// 🔓 PUBLIC ROUTES
// =======================
Route::post('/login', [AuthController::class, 'login']);

// =======================
// 🔒 PROTECTED ROUTES (requires token via Sanctum)
// =======================
Route::middleware('auth:sanctum')->group(function () {

    // 🔹 AUTH MANAGEMENT
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/change-password', [AuthController::class, 'changePassword']);

    // 🔹 DASHBOARD STATS
    Route::get('/stats/counts', [DashboardController::class, 'getCounts']);
    Route::get('/stats/course-enrollment', [StatsController::class, 'courseEnrollment']); // ✅ New Route

    // 🔹 PROFILE ROUTES
    Route::get('/profile', [ProfileController::class, 'me']); // View profile
    Route::put('/profile', [ProfileController::class, 'updateProfile']); // Update name/email
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']); // Change password
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']); // Upload avatar

    // 🔹 STUDENTS CRUD
    Route::apiResource('students', StudentController::class);

    // 🔹 FACULTIES CRUD + ARCHIVE
    Route::apiResource('faculties', FacultyController::class);
    Route::put('/faculties/{faculty}/archive', [FacultyController::class, 'archive']);

    // 🔹 COURSES CRUD + ARCHIVE
    Route::apiResource('courses', CourseController::class);
    Route::put('/courses/{course}/archive', [CourseController::class, 'archive']);

    // 🔹 DEPARTMENTS CRUD + ARCHIVE
    Route::apiResource('departments', DepartmentController::class);
    Route::put('/departments/{department}/archive', [DepartmentController::class, 'archive']);

    // 🔹 ACADEMIC YEARS CRUD
    Route::apiResource('academic-years', AcademicYearController::class);
});
