import * as globals from '../utils/globals.js'
import { Text, View } from '../utils/globals.js';

import { useState } from 'react';

import DownChevron from '../assets/images/bx-chevron-down.svg';
import Button from './Button.js';
import SVGIcon from './SVGIcon.js';

const questions = [
    {
        "question": "What is Social Spending?",
        "answer": "Social Spending is an app to track how much you owe or are owed to people with whom you split expenses. You can also use Social Spending to track how much a group of people owe or are owed relative to a communal \'pot\' of money for the whole group."
    },
    {
        "question": "Why should I use Social Spending?",
        "answer": "It is common for groups of friends or roommates to split expenses such as groceries, restaurant bills, or utilities. These expenses tend to occur regularly and between the same individuals. Re-payment of amounts owed between members immediately after the expense is paid results in many transactions. In addition to the time burden of coordinating these re-payments, many popular platforms for these re-payments (Paypal, Venmo, Cashapp, etc.) make the money inaccessible for several days.\n\n\nSocial Spending provides stateful tracking of how much you owes or are owed relative to the group with whom you are splitting expenses. You can then use the amount of how much everyone in the group owes to inform who will pay for future expenses on behalf of the other group members."
    },
    {
        "question": "How do I split an expense with someone?",
        "answer": "First of all, welcome to Social Spending! Start be getting your IRL friends to sign up, then add them as a friend by searching their username or email. You can then create a new expense either between your friends, or add your friends to a group and quickly split an expense will all members of the group."
    },
    {
        "question": "Why do I need to friend someone to split an expense with them?",
        "answer": "Social Spending uses your friendships to indicate who you feel comfortable sending money to in order to settle up."
    },
    {
        "question": "How does Social Spending reduce the number of transactions I need to settle up?",
        "answer": "Imagine you owe person B, person B owes money to person C, and you are friends with both persons B and C. Social Spending will give you the option to pay person C directly to reduce the amount you owe person B and the amount person B owes person C. It's a win-win-win for everyone!"
    },
    {
        "question": "How does Social Spending use my data?",
        "answer": "The only data we collect is what you see. All your data - including information about transactions, groups, friends, and your profile - are not shared outside of this application. Any usage statistics and metadata we gather are used to diagnose and develop the app, and are never shared outside the development team."
    },
    {
        "question": "Does Social Spending use cookies?",
        "answer": "Social Spending uses cookies only to support the functionality of the app. We do not use same-site nor cross-site cookies to track your browsing history."
    }
]

export default function FAQ() {
    // build an array of questions
    const questionElements = [];

    for (let index = 0; index < questions.length; index++)
    {
        questionElements.push(<Question
            question={questions[index].question}
            answer={questions[index].answer}
            key={index}
            top={index == 0}
            last={index == questions.length - 1}
        />);
    }

    return (
        <View style={styles.faqContainer}>
            <Text style={{...globals.styles.h2, textAlign: 'center', color: globals.COLOR_GRAY}}>FAQ</Text>
            <View style={{marginBottom: '0.5em'}}>
                {questionElements}
            </View>
        </View>
    );
}

// collapsible element for a a given question
// question will be the header, and you can expand the header to view the answer
// props include:
//      question
//      answer
//      key
//      top: bool whether the element is the first question in the list
//      last: bool whether the element is the last question in the list
function Question(props)
{
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <View style={{ ...styles.questionSection, ...(props.top ? {} : {marginTop: '0.75em'}) }} onClick={() => setIsOpen(!isOpen)}>
                <Text style={styles.questionText}>{props.question}</Text>
                <Button aria-label={isOpen ? "Hide" : "Open"} style={{...styles.sectionButton, alignSelf: 'center'}} hoverStyle={{ borderRadius: '50%' }}>
                    <SVGIcon src={DownChevron} style={{ ...styles.chevron, transform: (isOpen ? 'rotate(180deg)' : '') }} />
                </Button>
            </View>
            <View style={{ ...styles.answerSection, ...isOpen ? { marginBottom: '0.5em' } : { maxHeight: 0, overflowY: 'hidden' }}}>
                <Text style={styles.answerText}>{props.answer}</Text>
            </View>
        </>
    );
}

const styles = {
    faqContainer: {
        width: '100vh',
        minWidth: '25em',
        backgroundColor: '#FFF',
        boxShadow: '0px 0px 5px 5px #eee',
        borderRadius: 18,
        justifyContent: 'stretch',
        alignItems: 'stretch',
        alignSelf: 'flex-start',
        marginTop: '10vh',
        marginBottom: '10vh'
    },
    sectionButton: {
        width: '2em',
        height: '2em',
        fontSize: '1em',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '1.25em'
    },
    questionSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: '0.75em',
        marginRight: '0.75em',
        backgroundColor: globals.COLOR_BLUE,
        borderRadius: '0.5em',
        cursor: 'pointer'
    },
    answerSection: {
        transition: '500ms',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        backgroundColor: globals.COLOR_BEIGE,
        marginLeft: '1em',
        marginRight: '1em',
        borderBottomLeftRadius: '0.5em',
        borderBottomRightRadius: '0.5em'
    },
    answerText: {
        color: globals.COLOR_GRAY,
        fontSize: '1em',
        fontWeight: 600,
        margin: '0.5em',
        lineHeight: 1.5
    },
    questionText: {
        ...globals.styles.h3,
        paddingLeft: 0,
        color: globals.COLOR_BEIGE,
        marginLeft: '0.5em'
    },
    chevron: {
        backgroundColor: 'rgba(0,0,0,0)',
        width: '100%',
        fill: globals.COLOR_BEIGE,
        transition: '500ms'
    }
};
