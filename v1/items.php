<?php

	// If a user ID is set
	if ($_REQUEST['id']) {
	
		// TODO: Verify that the id is valid
	
		// If a new value was passed
		if ($_REQUEST['add']) {
		
			// Try to make the input data safe
			$safe = preg_replace('/[^0-9\+\-\*\/\(\)\.]/', '', $_REQUEST['add']);
		
			// Calculate the value ** WARNING: EVAL **
			$value = eval('return ' . $safe . ';');
			
			// If it's not zero
			if ($value != 0) {
			
				// Read the users current day data
				$data = @json_decode(file_get_contents('data/' . (INT)$_REQUEST['id'] . '.json'));
			
				// Add to the data
				$data[] = array(
					'time' => date('g:ia'),
					'count' => intval($value)
				);
			
				// Write the data
				file_put_contents('data/' . (INT)$_REQUEST['id'] . '.json', json_encode($data));
			
				// Return the data
				echo json_encode($data);
			
			}
		
		} else {
		
			// Read the users current day data
			$data = @file_get_contents('data/' . (INT)$_REQUEST['id'] . '.json');
		
			// Return the json data
			echo $data;
		
		}
	
	}

?>
