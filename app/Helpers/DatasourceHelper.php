<?php

namespace App\Helpers;
use App\Repositories\CodeRepository;
use App\Helpers\CodeHelper;

use DB;

class DatasourceHelper {

    public static function getDataSource($code, array $attribute = []) 
    {  
        $repo = app(CodeRepository::class);
        $c = $repo->getCodeData("DATASOURCE", $code)->first(); 
        if (!$c) {
            return []; // return empty array if not found
        } 
        if ($c->tag1 === "CODE") {
            return CodeHelper::getCodeData($code)->toArray();
        } elseif ($c->tag1 === "QUERY") {
            return self::getQueryData($c->value2, $attribute) ?? [];
        } elseif ($c->tag1 === "FUNCTION") {
            return []; // later can be replaced with getFunctionData
        }

        return []; // fallback if tag1 is unknown
    }

    public static function getQueryData(string $query, array $attribute = []): array
    {
        $rows = DB::select($query, $attribute);

        return collect($rows)->map(function ($item) {
            return self::mapCode($item);
        })->toArray();
    } 

    protected static function mapCode($item): array
    {
        if ($item instanceof Code) {
            return [
                'label' => $item->label,
                'value' => $item->value,
            ];
        }

        if (is_array($item)) {
            return [
                'label' => $item['label'] ?? $item['label'] ?? null,
                'value' => $item['value'] ?? $item['value'] ?? null,
            ];
        }

        // fallback for stdClass or other objects
        return [
            'label' => $item->label ?? $item->label ?? null,
            'value' => $item->value ?? $item->value ?? null,
        ];
    }

    public static function getMultipleDatasource($parameters): array
    {
        return collect($parameters ?? [])->mapWithKeys(function ($param) {
            $key = $param->datasource ?? null;

            if ($key && !empty($param->datasource)) {
                return [
                    $key => self::getDataSource($param->datasource),
                ];
            } 
            // skip if no field_code or no datasource
            return [];
        })->toArray();
    }


}


