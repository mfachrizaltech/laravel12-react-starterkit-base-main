<?php

namespace App\Repositories;

use App\Models\Code;
use Illuminate\Support\Facades\Cache;
use DB;
use App\Helpers\QueryHelper;

class CodeRepository extends BaseRepository
{
    public function __construct(Code $model)
    {
        $this->model = $model;
    }
  
    public function getCodeData(string $codeGroup, ?string $code = null, ?string $tag1 = null)
    {
        $cacheKey = "code_data_{$codeGroup}"
                  . ($code ? "_{$code}" : "")
                  . ($tag1 ? "_{$tag1}" : "");

        return Cache::remember($cacheKey, now()->addHours(2), function () use ($codeGroup, $code, $tag1) {
            $query = Code::where('code_group', $codeGroup)
                ->where('is_active', true);

            if ($code) {
                $query->where('code', $code);
            }

            if ($tag1) {
                $query->where('tag1', $tag1);
            }

            return $query->get(); // returns collection of Code models
        });
    }
 
    public function create(array $data)
    {
        $codeGroup = $data['code_group'];
        $code = $data['code'] ?? null;
        $tag1 = $data['tag1'] ?? null;

        // Clear base group cache
        Cache::forget("code_data_{$codeGroup}");

        // Clear group+code cache
        if ($code) {
            Cache::forget("code_data_{$codeGroup}_{$code}");
        }

        // Clear group+code+tag1 cache
        if ($code && $tag1) {
            Cache::forget("code_data_{$codeGroup}_{$code}_{$tag1}");
        }

        return $this->model->newQuery()->create($data);
    }

    public function update(int $id, array $data)
    {    
      $codeGroup = $data['code_group'];
        $code = $data['code'] ?? null;
        $tag1 = $data['tag1'] ?? null;

        // Clear base group cache
        Cache::forget("code_data_{$codeGroup}");

        // Clear group+code cache
        if ($code) {
            Cache::forget("code_data_{$codeGroup}_{$code}");
        }

        // Clear group+code+tag1 cache
        if ($code && $tag1) {
            Cache::forget("code_data_{$codeGroup}_{$code}_{$tag1}");
        }
        $obj = $this->model->newQuery()->findOrFail($id);
        $obj->update($data);
        return $obj;
    }

    public function delete(int $id)
    {
        $codeGroup = $data['code_group'];
        $code = $data['code'] ?? null;
        $tag1 = $data['tag1'] ?? null;

        // Clear base group cache
        Cache::forget("code_data_{$codeGroup}");

        // Clear group+code cache
        if ($code) {
            Cache::forget("code_data_{$codeGroup}_{$code}");
        }

        // Clear group+code+tag1 cache
        if ($code && $tag1) {
            Cache::forget("code_data_{$codeGroup}_{$code}_{$tag1}");
        }

        $obj = $this->model->newQuery()->findOrFail($id);
        return $obj->delete();
    }

}
