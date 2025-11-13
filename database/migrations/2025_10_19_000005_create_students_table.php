<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable()->unique();

            // ✅ All foreign keys are nullable and properly linked
            $table->foreignId('department_id')
                ->nullable()
                ->constrained('departments')
                ->nullOnDelete();

            $table->foreignId('course_id')
                ->nullable()
                ->constrained('courses')
                ->nullOnDelete();

            $table->foreignId('academic_year_id')
                ->nullable()
                ->constrained('academic_years')
                ->nullOnDelete();

            // ✅ status column
            $table->string('status')->default('active');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('students');
    }
};
