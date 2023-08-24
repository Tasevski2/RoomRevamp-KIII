<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects_models3D', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('model3D_id');
            $table->float('x')->default(0);
            $table->float('y')->default(0.275);
            $table->float('z')->default(0);
            $table->float('r_x')->default(0);
            $table->float('r_y')->default(0);
            $table->float('r_z')->default(0);
            $table->foreign('project_id')->references('id')->on('project')->cascadeOnDelete();
            $table->foreign('model3D_id')->references('id')->on('model3D')->cascadeOnDelete();
            $table->index('project_id');
            $table->index('model3D_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects_models3D');
    }
};