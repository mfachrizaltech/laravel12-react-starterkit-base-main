<?php

namespace App\Helpers;

use App\Repositories\CodeRepository;
use App\Models\Code;

class CodeHelper
{
    public static function getCodeData($codeGroup, ?string $code = null, ?string $tag1 = null)
    {
        $repo = app(CodeRepository::class);
        $collection = $repo->getCodeData($codeGroup, $code, $tag1);

        // ensure we have a Collection
        if (! $collection instanceof \Illuminate\Support\Collection) {
            $collection = collect($collection);
        }

        return $collection
            ->map(function ($item) {
                return self::mapCode($item);
            })
            ->values();
    }

    // keep protected if you prefer encapsulation — closure above will call it fine
    protected static function mapCode($item): array
    {
        if ($item instanceof Code) {
            return [
                'label' => $item->value1,
                'value' => $item->code,
            ];
        }

        if (is_array($item)) {
            return [
                'label' => $item['value1'] ?? $item['label'] ?? null,
                'value' => $item['code'] ?? $item['value'] ?? null,
            ];
        }

        // fallback for generic objects
        return [
            'label' => $item->value1 ?? $item->label ?? null,
            'value' => $item->code ?? $item->value ?? null,
        ];
    }
}
