<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAcademicYearsTable extends Migration
{
    public function up()
    {
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id();
            $table->string('year'); // e.g. "2025-2026"
            $table->string('semester')->nullable(); // e.g. "1st Semester"
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('academic_years');
    }
}
