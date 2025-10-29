<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends BaseModel
{
    protected $fillable = [
        'parent_id',
        'name',
        'description',
        'icon_id',
        'url',
        'order_number',
        'is_active',
    ];  

    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id')
            ->orderBy('order_number', 'asc')
            ->with('children');
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

}
