<?php
namespace App\Helpers;

class DateUtil {

	public static function dateFormatDB($strDate) {
		$date = explode('/', $strDate);
		return $date[2] . '-' . $date[0] . '-' . $date[1];
	}

	public static function dateTimeFormatDB($strDateTime) {
		if ($strDateTime!=null) {
			$data = explode(' ', $strDateTime);
			$date = explode('/', $data[0]);
			$strTime = $data[1];
			$dateStr = $date[2] . '-' . $date[1] . '-' . $date[0];
			$myTime = strtotime($dateStr.' '.$strTime);
			return date("Y-m-d H:i:s", $myTime);		
		} else {
			return null;
		}
	}
	
	public static function dateTimeFormatD1($strDate, $strTime) {
		$myTime = strtotime($strDate.' '.$strTime);
		return date("Y-m-d H:i:s", $myTime);	
	}
	
	function dateTimeFormat($strDate) {
		$myTime = strtotime($strDate);
		return date("m/d/Y h:i A", $myTime);
	}	
}
