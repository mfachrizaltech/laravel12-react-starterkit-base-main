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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('descriptions');
            $table->decimal('price', 10, 2);
            $table->boolean('is_active')->default(true);
            $table->integer('version')->default(1);
            $table->auditable();
            $table->softDeletes();
            $table->timestamps();
        });

        DB::unprepared('
            CREATE TRIGGER `before_update_products` BEFORE UPDATE ON `products`
            FOR EACH ROW SET NEW.version = OLD.version + 1;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
