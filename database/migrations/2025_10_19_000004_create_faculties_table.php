<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacultiesTable extends Migration
{
    public function up()
    {
        Schema::create('faculties', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique()->nullable();
            $table->string('position')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->foreign('department_id')->references('id')->on('departments')->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::dropIfExists('faculties');
    }
}
