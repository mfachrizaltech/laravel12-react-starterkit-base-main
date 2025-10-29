<?php

namespace App\Helpers;

use App\Repositories\CodeRepository;
use App\Models\Code;

class QueryHelper {
  
    public static function doFilter($filters, $query)
    {
        foreach ($filters as $field => $filter) {
            $value = $filter['value'] ?? null;
            $matchMode = $filter['matchMode'] ?? 'equals';

            if ($value === null || $value === '') {
                continue;
            }

            // Handle nested relations using dot notation
            if (str_contains($field, '.')) {
                $parts = explode('.', $field);
                $relation = array_shift($parts); // e.g., "order"
                $nestedField = implode('.', $parts); // e.g., "customer_name" or deeper nesting

                $query->whereHas($relation, function ($q) use ($nestedField, $value, $matchMode) {
                    // Recursive call if deeper relation
                    if (str_contains($nestedField, '.')) {
                        // apply filter again recursively
                        self::doFilter([
                            $nestedField => [
                                'value' => $value,
                                'matchMode' => $matchMode
                            ]
                        ], $q);
                    } else {
                        // Apply direct filter
                        switch ($matchMode) {
                            case 'equals':
                                $q->where($nestedField, $value);
                                break;

                            case 'notEquals':
                                $q->where($nestedField, '!=', $value);
                                break;

                            case 'contains':
                                $q->where($nestedField, 'like', "%{$value}%");
                                break;

                            case 'notContains':
                                $q->where($nestedField, 'not like', "%{$value}%");
                                break;

                            case 'startsWith':
                                $q->where($nestedField, 'like', "{$value}%");
                                break;

                            case 'endsWith':
                                $q->where($nestedField, 'like', "%{$value}");
                                break;

                            case 'lt':
                                $q->where($nestedField, '<', $value);
                                break;

                            case 'lte':
                                $q->where($nestedField, '<=', $value);
                                break;

                            case 'gt':
                                $q->where($nestedField, '>', $value);
                                break;

                            case 'gte':
                                $q->where($nestedField, '>=', $value);
                                break;

                            case 'in':
                                $q->whereIn($nestedField, (array) $value);
                                break;

                            case 'between':
                                if (is_array($value) && count($value) === 2) {
                                    $q->whereBetween($nestedField, $value);
                                }
                                break;

                            case 'dateIs':
                                $q->whereDate($nestedField, '=', $value);
                                break;

                            case 'dateIsNot':
                                $q->whereDate($nestedField, '!=', $value);
                                break;

                            case 'dateBefore':
                                $q->whereDate($nestedField, '<', $value);
                                break;

                            case 'dateAfter':
                                $q->whereDate($nestedField, '>', $value);
                                break;

                            default:
                                $q->where($nestedField, $value);
                                break;
                        }
                    }
                });

                continue;
            }

            // Regular (non-nested) field
            switch ($matchMode) {
                case 'equals':
                    $query->where($field, $value);
                    break;

                case 'notEquals':
                    $query->where($field, '!=', $value);
                    break;

                case 'contains':
                    $query->where($field, 'like', "%{$value}%");
                    break;

                case 'notContains':
                    $query->where($field, 'not like', "%{$value}%");
                    break;

                case 'startsWith':
                    $query->where($field, 'like', "{$value}%");
                    break;

                case 'endsWith':
                    $query->where($field, 'like', "%{$value}");
                    break;

                case 'lt':
                    $query->where($field, '<', $value);
                    break;

                case 'lte':
                    $query->where($field, '<=', $value);
                    break;

                case 'gt':
                    $query->where($field, '>', $value);
                    break;

                case 'gte':
                    $query->where($field, '>=', $value);
                    break;

                case 'in':
                    $query->whereIn($field, (array) $value);
                    break;

                case 'between':
                    if (is_array($value) && count($value) === 2) {
                        $query->whereBetween($field, $value);
                    }
                    break;

                case 'dateIs':
                    $query->whereDate($field, '=', $value);
                    break;

                case 'dateIsNot':
                    $query->whereDate($field, '!=', $value);
                    break;

                case 'dateBefore':
                    $query->whereDate($field, '<', $value);
                    break;

                case 'dateAfter':
                    $query->whereDate($field, '>', $value);
                    break;

                default:
                    $query->where($field, $value);
            }
        }

        return $query;
    }

}


