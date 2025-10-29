<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule; 
use Inertia\Inertia;  
 
use App\Http\Requests\CustomerRequest;
use Illuminate\Http\JsonResponse;
 
class MainController extends Controller
{

    public function __construct() 
    {

    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    { 
        return Inertia::render('main');
    }
 
}
