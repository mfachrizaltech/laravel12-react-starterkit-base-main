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
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->integer('parent_id')->nullable();
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('icon_id')->nullable();
            $table->string('url');
            $table->integer('order_number');
            $table->boolean('is_active')->default(true);
            $table->integer('version')->default(1);
            $table->auditable();
            $table->softDeletes();
            $table->timestamps();
        });

        DB::unprepared('
            CREATE TRIGGER `before_update_menus` BEFORE UPDATE ON `menus`
            FOR EACH ROW SET NEW.version = OLD.version + 1;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
