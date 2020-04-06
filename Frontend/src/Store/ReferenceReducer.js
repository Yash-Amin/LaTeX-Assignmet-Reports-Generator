import { ReferenceActionTypes } from './Store';
import arrayMove from 'array-move';

const initialState = {
    referenceSections: [
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
    ],
    uploaded: false
};

const ReferenceReducer = (state = initialState, action) => {
    let sections = state.referenceSections;
    let payload = action.payload;

    switch (action.type) {
        case ReferenceActionTypes.ADD:
            return {
                referenceSections: payload
            };
        case ReferenceActionTypes.CLEAR:
            return {
                referenceSections: []
            };
        case ReferenceActionTypes.SWAP_SECTION_ITEMS:
            return {
                ...state,
                referenceSections: arrayMove(
                    sections,
                    payload.oldIndex,
                    payload.newIndex
                ),
                uploaded: false
            };
        case ReferenceActionTypes.UPDATE_ITEM:
            for (var i = 0; i < sections.length; i++) {
                var section = sections[i];
                if (section.id == payload.id) {
                    sections[i] = payload;
                    break;
                }
            }
            return {
                ...state,
                referenceSections: sections,
                uploaded: false
            };
        case ReferenceActionTypes.DELETE_ITEM:
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
                referenceSections: sections,
                uploaded: false
            };
        case ReferenceActionTypes.NEW_TEXT:
            sections.push({ id: Math.random(), text: '', type: 'paragraph' });
            return {
                ...state,
                referenceSections: sections
            };
        case ReferenceActionTypes.UPLOAD:
            return { ...state };
        case ReferenceActionTypes.UPLOADED:
            return { ...state, uploaded: true };
    }
    return state;
};

export default ReferenceReducer;
