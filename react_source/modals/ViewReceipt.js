import * as globals from "../utils/globals.js";

import {  View, Modal, Image } from '../utils/globals.js';
import { useState, useContext, createContext } from 'react';
import { ModalContext } from "./ModalContext.js";
import Button from '../components/Button.js'

const ViewReceiptContext = createContext(0);

export default function ViewReceipt(props) {
    const [transactionInfo, setTransactionInfo] = useState(null);

    const { pushModal, popModal } = useContext(ModalContext);

    function handleChildClick(e) {
        e.stopPropagation();
    }

	return (
		<ViewReceiptContext.Provider
			value={{
				transactionInfo: [transactionInfo, setTransactionInfo]
			}}>
			<Modal
				transparent={true}
				visible={true}
				onRequestClose={() => popModal()}>
				<View style={{ ...globals.styles.modalBackground, ...props.style }} onClick={(props.exit != undefined ? props.exit : () => popModal())}>
					<View style={styles.info} onClick={handleChildClick}>
						<View style={{padding: '.75em'}}>
                            <Image source={props.receipt_path} useimagesize={"true"} style={{ maxHeight: '70vh', maxWidth: '80vw', justifyContent: 'center', alignItems: 'center'}}/>
						</View>

						<View style={{justifyContent: 'center', flexDirection: 'row'}}>
							<Button style={{...globals.styles.formButton, ...{marginTop: '0em', marginBottom: '.75em', width: '100%'}}} id='transactionViewReceipt_close' onClick={() => popModal()}>
								<label htmlFor="transactionViewReceipt_close" style={globals.styles.buttonLabel}>
									Go Back
								</label>
							</Button>
						</View>
					</View>
				</View>
			</Modal>
		</ViewReceiptContext.Provider>
	);
}

const styles = {
    info: {
        width: 'auto',
        minWidth: '25em',
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