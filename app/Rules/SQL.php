<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Database\QueryException;

use DB;

class SQL implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $reserveWord = ['INSERT','UPDATE', 'DELETE', 'ALTER', 'DROP', 'TRUNCATE'];
        $value = strtolower($value); 
        foreach ($reserveWord as $e) {
			if (strpos($value, $e) === 0) {
				return false;
			}
        } 

        $regex = '~(:\w+)~'; 
        preg_match_all($regex, $value, $matches, PREG_PATTERN_ORDER);
        // $strArray = count_chars($value, 1);
        // $size = 0;
        // foreach ($strArray as $key=>$val) {
        //     if (chr($key)=='?') {
        //         $size=$val;
        //     }   
        // }
        $ar = [];
        
        foreach($matches[0] as $key) {
            $key = str_replace(':', '', $key); 
            
            $ar += [$key=>null];
        } 
        // // $ar = array();
        // $ar = array_fill(0, $size, 0); 
        try {
            DB::select($value, $ar); 
        } catch (QueryException $e) {
            return false;
        }		

        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Invalid SQL statement';
    }

    public function __toString()
    {
        return 'sql';
    }    
}
