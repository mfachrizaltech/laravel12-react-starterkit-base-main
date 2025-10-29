<?php
namespace App\Http\Controllers;

use App\Models\Role;
use Inertia\Inertia;
use App\Models\Permission;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Requests\RoleRequest; 
use App\Services\RoleService;
use App\Services\PermissionService; 
use App\Services\MenuService; 

class RoleController extends Controller
{

    public function __construct(protected RoleService $roleService, 
                                protected PermissionService $permissionService, 
                                protected MenuService $menuService) 
    {

    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $request->all(); 
        $roles = $this->roleService->search($data); 
        return Inertia::render('roles/Index', [
                                'roles' => $roles, 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roleRequest = new RoleRequest();
        $rules = $roleRequest->rules(); 
        return Inertia::render('roles/Create', [
            'rules' => $rules
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
        try {
            $validatedData = $request->validated(); 
            $product = $this->roleService->create($validatedData);
            return redirect()->route('roles.index')->with('success', __('label.update_successfully'));     
        } catch (\Exception $e) {  
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));
    }    


    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        $roleRequest = new RoleRequest();
        $rules = $roleRequest->rules(); 
        $role = $this->roleService->get($id);
        return Inertia::render('roles/Edit', [
            'rules' => $rules,
            'role' => $role
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(int $id, RoleRequest $request)
    {
        try {
            $validatedData = $request->validated(); 
            $product = $this->roleService->update($id, $validatedData);
            return redirect()->route('roles.index')->with('success', __('label.update_successfully'));     
        } catch (\Exception $e) { 
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));
    }    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        try {
            $this->roleService->delete($id);
            return redirect()->route('roles.index')->with('success', __('label.deleted_successfully'));     
        } catch (\Exception $e) {      
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));        
    }

    /**
     * Display the specified resource.
     */
    public function menus(int $id)
    {
        $role = $this->roleService->get($id);
        $menus = $this->menuService->getActiveMenu();
        return Inertia::render('roles/Menu', [
            'role' => $role,
            'menus' => $menus
        ]); 
    }    

    public function updateMenus(Request $request, Role $role)
    {
        try {
            $validated = $request->validate([
                'menu_ids' => 'array',
                'menu_ids.*' => 'exists:menus,id',
            ]);
            $this->roleService->assignMenus($role, $validated['menu_ids']);
            return back()->with('success', __('label.update_successfully'));
        } catch (\Exception $e) {      
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));         
    }


    public function permissions(int $id)
    {
        $role = $this->roleService->get($id);
        $permissions = $this->permissionService->getPermissionByGroup();
        return Inertia::render('roles/Permission', [
            'role' => $role,
            'permissions' => $permissions
        ]); 
    }    
 

    public function updatePermissions(Request $request, Role $role)
    {
        try {
            $validated = $request->validate([
                'permission_ids' => 'array',
                'permission_ids.*' => 'exists:permissions,id',
            ]);
            $this->roleService->assignPermissions($role, $validated['permission_ids']);
            return back()->with('success', __('label.update_successfully'));    
        } catch (\Exception $e) {      
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));         
    }

            
}
