import { InformationActionTypes } from './Store';

const initialState = {
    subject: '',
    id: '',
    name: '',
    footer: '',
    pageStart: '',
    aim: '',
    uploaded: false,
    knowledge: '',
    hwReq: '',
    swReq: ''
};

const InformationReducer = (state = initialState, action) => {
    let payload = action.payload;

    switch (action.type) {
        case InformationActionTypes.ADD:
            // alert(JSON.stringify(payload  ));
            return {
                ...state,
                ...payload
            };
        case InformationActionTypes.UPDATE_ITEM:
            // alert('z');
            return {
                ...state,
                ...payload,
                uploaded: false
            };
        case InformationActionTypes.UPLOAD:
            return { ...state };
        case InformationActionTypes.UPLOADED:
            return { ...state, uploaded: true };
        case InformationActionTypes.CLEAR:
            return {
                subject: '',
                id: '',
                name: '',
                footer: '', 
                pageStart: '',
                aim: '',
                uploaded: false,
                knowledge: '',
                hwReq: '',
                swReq: ''
            };
    }

    return state;
};

export default InformationReducer;
