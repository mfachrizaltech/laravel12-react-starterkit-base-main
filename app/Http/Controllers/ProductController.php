<?php

    namespace App\Http\Controllers;

    use App\Http\Requests\ProductRequest;
    use App\Services\ProductService;
    use Illuminate\Http\Request;
    use Inertia\Inertia;

    class ProductController extends Controller
    {
        public function __construct(protected ProductService $productService)
        {
        }

        /**
         * Display a listing of the resource.
         */
        public function index(Request $request)
        {
            $data = $request->all();
            $items = $this->productService->search($data);
            return Inertia::render('products/Index', [
                'products' => $items,
            ]);
        }

        /**
         * Show the form for creating a new resource.
         */
        public function create()
        {
            $request = new ProductRequest();
            $rules = $request->rules();

            return Inertia::render('products/Create', [
                'rules' => $rules,
            ]);
        }

        /**
         * Store a newly created resource in storage.
         */
        public function store(ProductRequest $request)
        {
            try {
                $validated = $request->validated();
                $this->productService->create($validated);
                return redirect()->route('products.index')->with('success', __('label.update_successfully'));
            } catch (\Exception $e) {
                return redirect()->back()->with('error', __('label.error_message'));
            }
        }

        /**
         * Display the specified resource.
         */
        public function show(int $id)
        { 
            $item = $this->productService->get($id);

            return Inertia::render('products/Show', [ 
                'product' => $item
            ]);
        }

        /**
         * Show the form for editing the specified resource.
         */
        public function edit(int $id)
        {
            $request = new ProductRequest();
            $rules = $request->rules();
            $item = $this->productService->get($id);

            return Inertia::render('products/Edit', [
                'rules' => $rules,
                'product' => $item
            ]);
        }

        /**
         * Update the specified resource in storage.
         */
        public function update(int $id, ProductRequest $request)
        {
            try {
                $validated = $request->validated();
                $this->productService->update($id, $validated);
                return redirect()->route('products.index')->with('success', __('label.update_successfully'));
            } catch (\Exception $e) {
                return redirect()->back()->with('error', __('label.error_message'));
            }
        }

        /**
         * Remove the specified resource from storage.
         */
        public function destroy(int $id)
        {
            try {
                $this->productService->delete($id);
                return redirect()->route('products.index')->with('success', __('label.deleted_successfully'));
            } catch (\Exception $e) {
                return redirect()->back()->with('error', __('label.error_message'));
            }
        }
    }
    