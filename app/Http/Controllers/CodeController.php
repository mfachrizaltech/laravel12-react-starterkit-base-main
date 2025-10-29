<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\CodeRequest;
use App\Services\CodeService;
use Illuminate\Support\Str;
use Inertia\Inertia;  

class CodeController extends Controller
{

    public function __construct(protected CodeService $codeService) 
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $request->all(); 
        $codes = $this->codeService->search($data); 
        return Inertia::render('codes/Index', [ 
            'codes' => $codes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $codeRequest = new CodeRequest();
        $rules = $codeRequest->rules(); 
        return Inertia::render('codes/Create', [
            'rules' => $rules, 
        ]);
    }
    
    /**
     * Store a newly created resource in storage.
     */
    public function store(CodeRequest $request)
    {
        try {   
            $validatedData = $request->validated(); 
            $code = $this->codeService->create($validatedData); 
            return redirect()->route('codes.index')->with('success', __('label.created_successfully'));     

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
        $codeRequest = new CodeRequest();
        $rules = $codeRequest->rules(); 
        $code = $this->codeService->get($id);
        return Inertia::render('codes/Edit', [
            'rules' => $rules,
            'code' => $code, 
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(int $id, CodeRequest $request)
    {
        try {   
            $validatedData = $request->validated(); 
            $permission = $this->codeService->update($id, $validatedData);

            return redirect()->route('codes.index')->with('success', __('label.update_successfully'));     
        } catch (\Exception $e) {
            dd($e);
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
            $this->codeService->delete($id);
            return redirect()->back()->with('success', __('label.deleted_successfully'));          
        } catch (\Exception $e) {
            return redirect()->back()->with('error', __('label.error_message'));
        }		
        return redirect()->back()->with('error', __('label.error_message'));        
    }    
}
