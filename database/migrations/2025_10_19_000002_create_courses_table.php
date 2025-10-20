<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoursesTable extends Migration
{
    public function up()
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->timestamps();

            $table->foreign('department_id')->references('id')->on('departments')->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::dropIfExists('courses');
    }
}
