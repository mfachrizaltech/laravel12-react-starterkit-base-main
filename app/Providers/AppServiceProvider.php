<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission; 
use App\Models\BaseModel; 
use App\Observers\GlobalActivityLogger; 
use Illuminate\Support\Facades\Validator;
use App\Rules\SQL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        User::observe(GlobalActivityLogger::class);
        Role::observe(GlobalActivityLogger::class);
        Permission::observe(GlobalActivityLogger::class);  
        
        Validator::extend('sql', function ($attribute, $value, $parameters, $validator) {
            return (new SQL())->passes($attribute, $value);
        });

        Validator::replacer('sql', function ($message, $attribute, $rule, $parameters) {
            return (new SQL())->message();
        });        
    }
}
