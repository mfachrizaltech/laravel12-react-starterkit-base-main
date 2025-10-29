<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request; 
use Inertia\Inertia;
use App\Services\UserService;
use App\Http\Requests\UserRequest; 
use App\Models\Role;
use App\Models\User;

class UserController extends Controller
{
    public function __construct(protected UserService $userService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $keyword = $request->input('search');
							
		return Inertia::render('users/Index', [
			'users' => $this->userService->search($keyword),  
			'filters' => $request->only('search'),  
		]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $userRequest = new UserRequest();
        $rules = $userRequest->rules();
        $roles = Role::query()->get();
        return Inertia::render('users/Create', ['rules' => $rules, 'roles' => $roles]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        try { 
            $data = $request->all();
            $user = $this->userService->createUser($data);    
            return redirect()->route('users.index')->with('success', __('label.created_successfully'));     

        } catch (\Exception $e) { 
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $user = $this->userService->get($id);  
        $userRequest = new UserRequest();
        $rules = $userRequest->rules();
        return Inertia::render('users/Edit', [
            'user' => $user,
            'roles' => Role::select('id', 'name', 'label')->get(),
            'userRoles' => $user->roles->isNotEmpty() ? $user->roles : [], // from HasRoles
            'rules' => $rules, // optional
        ]);
    }

    /**
     * Update the specified resource in storage.
     */ 
    public function update(UserRequest $request, $id)
    { 
        try {   
            $data = $request->all();
            $user = $this->userService->updateUser($id, $data);     
            return redirect()->route('users.index')->with('success', __('label.update_successfully'));       
        } catch (\Exception $e) {  
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {   
            $this->userService->deleteUser($id);
            return redirect()->back()->with('success', __('label.deleted_successfully'));          
        } catch (\Exception $e) { 
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));
    }
}
