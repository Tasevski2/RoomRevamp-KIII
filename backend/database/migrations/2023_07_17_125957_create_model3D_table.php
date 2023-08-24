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
        Schema::create('model3D', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->bigInteger('owner_id')->unsigned()->index();
            $table->foreign('owner_id')->references('id')->on('users')->cascadeOnDelete();
            $table->string('model_src');
            $table->string('preview_image_src');
            $table->boolean('is_public')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('model3D');
    }
};