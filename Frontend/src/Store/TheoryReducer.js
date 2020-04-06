import { TheoryActionTypes } from './Store';
import arrayMove from 'array-move';

const initialState = {
    theorySections: [
        { id: 1, type: 'paragraph', text: 'Hello World 1' },
        { id: 3, type: 'image', width: '12cm', captionNum: 'Fig no. 1' },
        { id: 2, type: 'java', text: '<script>alert(1)</script>' }
        // { id: 3, type: 'paragraph', text: 'Hello World 2' },
        // { id: 4, type: 'paragraph', text: 'Hello World 3' }
    ],
    uploaded: false
};

const TheoryReducer = (state = initialState, action) => {
    let sections = state.theorySections;
    let payload = action.payload;

    switch (action.type) {
        case TheoryActionTypes.SWAP_SECTION_ITEMS:
            return {
                ...state,
                uploaded: false,
                theorySections: arrayMove(
                    sections,
                    payload.oldIndex,
                    payload.newIndex
                )
            };
        case TheoryActionTypes.UPDATE_ITEM:
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

                theorySections: sections
            };
        case TheoryActionTypes.DELETE_ITEM:
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
                theorySections: sections
            };
        case TheoryActionTypes.ADD:
            return {
                ...state,
                theorySections: payload
            };

        case TheoryActionTypes.NEW_TEXT:
            sections.push({ id: Math.random(), text: '', type: 'paragraph' });
            return {
                ...state,
                theorySections: sections
            };
        case TheoryActionTypes.NEW_IMAGE:
            sections.push({
                id: Math.random(),
                text: '',
                width: '12cm',
                captionNum: '',
                type: 'image'
            });
            return {
                ...state,
                theorySections: sections
            };
        case TheoryActionTypes.UPLOAD:
            return { ...state };
        case TheoryActionTypes.UPLOADED:
            return { ...state, uploaded: true };
        case TheoryActionTypes.CLEAR:
            return { theorySections: [], uploaded: false };
    }
    return state;
};

export default TheoryReducer;
