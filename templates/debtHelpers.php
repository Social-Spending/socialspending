<?php

/*
Modifies the debt between users by adding $amount to their debt
	Params
		$creditor_id - The unique identifier for the user who paid for others
		$debtor_id - The unique identifier for the user who borrowed money
		$amount - the amount the debtor owes the creditor. This will be added to existing debts
*/
function addDebt($creditor_id, $debtor_id, $amount) {
	
	global $mysqli;



	/*
	Adds creditor->debtor relationship to table

	If it already exists, it updates the existing amount with
	the amount being added by this new transaction
	*/
	$sql = "INSERT INTO debts
						(creditor, debtor, 	amount)
			VALUES		(?, ?, ?)
			ON DUPLICATE KEY 
			UPDATE 		amount = amount + VALUES(amount)";

	$response = $mysqli->execute_query($sql, [$creditor_id, $debtor_id, $amount]);

	return boolval($response);
}
?>
