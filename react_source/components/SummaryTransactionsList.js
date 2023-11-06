import * as globals from "../utils/globals.js";

import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect, useContext } from 'react';

import { Link } from "expo-router";

import { getFriends } from '../utils/friends.js'
import Button from "./Button.js";
import WaitForAuth from "./WaitForAuth.js";
import Loading from "./Loading.js";
import { GlobalContext } from "./GlobalContext.js";
import TransactionInfo from "../modals/TransactionInfo.js";
import { ModalContext } from "../modals/ModalContext.js";
import { getTransactions } from "../utils/transactions.js";

export default function SummaryTransactionsList(props) {
    let setModal = useContext(ModalContext);

    return (

        <View style={[globals.styles.summaryList, props.style]}>

            <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
                <Text style={[globals.styles.h2, globals.styles.summaryLabel]}>TRANSACTIONS</Text>
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
            <View style={globals.styles.list}>
                <View style={[globals.styles.listItem, { padding: 0, position: 'sticky', top: 0, zIndex: 1, backgroundColor: globals.COLOR_WHITE }]} >
                    <Text style={[globals.styles.h3, globals.styles.listText, {flexShrink:0}]}>TRANSACTION NAME</Text>
                    <Text style={[globals.styles.h5, globals.styles.listText, {flexShrink:0}]}>DATE</Text>
                    <Text style={[globals.styles.h5, globals.styles.listText, {flexShrink:0}]}>YOUR CONTRIBUTION</Text>
                </View>
                {summaryTransactionItems}

            </View>
        );
    }
}

function SummaryTransactionItem(props) {
    const setModal = useContext(ModalContext);

    let text = props.debt < 0 ? "Paid" : "Borrowed";
    text = props.debt == 0 ? "" : text;
    let color = props.debt < 0 ? { color: globals.COLOR_BLUE } : { color: globals.COLOR_ORANGE };
    color = props.debt == 0 ? { color:globals.COLOR_BLACK } : color;
    function viewTransaction() {
        setModal(<TransactionInfo id={props.id} />);
    }

    return (

        <View
            style={[props.border ? globals.styles.listItemSeperator : globals.styles.listItem, {cursor:'pointer'}]}
            onClick={viewTransaction}
        >

            <Text style={[globals.styles.listText, {paddingLeft: '.25em'}]}>{props.name}</Text>
            <Text style={[globals.styles.listText, {paddingLeft: '.25em'}]}>{props.date}</Text>
            <View style={{ width: 'auto', paddingRight: '.5em', marginVertical: 'auto', minWidth: '5em', alignItems: 'center' }}>
                <Text style={[globals.styles.listText, { fontSize: '.66em' }, color]}>{text}</Text>
                <Text style={[globals.styles.listText, color]}>${Math.abs(props.debt / 100).toFixed(2)}</Text>
            </View>

        </View>

    );
}

async function buildTransactions(currUserID) {

    let transactionList = [];

    let transactions = await getTransactions(currUserID);

    if (transactions === null) return transactionList;

    for (let i = 0; i < transactions.length; i++) {
        let currUserAsParticipant = transactions[i].transaction_participants.find((part) => {return part.user_id == currUserID;});
        if (currUserAsParticipant == null)
        {
            continue;
        }
        transactionList.push(
            <SummaryTransactionItem
                key={i}
                border={i > 0}
                name={transactions[i].transaction_name}
                id={transactions[i].transaction_id}
                date={transactions[i].transaction_date}
                debt={currUserAsParticipant.amount}
            />
        );
    }

    return transactionList;
}
