<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Role;
use App\Models\Menu;

class SuperuserMenuRoleSeeder extends Seeder
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
            DB::statement('ALTER TABLE menu_role DISABLE TRIGGER ALL;');
        }

        // Truncate the table
        DB::table('menu_role')->truncate();

        // Re-enable foreign key checks
        $driver = DB::getDriverName();
        if ($driver === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE roles ENABLE TRIGGER ALL;');
        }
                
        // Find the "superuser" role
        $role = Role::where('name', 'superuser')->first();

        if (!$role) {
            $this->command->warn('❌ Role "superuser" not found. Skipping.');
            return;
        }

        // Get all menus
        $menus = Menu::all();

        if ($menus->isEmpty()) {
            $this->command->warn('No menus found. Skipping.');
            return;
        }

        // Prepare menu_role pivot data
        $data = $menus->map(fn($menu) => [
            'role_id' => $role->id,
            'menu_id' => $menu->id,
        ])->toArray();

        // Clear existing entries for that role (optional)
        DB::table('menu_role')->where('role_id', $role->id)->delete();

        // Insert new ones
        DB::table('menu_role')->insert($data);

        $this->command->info('✅ Assigned all menus to the "superuser" role successfully.');
    }
}
