import * as globals from '../utils/globals.js'
import { Text, View } from '../utils/globals.js';

import { useEffect, useState } from 'react';

import DownChevron from '../assets/images/bx-chevron-down.svg';
import Button from './Button.js';
import SVGIcon from './SVGIcon.js';


export default function FAQ() {
    // build an array of questions
    const [questionElements, setQuestionElements] = useState([]);

    useEffect(() => {
        async function onFirstLoad() {
            let questionJSON = await getQuestions();
            setQuestionElements(createQuestionElements(questionJSON));
        }
        onFirstLoad();
    }, []);

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
                <Button aria-label={isOpen ? "Hide" : "Open"} style={{...styles.sectionButton, alignSelf: 'center'}} hoverStyle={{ borderRadius: '50%' }} onClick={() => setIsOpen(!isOpen)}>
                    <SVGIcon src={DownChevron} style={{ ...styles.chevron, transform: (isOpen ? 'rotate(180deg)' : '') }} />
                </Button>
            </View>
            <View style={{ ...styles.answerSection, ...isOpen ? { marginBottom: '0.5em' } : { maxHeight: 0, overflowY: 'hidden' }}}>
                <Text style={styles.answerText}>{props.answer}</Text>
            </View>
        </>
    );
}

// create Question elements from question JSON
function createQuestionElements(questions) {
    let retArray = [];

    for (let index = 0; index < questions.length; index++)
    {
        retArray.push(<Question
            question={questions[index].question}
            answer={questions[index].answer}
            key={index}
            top={index == 0}
            last={index == questions.length - 1}
        />);
    }

    return retArray;
}

async function getQuestions() {
    // GET request to static json file
    try {
        let response = await fetch("/faq.json", { method: 'GET'});

        if (response.ok) {
            let json = await response.json();
            return json;
        }
    }
    catch (error) {
        console.error("error in GET request to faq.json");
        console.error(error);
    }
    return [];
}

const styles = {
    faqContainer: {
        width: '80vh',
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
        justifyContent: 'center'
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
