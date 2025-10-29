<?php

    namespace App\Models;

    use App\Models\BaseModel;

    class Product extends BaseModel
    {
        protected $fillable = ['name', 'descriptions', 'price', 'is_active'];
    }
    