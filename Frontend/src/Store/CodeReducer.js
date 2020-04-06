import { CodeActionTypes } from './Store';
import arrayMove from 'array-move';

const initialState = {
    codeSections: [
        {
            id: 1,
            type: 'xml',
            fileName: 'MainActivity.xml',
            text: 'Hello World 1'
        },
        {
            id: 2,
            type: 'java',
            fileName: 'MainActivity.xml',
            text: '<script>alert(1)</script>'
        }
        // { id: 3, type: 'paragraph', text: 'Hello World 2' },
        // { id: 4, type: 'paragraph', text: 'Hello World 3' }
    ]
};

const CodeReducer = (state = initialState, action) => {
    let sections = state.codeSections;
    let payload = action.payload;

    switch (action.type) {
        case CodeActionTypes.SWAP_SECTION_ITEMS:
            return {
                ...state,
                uploaded: false,

                codeSections: arrayMove(
                    sections,
                    payload.oldIndex,
                    payload.newIndex
                )
            };
        case CodeActionTypes.UPDATE_ITEM:
            for (var i = 0; i < sections.length; i++) {
                var section = sections[i];
                if (section.id == payload.id) {
                    sections[i] = payload;
                    break;
                }
            }
            return {
                ...state,
                codeSections: sections,
                uploaded: false
            };
        case CodeActionTypes.DELETE_ITEM:
            // alert('DELETE')
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
                codeSections: sections
            };
        case CodeActionTypes.NEW_TEXT:
            sections.push({ id: Math.random(), text: '', fileName: '' });
            return {
                ...state,
                uploaded: false,
                codeSections: sections
            };
            
            case CodeActionTypes.ADD:
                return {
                    ...state,
                    uploaded: false,
                    codeSections: payload
                };
                
        case CodeActionTypes.CLEAR:
            return {
                codeSections: []
            };
        case CodeActionTypes.NEW_IMAGE:
            sections.push({
                id: Math.random(),
                text: '',
                width: '12cm',
                captionNum: '',
                type: 'image'
            });
            return {
                ...state,
                uplaoded: false,
                theorySections: sections
            };
        case CodeActionTypes.UPLOAD:
            return { ...state };
        case CodeActionTypes.UPLOADED:
            return { ...state, uploaded: true };
    }
    return state;
};

export default CodeReducer;
