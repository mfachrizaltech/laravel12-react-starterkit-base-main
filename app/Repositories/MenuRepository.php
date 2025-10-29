<?php

namespace App\Repositories;

use App\Models\Menu;
use Illuminate\Support\Facades\DB;

class MenuRepository extends BaseRepository
{  
    protected array $with = ['parent'];

    public function __construct(Menu $model)
    {
        $this->model = $model;
    }

    public function all()
    {
        return $this->model->newQuery()
            ->with('children')
            ->whereNull('parent_id')
            ->orderBy('order_number', 'asc')
            ->get();
    }


    public function getActiveMenu()
    {
        return $this->model->newQuery()
            ->with(['children' => function ($query) {
                $query->where('is_active', true);
            }])
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('order_number', 'asc')
            ->get();
    }    

    public function getActiveMenusByRole(Role $role)
    {
        return $role->menus()
            ->where('is_active', true)
            ->with([
                'children' => fn ($q) => $q->where('is_active', true)
            ])
            ->whereNull('parent_id')
            ->orderBy('order_number')
            ->get();
    }

    public function searchByKeyword(?string $keyword = null)
    {
        $query = $this->model->newQuery()->with('children');

        if (!empty($keyword)) {
            $query->where('name', 'like', "%{$keyword}%");
        }

        return $query->paginate(config('app.pagination', 10));
    }

    public function getLastOrderNumber(?int $parent_id = null): ?int
    {
        return $this->model->newQuery()
            ->when(is_null($parent_id), function ($query) {
                $query->whereNull('parent_id');
            }, function ($query) use ($parent_id) {
                $query->where('parent_id', $parent_id);
            })
            ->orderByDesc('order_number')
            ->value('order_number');
 
    } 

    public function reorder(array $menus)
    {
        foreach ($menus as $menu) {
            Menu::where('id', $menu['id'])->update([
                'order_number' => $menu['order_number']
            ]);
        }
    }    
}
