<?php

namespace App\Repositories;
 
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class UserRepository extends BaseRepository
{ 
    public function __construct(User $model)
    {
        $this->model = $model;
    }
 
    public function searchByKeyword(?string $keyword = null)
    {
        $query = $this->model->newQuery()->with('roles');

        if ($keyword) {
            $query->where(function (Builder $q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->orWhere('email', 'like', "%{$keyword}%");
            });
        }

        return $query->orderBy('id', 'desc')
                     ->paginate(config('app.pagination', 10))
                     ->appends(['search' => $keyword]);
    }

    public function getAllByRoles(array $roles)
    {
        return $this->model->newQuery()
            ->whereHas('roles', function (Builder $query) use ($roles) {
                $query->whereIn('name', $roles);
            })
            ->get();
    }
 
}
