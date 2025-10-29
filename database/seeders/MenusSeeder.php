<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use DB;
use Illuminate\Support\Carbon;

class MenusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks (optional, but useful if other tables depend on codes)
        $driver = DB::getDriverName();
        if ($driver === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE menus DISABLE TRIGGER ALL;');
        }

        // Truncate the table
        DB::table('menus')->truncate();

        // Re-enable foreign key checks
        $driver = DB::getDriverName();
        if ($driver === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE menus ENABLE TRIGGER ALL;');
        }
          
        $now = Carbon::now();   
        DB::table('menus')->insert([
            [
                'parent_id'    => null,  
                'name'         => 'Dashboard',
                'description'  => 'Dashboard',
                'icon_id'      => 'LayoutDashboard',
                'url'          => '/dashboard',
                'order_number' => 1,
                'is_active'    => true,
                'updated_by'   => 'SYSTEM',
                'created_by'   => 'SYSTEM',
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
            [
                'parent_id'    => null, 
                'name'         => 'Admin',
                'description'  => 'Admin',
                'icon_id'      => 'UserCog',
                'url'          => '/admin',
                'order_number' => 2,
                'is_active'    => true,
                'updated_by'   => 'SYSTEM',
                'created_by'   => 'SYSTEM',
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
            [
                'parent_id'    => 2, 
                'name'         => 'User Maintenance',
                'description'  => 'User Maintenance',
                'icon_id'      => 'Users',
                'url'          => '/users',
                'order_number' => 1,
                'is_active'    => true,
                'updated_by'   => 'SYSTEM',
                'created_by'   => 'SYSTEM',
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
            [
                'parent_id'    => 2, 
                'name'         => 'Roles',
                'description'  => 'Roles',
                'icon_id'      => 'Shield',
                'url'          => '/roles',
                'order_number' => 2,
                'is_active'    => true,
                'updated_by'   => 'SYSTEM',
                'created_by'   => 'SYSTEM',
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
            [
                'parent_id'    => 2, 
                'name'         => 'Permissions',
                'description'  => 'Permissions',
                'icon_id'      => 'Lock',
                'url'          => '/permissions',
                'order_number' => 3,
                'is_active'    => true,
                'updated_by'   => 'SYSTEM',
                'created_by'   => 'SYSTEM',
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
            [
                'parent_id'    => 2, 
                'name'         => 'Menus',
                'description'  => 'Menus',
                'icon_id'      => 'MenuIcon',
                'url'          => '/menus',
                'order_number' => 4,
                'is_active'    => true,
                'updated_by'   => 'SYSTEM',
                'created_by'   => 'SYSTEM',
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
            [
                'parent_id'    => 2, 
                'name'         => 'Codes',
                'description'  => 'Codes',
                'icon_id'      => 'code',
                'url'          => '/codes',
                'order_number' => 5,
                'is_active'    => true,
                'updated_by'   => 'SYSTEM',
                'created_by'   => 'SYSTEM',
                'created_at'   => $now,
                'updated_at'   => $now,
            ],    
            [
                'parent_id'    => null, 
                'name'         => 'Report',
                'description'  => 'Report',
                'icon_id'      => 'NotebookText',
                'url'          => '/report',
                'order_number' => 3,
                'is_active'    => true,
                'updated_by'   => 'SYSTEM',
                'created_by'   => 'SYSTEM',
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
            [
                'parent_id'    => 8, 
                'name'         => 'Maintenance',
                'description'  => 'Maintenance',
                'icon_id'      => 'NotebookText',
                'url'          => '/reports/maintenance',
                'order_number' => 1,
                'is_active'    => true,
                'updated_by'   => 'SYSTEM',
                'created_by'   => 'SYSTEM',
                'created_at'   => $now,
                'updated_at'   => $now,
            ],
            [
                'parent_id'    => 8, 
                'name'         => 'Generate',
                'description'  => 'Generate',
                'icon_id'      => 'NotebookText',
                'url'          => '/reports/generate',
                'order_number' => 2,
                'is_active'    => true,
                'updated_by'   => 'SYSTEM',
                'created_by'   => 'SYSTEM',
                'created_at'   => $now,
                'updated_at'   => $now,
            ],                     

            [
                'parent_id'    => null, 
                'name'         => 'Products',
                'description'  => 'Products',
                'icon_id'      => 'PackageOpenIcon',
                'url'          => '/products',
                'order_number' => 4,
                'is_active'    => true,
                'updated_by'   => 'SYSTEM',
                'created_by'   => 'SYSTEM',
                'created_at'   => $now,
                'updated_at'   => $now,
            ],

        ]);
    }
}
