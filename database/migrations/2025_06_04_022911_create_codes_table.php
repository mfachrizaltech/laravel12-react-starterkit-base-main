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
        Schema::create('codes', function (Blueprint $table) {
            $table->id();
            $table->string('code_group');
            $table->string('code');
            $table->string('value1');
            $table->string('value2')->nullable();
            $table->string('order_no')->nullable();
            $table->string('tag1')->nullable();
            $table->string('tag2')->nullable();
            $table->string('tag3')->nullable();
            $table->boolean('is_active');
            $table->integer('version')->default(1);
            $table->auditable();
            $table->softDeletes();
            $table->timestamps();
        });

        DB::unprepared('
            CREATE TRIGGER `before_update_codes` BEFORE UPDATE ON `codes`
            FOR EACH ROW SET NEW.version = OLD.version + 1;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('codes'); 
    }
};
