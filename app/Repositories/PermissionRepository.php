<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use App\Helpers\QueryHelper;
use App\Models\Permission;

class PermissionRepository extends BaseRepository
{

    public function __construct(Permission $model)
    {
        $this->model = $model;
    }
   
    public function getPermissionByGroup()
    {
        return $this->model->newQuery()->get()->groupBy('module');
    }

    public function create(array $data): Permission
    {
        return $this->model->newQuery()->create([
            'module'      => $data['module'],
            'label'       => $this->humanizeRouteName($data['name']),
            'name'        => $data['name'],
            'description' => $data['description'],
            'is_active'   => $data['is_active'],
        ]);
    }

    public function update(int $id, array $data): Permission
    {
        $record = $this->model->newQuery()->findOrFail($id);

        $record->update([
            'module'      => $data['module'],
            'label'       => $this->humanizeRouteName($data['name']),
            'name'        => $data['name'],
            'description' => $data['description'],
            'is_active'   => $data['is_active'],
        ]);

        return $record->fresh();
    } 

    private function humanizeRouteName(string $route): string
    {
        return ucwords(str_replace('.', ' ', $route));
    }
}
