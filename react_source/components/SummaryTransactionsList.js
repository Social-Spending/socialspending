import * as globals from "../utils/globals.js";

import { Text, View } from '../utils/globals.js';
import { useState, useEffect, useContext } from 'react';


import WaitForAuth from "./WaitForAuth.js";
import Loading from "./Loading.js";
import { GlobalContext } from "./GlobalContext.js";
import TransactionInfo from "../modals/TransactionInfo.js";
import { ModalContext } from "../modals/ModalContext.js";
import { getTransactionJSONComparator, getTransactions } from "../utils/transactions.js";

export default function SummaryTransactionsList(props) {

    return (

        <View style={{ ...globals.styles.summaryList, ...props.style}}>

            <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
                <Text style={{ ...globals.styles.h2, ...globals.styles.summaryLabel}}>TRANSACTIONS</Text>
            </View>

            <View style={{ alignSelf: 'center', height: '1px', width: '92%', backgroundColor: globals.COLOR_GRAY, marginTop: '.5em' }} />

            <WaitForAuth redirectOnNotLoggedIn={'/login'}>
                <TransactionList />
            </WaitForAuth>

        </View>
    );
}

function TransactionList() {
    let [summaryTransactionItems, setSummaryTransactionItems] = useState(null);
    const {reRenderCount, currUserID} = useContext(GlobalContext);


    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {

            setSummaryTransactionItems(await buildTransactions(currUserID));
        }
        getItems();

    }, [reRenderCount]);

    if (summaryTransactionItems === null) {
        //List hasn't loaded yet, show nothing
        return (
            <Loading />

        );

    } else {
        // List has been parsed into SummaryFriendItem components, render it
        return (
            <View style={{
                ...globals.styles.list,
                ...{ gridTemplateColumns: '1.5fr 1fr max-content', }
            }} >

                <Text style={globals.styles.listHeader}>NAME</Text>
                <Text style={{...globals.styles.listHeader, ...{ alignItems: 'center' }}}>DATE</Text>
                <Text style={{ ...globals.styles.listHeader, ...{ alignItems: 'center' } }}>AMOUNT</Text>

                {summaryTransactionItems}

            </View>
        );
    }
}

function SummaryTransactionItem(props) {
    const { pushModal, popModal } = useContext(ModalContext);

    let text = props.debt < 0 ? "Paid" : "Borrowed";
    let color = props.debt < 0 ? { color: globals.COLOR_BLUE } : { color: globals.COLOR_ORANGE };
    color = props.debt == 0 ? { color:globals.COLOR_GRAY } : color;

    let pendingItalic = props.isApproved == 0 ? { fontStyle: 'italic' } : {};

    function viewTransaction() {
        pushModal(<TransactionInfo id={props.id} />);
    }

    return (
        <>
            

            <Text
                style={{ ...globals.styles.listText, ...globals.styles.listItemRow, ...pendingItalic, ...{ cursor: 'pointer' } }}
                onClick={viewTransaction}>
                {props.name}
            </Text>
            <Text
                style={{ ...globals.styles.listText, ...globals.styles.listItemRow, ...{ cursor: 'pointer', justifyContent: 'center' } }}
                onClick={viewTransaction}>
                {props.date}
            </Text>
            <View
                style={{ ...globals.styles.listItemColumn, ...{ cursor: 'pointer' } }}
                onClick={viewTransaction}>
                <Text style={{ ...globals.styles.listText, ...{ fontSize: '.66em' }, ...color }}>{text}</Text>
                <Text style={{ ...globals.styles.listText, ...color }}>${Math.abs(props.debt / 100).toFixed(2)}</Text>
            </View>

            
        </>
        

    );
}

async function buildTransactions(currUserID) {

    let transactionList = [];

    let transactions = await getTransactions(currUserID);

    if (transactions === null) return transactionList;

    // sort transactions
    transactions.sort(getTransactionJSONComparator('transaction_date'));

    for (let i = 0; i < transactions.length; i++) {
        let currUserAsParticipant = transactions[i].transaction_participants.find((part) => {return part.user_id == currUserID;});
        if (currUserAsParticipant == null)
        {
            continue;
        }

        
        transactionList.push(
            <SummaryTransactionItem
                key={i}
                name={transactions[i].transaction_name}
                id={transactions[i].transaction_id}
                date={transactions[i].transaction_date}
                debt={currUserAsParticipant.amount}
                isApproved={transactions[i].is_approved}
            />
        );
    }

    return transactionList;
}
