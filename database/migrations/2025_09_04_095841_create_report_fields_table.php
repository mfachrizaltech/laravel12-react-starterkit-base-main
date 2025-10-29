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
        Schema::create('report_fields', function (Blueprint $table) {
            $table->id();
            $table->integer('report_id')->index();            
            $table->string('label');
            $table->string('field_code');
            $table->string('data_type');
            $table->boolean('hidden'); 
            $table->string('link_form_id')->nullable();
            $table->string('link_param')->nullable();
            $table->string('align'); 
            $table->integer('order_no'); 
            $table->integer('version')->default(1);
            $table->auditable();
            $table->softDeletes();
            $table->timestamps();
        });

        // DB::unprepared('
        //     CREATE TRIGGER `before_report_fields` BEFORE UPDATE ON `report_fields`
        //     FOR EACH ROW SET NEW.version = OLD.version + 1;
        // ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_fields');
    }
};
