<?php

namespace App\Repositories;

class ProductRepository extends BaseRepository
{
    public function __construct(\App\Models\Product $model)
    {
        parent::__construct($model);
    }
}
