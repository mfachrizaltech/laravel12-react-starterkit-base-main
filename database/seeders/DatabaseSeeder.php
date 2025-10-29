<?php

namespace Database\Seeders;
use DB;
use Illuminate\Support\Carbon;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RolesSeeder::class);
        $this->call(MenusSeeder::class);
        $this->call(CodesSeeder::class);
        $this->call(SuperuserSeeder::class); 
        $this->call(SuperuserMenuRoleSeeder::class);
  
    }
}
