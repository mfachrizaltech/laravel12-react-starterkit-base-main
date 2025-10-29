<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Models\Report;
use App\Helpers\QueryHelper;

class BaseRepository
{
    protected Model $model;

    protected array $with = [];

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function with(array $relations): static
    {
        $this->with = $relations;
        return $this;
    }

    public function all()
    {
        return $this->model->all();
    }

    public function search($data)
    {
        $query = $this->model->newQuery()->with($this->with);
        $filters = $data['filters'] ?? [];
        $query = QueryHelper::doFilter($filters, $query);

        return $query->orderBy('id', 'asc')
                     ->paginate(config('app.pagination', 10));
    }

    public function get(int $id)
    {
        return $this->model->newQuery()->with($this->with)->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data)
    {
        $obj = $this->model->newQuery()->findOrFail($id);
        $obj->update($data);
        return $obj;
    }

    public function delete(int $id)
    {
        $obj = $this->model->newQuery()->findOrFail($id);
        return $obj->delete();
    }
}