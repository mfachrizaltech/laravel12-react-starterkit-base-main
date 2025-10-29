<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MainController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PermissionController; 
use App\Http\Controllers\RoleController; 
use App\Http\Controllers\MenuController; 
use App\Http\Controllers\CodeController;       
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReportGenerateController;
use App\Http\Controllers\ProductController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::get('/main', [MainController::class, 'index'])->name('main');

Route::middleware(['auth', 'verified', 'check.permission'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy'); 

    Route::resource('permissions', PermissionController::class);
    Route::get('/roles/{role}/menus', [RoleController::class, 'menus'])->name('roles.menus');
    Route::put('/roles/{role}/menus', [RoleController::class, 'updateMenus'])->name('roles.menus-update');

    Route::get('/roles/{role}/permissions', [RoleController::class, 'permissions'])->name('roles.permissions');
    Route::put('/roles/{role}/permissions', [RoleController::class, 'updatePermissions'])->name('roles.permissions-update');
    Route::resource('roles', RoleController::class); 

    Route::get('/menus/search', [MenuController::class, 'search'])->name('menus.search');
    Route::post('/menus/reorder', [MenuController::class, 'reorder'])->name('menus.reorder');
    Route::resource('menus', MenuController::class);
    
    Route::resource('codes', CodeController::class); 

    Route::resource('reports/maintenance', ReportController::class, ['names' => 'reports-maintenance']); 
    Route::get('reports/maintenance/field/{id}/edit', [ReportController::class, 'fieldEdit'])->name('reports-maintenance.field.edit');
    Route::post('reports/maintenance/field/{id}', [ReportController::class, 'fieldUpdate'])->name('reports-maintenance.field.update'); 
    Route::get('reports/maintenance/parameter/{id}/edit', [ReportController::class, 'paramEdit'])->name('reports-maintenance.parameter.edit');
    Route::post('reports/maintenance/parameter/{id}', [ReportController::class, 'paramUpdate'])->name('reports-maintenance.parameter.update');

    Route::get('reports/generate', [ReportGenerateController::class, 'index'])->name('reports-generate.index');
    Route::get('reports/generate/{id}', [ReportGenerateController::class, 'generate'])->name('reports-generate.generate');
    Route::get('reports/generate/download/{id}', [ReportGenerateController::class, 'download'])->name('reports-generate.download');
    Route::get('reports/generate/print/{id}', [ReportGenerateController::class, 'print'])->name('reports-generate.print');

    Route::resource('products', ProductController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
