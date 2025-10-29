<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use DB;
use Illuminate\Support\Carbon;

class RolesSeeder extends Seeder
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
            DB::statement('ALTER TABLE roles DISABLE TRIGGER ALL;');
        }

        // Truncate the table
        DB::table('roles')->truncate();

        // Re-enable foreign key checks
        $driver = DB::getDriverName();
        if ($driver === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE roles ENABLE TRIGGER ALL;');
        }

        $now = Carbon::now();
 
        DB::table('roles')->insert([
            [
                'name'            => 'superuser',
                'label'           => 'superuser',
                'description'     => 'Super User',
                'is_active'       => true,
                'guard_name'      => 'web',
                'updated_by'      => 'SYSTEM',
                'created_by'      => 'SYSTEM',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],            
            [
                'name'            => 'admin',
                'label'           => 'admin',
                'description'     => 'Admin',
                'is_active'       => true,
                'guard_name'      => 'web',
                'updated_by'      => 'SYSTEM',
                'created_by'      => 'SYSTEM',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            [
                'name'            => 'member',
                'label'           => 'member',
                'description'     => 'Member',
                'is_active'       => true,
                'guard_name'      => 'web',
                'updated_by'      => 'SYSTEM',
                'created_by'      => 'SYSTEM',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
        ]);
    }
}
