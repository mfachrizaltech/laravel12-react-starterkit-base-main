<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule; 
use Inertia\Inertia;   
use App\Services\MenuService;
use App\Http\Requests\MenuRequest; 
use App\Helpers\CodeHelper;  

class MenuController extends Controller
{

    public function __construct(protected MenuService $menuService) 
    {

    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    { 
        $data = $request->all();
        $menus = $this->menuService->getAll($data);  
        return Inertia::render('menus/Index', [
            'menus' => $menus,     
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $menuRequest = new MenuRequest();
        $rules = $menuRequest->rules(); 
        return Inertia::render('menus/Create', 
                                ['rules' => $rules]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MenuRequest $request)
    {
        try {
            $validatedData = $request->validated(); 
            $order = $this->menuService->create($validatedData);

            return redirect()->route('menus.index')->with('success', __('label.created_successfully'));     

        } catch (\Exception $e) {   
            dd($e);  
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));
    }
 

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $menuRequest = new MenuRequest();
        $rules = $menuRequest->rules();
        $menu = $this->menuService->get($id); 
        return Inertia::render('menus/Edit', 
                                ['rules' => $rules,
                                 'menu' => $menu]); 
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(int $id, MenuRequest $request)
    {
        try {
            $validatedData = $request->validated(); 
            $product = $this->menuService->update($id, $validatedData);
            return redirect()->route('menus.index')->with('success', __('label.update_successfully'));     

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
            $customer = $this->menuService->delete($id);

            return redirect()->route('menus.index')->with('success', __('label.deleted_successfully'));     

        } catch (\Exception $e) {      
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));        
    }
 
    public function search(Request $request)
    {         
        $query = $request->get('query', '');
        $customers = $this->menuService->search($query);  
 
        return response()->json($customers);
    }    


    public function reorder(Request $request)
    {
        $this->menuService->reorder($request->menus);  
        $message = __('label.update_successfully');
        return back()->with('success', $message);     
    }

      
}
