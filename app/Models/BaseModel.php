<?php

namespace App\Models;  

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Yajra\Auditable\AuditableTrait;
use App\Observers\GlobalActivityLogger;

class BaseModel extends Model
{ 
    use SoftDeletes, AuditableTrait;

    protected $dates = ['deleted_at'];

	protected $timestamp=true;

    protected static function booted()
    {
        static::observe(GlobalActivityLogger::class);
    }
}