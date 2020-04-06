import { combineReducers } from 'redux';
import TheoryReducer from './TheoryReducer';
import QuestionReducer from './QuestionReducer';
import UserReducer from './UserReducer';
import CodeReducer from './CodeReducer';
import PracticalReducer from './PracticalReducer';
import ReferenceReducer from './ReferenceReducer';
import InformationReducer from './InformationReducer';
import OutputReducer from './OutputReducer';

export const TheoryActionTypes = {
    SWAP_SECTION_ITEMS: 'THEORY_SWAP_SECTION_ITEMS',
    UPDATE_ITEM: 'THEORY_UPDATE_ITEM',
    DELETE_ITEM: 'THEORY_DELETE_ITEM',
    UPLOAD: 'THEORY_UPLOAD',
    ADD: 'THEORY_ADD',
    UPLOADED: 'THEORY_UPLOADED',
    NEW_TEXT: 'THEORY_NEW_TEXT',
    NEW_IMAGE: 'THEORY_NEW_IMAGE',
    CLEAR: 'CLR'
};
export const OutputActionTypes = {
    UPLOAD: 'OUTPUT_UPLOAD',
    ADD: 'OP_ADD',
    UPLOADED: 'OUTPUT_UPLOADED',
    SWAP_SECTION_ITEMS: 'OUTPUT_SWAP_SECTION_ITEMS',
    UPDATE_ITEM: 'OUTPUT_UPDATE_ITEM',
    DELETE_ITEM: 'OUTPUT_DELETE_ITEM',
    NEW_IMAGE: 'OUTPUT_NEW_IMAGE',
    CLEAR: 'CLR'
};

export const CodeActionTypes = {
    SWAP_SECTION_ITEMS: 'CODE_SWAP_SECTION_ITEMS',
    ADD: 'CODE_ADD',
    UPDATE_ITEM: 'CODE_UPDATE_ITEM',
    DELETE_ITEM: 'CODE_DELETE_ITEM',
    NEW_IMAGE: 'CODE_NEW_IMAGE',
    NEW_TEXT: 'CODE_NEW_TEXT',
    UPLOAD: 'CODE_UPLOAD',
    UPLOADED: 'CODE_UPLOADED',
    CLEAR: 'CLR'
};

export const QuestionActionTypes = {
    SWAP_SECTION_ITEMS: 'QUESTION_SWAP_SECTION_ITEMS',
    UPLOAD: 'QUESTION_UPLOAD',
    ADD: 'QUE_ADD',
    UPLOADED: 'QUESTION_UPLOADED',
    NEW_IMAGE: 'QUESTION_NEW_IMAGE',
    UPDATE_ITEM: 'QUESTION_UPDATE_ITEM',
    DELETE_ITEM: 'QUESTION_DELETE_ITEM',
    NEW_TEXT: 'QUESTION_NEW_TEXT',
    CLEAR: 'CLR'
};

export const ReferenceActionTypes = {
    SWAP_SECTION_ITEMS: 'REF_SWAP_SECTION_ITEMS',
    UPLOAD: 'REF_UPLOAD',
    ADD: 'REF_ADD',
    UPLOADED: 'REF_UPLOADED',
    UPDATE_ITEM: 'REF_UPDATE_ITEM',
    DELETE_ITEM: 'REF_DELETE_ITEM',
    NEW_TEXT: 'REF_NEW_TEXT',
    CLEAR: 'CLR'
};

export const UserActionTypes = {
    UPLOAD: 'USR_UPLOAD',
    UPLOADED: 'UPLOADED',
    SET_USER: 'SET_USER',
    LOGIN: 'LOGIN',
    LOGIN_COMPLETE: 'LOGIN_COMPLETE',
    CLEAR: 'CLR'
};

export const PracticalActionTypes = {
    UPLOAD: 'PRAC_UPLOAD',
    UPLOADED: 'PRAC_UPLOADED',
    ADD: 'Prac_ADD',
    SET_PRACTICAL: 'SEL_PRAC'
};

export const InformationActionTypes = {
    UPLOAD: 'INF_UPLOAD',
    UPLOADED: 'INF_UPLOADED',
    CLEAR: 'INF_CLR',
    UPDATE_ITEM: 'UPDATE_ITEM',
    ADD: 'INF_ADD'
};

export const LatexActionTypes = {
    SET: 'LATEX_SET'
};

const latexState = {
    latex: '',
    practicalID: '',
    downlaoded: false
};

const LatexReducer = (state = latexState, action) => {
    if (action.type === LatexActionTypes.SET) {
        return action.payload;
    }
    return state;
};

export const Reducer = combineReducers({
    OutputReducer,
    TheoryReducer,
    InformationReducer,
    QuestionReducer,
    CodeReducer,
    PracticalReducer,
    ReferenceReducer,
    UserReducer,
    LatexReducer
});
