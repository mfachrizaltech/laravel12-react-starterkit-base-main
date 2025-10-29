<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\PermissionRequest;
use App\Services\PermissionService;
use Illuminate\Support\Str;
use Inertia\Inertia; 
use App\Helpers\CodeHelper;

class PermissionController extends Controller
{

    public function __construct(protected PermissionService $permissionService) 
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $request->all();
        $permissions = $this->permissionService->search($data);
        
        return Inertia::render('permissions/Index', [
            'filters' => $request->only('filters'),  
            'permissions' => $permissions, 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permissionRequest = new PermissionRequest();
        $rules = $permissionRequest->rules();
        $moduleOptions = CodeHelper::getCodeData('MODULE_NAME');
        return Inertia::render('permissions/Create', [
            'rules' => $rules,
            'moduleOptions' => $moduleOptions
        ]);
    }
    
    /**
     * Store a newly created resource in storage.
     */
    public function store(PermissionRequest $request)
    {
        try {   
            $validatedData = $request->validated(); 
            $permission = $this->permissionService->create($validatedData);
            return redirect()->route('permissions.index')->with('success', __('label.created_successfully'));     

        } catch (\Exception $e) {  
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));
    }
 

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $permissionRequest = new PermissionRequest();
        $rules = $permissionRequest->rules();
        $moduleOptions = CodeHelper::getCodeData('MODULE_NAME');
        $permission = $this->permissionService->get($id);
        return Inertia::render('permissions/Edit', [
            'rules' => $rules,
            'permission' => $permission,
            'moduleOptions' => $moduleOptions
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(int $id, PermissionRequest $request)
    {
        try {   
            $validatedData = $request->validated(); 
            $permission = $this->permissionService->update($id, $validatedData);
            return redirect()->route('permissions.index')->with('success', __('label.update_successfully'));     
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
            $this->permissionService->delete($id);
            return redirect()->back()->with('success', __('label.deleted_successfully'));          
        } catch (\Exception $e) {  
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));        
    }    
}
