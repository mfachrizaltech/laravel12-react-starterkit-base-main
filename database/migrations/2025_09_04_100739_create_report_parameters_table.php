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
        Schema::create('report_parameters', function (Blueprint $table) {
            $table->id();
            $table->integer('report_id')->index();            
            $table->string('label');
            $table->string('field_code'); 
            $table->string('parameter_type');
            $table->string('datasource')->nullable();
            $table->integer('version')->default(1);
            $table->auditable();
            $table->softDeletes();
            $table->timestamps();
        });

        DB::unprepared('
            CREATE TRIGGER `before_report_parameters` BEFORE UPDATE ON `report_parameters`
            FOR EACH ROW SET NEW.version = OLD.version + 1;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_parameters');
    }
};
