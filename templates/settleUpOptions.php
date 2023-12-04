<?php
include_once('templates/connection.php');
include_once('templates/jsonMessage.php');


/*  Function to run that returns debt chains in the network
    Params:
        currUserID is the user_id of the currently logged in user
        creditorUserID is the user_id for the user the current user if trying to settle-up with
    Returns an array of associative arrays of the format:
        [
            {
                "amount" => <integer amount to settle up>,
                "length" => <integer number of users in the chain>,
                "chain" => <ordered numerical array of objects of the form {"user_id" => <integer>, "username" => <string>} in the settle up chain>
            },
            {...}
        ]
        For example, for the debt network:
            creditor, debtor, amount
            4       , 1     , 14
            9       , 4     , 13
        the return value for findDebtChains(1, 4) will look like this:
        [
            {
                "amount" => 14,
                "length" => 1,
                "chain" => [
                    {
                        "user_id" => 4,
                        "username" => "user4"
                    }
                ]
            },
            {
                "amount" => 13,
                "length" => 2,
                "chain" => [
                    {
                        "user_id" => 4,
                        "username" => "user4"
                    },
                    {
                        "user_id" => 9,
                        "username" => "user9"
                    },
                ]
            }
        ]
*/
function findDebtChains($currUserID, $creditorUserID)
{
    global $mysqli;

    // query database for the debts that make up the debt network
    // TODO consider if users have pending transactions that would make the settle-up unfavorable
    $sql =  "SELECT
                d.creditor AS creditor_id,
                creditorUser.username AS creditor_username,
                d.debtor AS debtor_id,
                debtorUser.username AS debtor_username,
                d.amount
            FROM debts d
            INNER JOIN users creditorUser ON creditorUser.user_id = d.creditor
            INNER JOIN users debtorUser ON debtorUser.user_id = d.debtor
            WHERE (
                d.creditor IN (
                    SELECT CASE WHEN user_id_1 = ? THEN user_id_2 ELSE user_id_1 END AS friend_id
                    FROM friendships
                    WHERE user_id_1 = ? OR user_id_2 = ?
                ) AND
                d.debtor IN (
                    SELECT CASE WHEN user_id_1 = ? THEN user_id_2 ELSE user_id_1 END AS friend_id
                    FROM friendships
                    WHERE user_id_1 = ? OR user_id_2 = ?
                )
            ) OR
            d.creditor = ? OR d.debtor = ?;";
	$networkDebtResult = $mysqli->execute_query($sql, [$currUserID, $currUserID, $currUserID, $currUserID, $currUserID, $currUserID, $currUserID, $currUserID]);
    // check that query was successful
    if (!$networkDebtResult)
    {
        // query failed, internal server error
        handleDBError();
    }


    // command to invoke; pass current user's UID and the desired creditor to the program
    $cmd = 'executables/bin/FindDebtChains '.$currUserID.' '.$creditorUserID;
    // description of the pipes that proc_open will create
    // "r" and "w" tell which end of the pipe will get passed to the process
    $descriptorSpec = array(
        0 => array("pipe", "r"),
        1 => array("pipe", "w")
    );

    // pipes will be stored in $pipes
    $cwd = null;
    $env_var = null;
    $process = proc_open($cmd, $descriptorSpec, $pipes, null, null);

    // array mapping user ids to usernames
    $usernames = array();

    // where the output will be stored
    $procOutput = "";
    // exit code for the process, non-zero on failure
    $returnValue = -1;

    if (is_resource($process))
    {
	    while($debt = $networkDebtResult->fetch_assoc())
        {
            // pass creditorID, debtorID, amount to stdin of the process
            fwrite($pipes[0], $debt['creditor_id'].','.$debt['debtor_id'].','.$debt['amount']."\n");
            // also store mapping from user_id to username
            $usernames[$debt['creditor_id']] = $debt['creditor_username'];
            $usernames[$debt['debtor_id']] = $debt['debtor_username'];
        }
        fclose($pipes[0]);

        $procOutput = stream_get_contents($pipes[1]);
        fclose($pipes[1]);

        $returnValue = proc_close($process);
    }

    // process returned non-zero exit code
    if ($returnValue)
    {
        returnMessage('Failed to run FindDebtChain executable', 500);
    }

    // debtChains is the array that will be returned
    $debtChains = array();
    // split the result into an array of lines
    $chainEntries = explode("\n", $procOutput);

    // parse executable output
    foreach ($chainEntries as $chainEntry)
    {
        // ignore blank line due to trailing newline
        if (strlen($chainEntry) == 0)
        {
            continue;
        }
        // split line into 4 integers
        // line will be of the format <chain id>,<creditor>,<debtor>,<amount>
        $lineElements = explode(",", $chainEntry);
        if (count($lineElements) < 4)
        {
            returnMessage('FindDebtChain returned a line with '.count($lineElements).' elements: '.$chainEntry, 500);
        }
        $chainIndex = intval($lineElements[0]);
        $creditorID = intval($lineElements[1]);

        // if chain has not already been started
        if (!array_key_exists($chainIndex, $debtChains))
        {
            $amount = intval($lineElements[3]);
            $debtChains[$chainIndex] = array('amount' => $amount, 'chain' => array(), 'length' => 0);
        }

        // append this creditor to the chain
        $debtChains[$chainIndex]['chain'][] = array(
            'user_id' => $creditorID,
            'username' => $usernames[$creditorID]
        );
        // increment number of users in the chain
        $debtChains[$chainIndex]['length'] += 1;
    }

    return $debtChains;
}
?>
