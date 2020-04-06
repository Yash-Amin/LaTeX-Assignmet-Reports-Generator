import { QuestionActionTypes } from './Store';
import arrayMove from 'array-move';

const initialState = {
    questionSections: [
        {
            id: 10,
            queOrAns: 'question',
            type: 'paragraph',
            text: 'Is this the question?'
        },
        {
            id: 12,
            queOrAns: 'answer',
            type: 'java',
            text: 'This is the answer.'
        }
        // { id: 3, type: 'paragraph', text: 'Hello World 2' },
        // { id: 4, type: 'paragraph', text: 'Hello World 3' }
    ],
    uploaded: false
};

const QuestionReducer = (state = initialState, action) => {
    let sections = state.questionSections;
    let payload = action.payload;

    switch (action.type) {
        case QuestionActionTypes.CLEAR:
            return {
                questionSections: []
            };
        case QuestionActionTypes.ADD:
            return {
                questionSections: payload
            };
        case QuestionActionTypes.SWAP_SECTION_ITEMS:
            return {
                ...state,
                uploaded: false,

                questionSections: arrayMove(
                    sections,
                    payload.oldIndex,
                    payload.newIndex
                )
            };
        case QuestionActionTypes.UPDATE_ITEM:
            for (var i = 0; i < sections.length; i++) {
                var section = sections[i];
                if (section.id == payload.id) {
                    sections[i] = payload;
                    break;
                }
            }
            return {
                ...state,
                uploaded: false,
                questionSections: sections
            };
        case QuestionActionTypes.DELETE_ITEM:
            for (var i = 0; i < sections.length; i++) {
                var section = sections[i];
                console.log('>>> ~~', sections);
                if (section.id == payload.id) {
                    sections.splice(i, 1);
                    break;
                }
                console.log('>>> ~~', sections);
                // console.log('>>> ~ ', section)
            }

            return {
                ...state,
                uploaded: false,
                questionSections: sections
            };
        case QuestionActionTypes.NEW_IMAGE:
            sections.push({
                id: Math.random(),
                text: '',
                width: '12cm',
                captionNum: '',
                type: 'image'
            });
            return {
                ...state,
                questionSections: sections,
                uploaded: false
            };
        case QuestionActionTypes.NEW_TEXT:
            sections.push({
                id: Math.random(),
                queOrAns: 'question',
                text: '',
                type: 'paragraph'
            });
            return {
                ...state,
                uploaded: false,
                questionSections: sections
            };
        case QuestionActionTypes.UPLOAD:
            return { ...state };
        case QuestionActionTypes.UPLOADED:
            return { ...state, uploaded: true };
    }
    return state;
};

export default QuestionReducer;
