<?php

/* Function to run after approving a transaction that updates the debt table
    Will attempt to minimize debts for all participants in the transaction
    Returns true if the application was started in the background successfully...
        Otherwise, return false
*/
function runDebtReduction($transaction_id)
{
    $cmd = '../executables/bin/DebtReduction '.$transaction_id;
    $output = null;
    $rv = 0;
    exec($cmd, $output, $rv);
    // program will exit with code 0 on success
    return ($rv == 0);
}

?>
