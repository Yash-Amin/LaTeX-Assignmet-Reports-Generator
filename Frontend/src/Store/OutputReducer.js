import { OutputActionTypes } from './Store';
import arrayMove from 'array-move';

const initialState = {
    outputSections: [
        { id: 23, type: 'image', width: '12cm', captionNum: 'Fig no. 1' }
    ],
    uploaded: false
};

const OutputReducer = (state = initialState, action) => {
    let sections = state.outputSections;
    let payload = action.payload;

    switch (action.type) {
        case OutputActionTypes.CLEAR:
            return {
                outputSections: [],
                uploaded: false
            };
        case OutputActionTypes.ADD:
            return {
                outputSections: payload,
                uploaded: true
            };
        case OutputActionTypes.SWAP_SECTION_ITEMS:
            return {
                ...state,
                uploaded: false,
                outputSections: arrayMove(
                    sections,
                    payload.oldIndex,
                    payload.newIndex
                )
            };
        case OutputActionTypes.UPDATE_ITEM:
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
                outputSections: sections
            };
        case OutputActionTypes.DELETE_ITEM:
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
                outputSections: sections
            };
        case OutputActionTypes.NEW_IMAGE:
            sections.push({
                id: Math.random(),
                text: '',
                width: '12cm',
                captionNum: '',
                type: 'image'
            });
            return {
                ...state,
                outputSections: sections
            };
        case OutputActionTypes.UPLOAD:
            return { ...state };
        case OutputActionTypes.UPLOADED:
            return { ...state, uploaded: true };
    }
    return state;
};

export default OutputReducer;
