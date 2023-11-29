import * as globals from "../utils/globals.js";

import { Text, View, Modal, Image } from '../utils/globals.js';
import { useState, useEffect, useContext, createContext } from 'react';
import { ModalContext } from "./ModalContext.js";
import Button from '../components/Button.js'
import Loading from "../components/Loading.js";
import { Link } from "react-router-dom/dist/index.js";
import { GlobalContext } from "../components/GlobalContext.js";
import { approveRejectTransaction } from "../utils/transactions.js";
import VerifyAction from "./VerifyAction.js";

const ViewReceiptContext = createContext(0);

export default function ViewReceipt(props) {
    const [transactionInfo, setTransactionInfo] = useState(null);

    const { pushModal, popModal } = useContext(ModalContext);

    function handleChildClick(e) {
        e.stopPropagation();
    }

    useEffect(() => {

        if (!props.json) {
			console.log("Fetching transaction info");
            // React advises to declare the async function directly inside useEffect
            // On load asynchronously request groups and construct the list
            async function getInfo() {

                setTransactionInfo(await getTransaction(props.id));
            }
            getInfo();
        } else {
			console.log("Already received transaction info");
            setTransactionInfo(props.json);
        }
    }, []);

	return (
		<ViewReceiptContext.Provider
			value={{
				transactionInfo: [transactionInfo, setTransactionInfo]
			}}>
			<Modal
				transparent={true}
				visible={true}
				onRequestClose={() => popModal()}>
				<View style={styles.info} onClick={handleChildClick}>
				<Text>Hello</Text>
				{/* {() => {
					if (transactionInfo == null) {
						return (
							<Loading />
						);
					} else {
						return (
							<>
								<View style={{padding: '.75em'}}>
									<Image source={transactionInfo["receipt_path"] != null ? decodeURI(transactionInfo["receipt_path"]) : ""} style={{width: '225px', height: '400px', justifyContent: 'center', alignItems: 'center'}}/>
								</View>

								<View style={{justifyContent: 'center', flexDirection: 'row'}}>
									<Button style={{...globals.styles.formButton, ...{marginTop: '0em', marginBottom: '.75em', width: '100%'}}} id='transactionViewReceipt_close' onClick={popModal()}>
										<label htmlFor="transactionViewReceipt_close" style={globals.styles.buttonLabel}>
											Go Back
										</label>
									</Button>
								</View>
							</>
						);
					}
				}} */}
				</View>
			</Modal>
		</ViewReceiptContext.Provider>
	);
}

/**
 * Gets transaction data from the server using transaction.php endpoint
 *      @param {number} transactionId   id of transaction to fetch
 *      @return {JSON}                  JSON object containing data for transaction or an error message
 */
async function getTransaction(transactionId) {

    try {
        let url = "/transactions.php?transaction_id=" + transactionId;

        let response = await fetch(url, { credentials: 'same-origin' });

        return await response.json();
    }
    catch (error) {
        console.log("error in in GET request to transactions (/transactions.php)");
        console.log(error);
    }
}

const styles = {
    info: {
        width: '25em',
        minHeight: '30em',
        height: 'auto',
        maxHeight: '80vh',
        backgroundColor: globals.COLOR_WHITE,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%'
    },
    details: {
        padding: 0,
        color: globals.COLOR_GRAY,

    },
    description: {
        paddingLeft: 0,
        paddingTop: '0.25em',
        paddingBottom: '1em',
        color: globals.COLOR_GRAY,

    },
    name: {
        paddingLeft: 0,
        paddingTop: '1em',
        paddingBottom: '0em',
        color: globals.COLOR_GRAY,

    },
    participants: {
        paddingLeft: 0,
        paddingTop: '1em',
        paddingBottom: '.5em',
        color: globals.COLOR_GRAY,

    }
};