<?php

namespace App\Services;

use App\Repositories\ProductRepository;

class ProductService extends BaseService
{
    public function __construct(ProductRepository $repository)
    {
        parent::__construct($repository);
    }
}
