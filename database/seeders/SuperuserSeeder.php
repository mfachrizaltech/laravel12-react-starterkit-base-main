<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use DB;
use App\Models\User;
use Illuminate\Support\Carbon;

class SuperuserSeeder extends Seeder
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
            DB::statement('ALTER TABLE users DISABLE TRIGGER ALL;');
        }

        // Truncate the table
        DB::table('users')->truncate();

        // Re-enable foreign key checks
        $driver = DB::getDriverName();
        if ($driver === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE users ENABLE TRIGGER ALL;');
        }
  
  
        $user = User::factory()->create([
            'name' => 'superuser',
            'email' => 'superuser@demo.com',
            'password' => '12345678',
        ]);

        $user->assignRole('superuser');
    }
}
