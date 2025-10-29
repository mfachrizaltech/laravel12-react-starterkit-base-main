<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule; 
use Inertia\Inertia;    
use App\Http\Requests\CustomerRequest;
use Illuminate\Http\JsonResponse;

use App\Models\Customer;

class DashboardController extends Controller
{
 
    /**
     * Display a listing of the resource.
     */
    public function index()
    { 
        return Inertia::render('dashboard');
    }
 
}
