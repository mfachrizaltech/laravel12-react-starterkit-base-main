<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response; 
use App\Services\InventoryService; 
use Illuminate\Support\Facades\Auth;
use App\Models\UserPrinter;

class SettingPrinterController extends Controller
{

    public function __construct(protected InventoryService $inventoryService) {}

    /**
     * Show the user's password settings page.
     */
    public function edit(): Response
    {
        $printerOptions = $this->inventoryService->getPrinter();
        $printerId = Auth::user()->printers()->first()?->id;  
            \Log::info('Selected printer ID for user: ' . Auth::id(), [
        'printer_id' => $printerId,
        'user_id' => Auth::id(),
    ]);
        return Inertia::render('settings/printer',
                                ['selected_printer_id' => $printerId,
                                'printerOptions' => $printerOptions]);
    }

    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    { 
        $validated = $request->validate([
            'printer_id' => ['required'],
        ]); 
        $user = Auth::user();
        $user->printers()->sync([$validated['printer_id']]);

        // return redirect()
        //     ->route('setting-printer.edit')
        //     ->with('success', 'Printer setting updated successfully!');

        return to_route('setting-printer.edit');    
    }
}
