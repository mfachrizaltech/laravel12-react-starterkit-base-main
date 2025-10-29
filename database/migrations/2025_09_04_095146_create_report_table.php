<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // name', 'description', 'query', 'is_active

        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('name'); 
            $table->string('description')->nullable();
            $table->string('query'); 
            $table->boolean('is_active');
            $table->integer('version')->default(1);
            $table->auditable();
            $table->softDeletes();
            $table->timestamps();
        });

        // DB::unprepared('
        //     CREATE TRIGGER `before_update_reports` BEFORE UPDATE ON `reports`
        //     FOR EACH ROW SET NEW.version = OLD.version + 1;
        // ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
