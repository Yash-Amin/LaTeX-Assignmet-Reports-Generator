import { PracticalActionTypes } from './Store';



const initialState = {
    practicalID: '',
    practicalName: '',
    practicalAim: ''
};

const PracticalReducer = (state = initialState, action) => {
    switch (action.type) {
        case PracticalActionTypes.SET_PRACTICAL:
            return {
                ...state,
                ...action.payload
            };
            case PracticalActionTypes.UPLOAD:
                return {...state}
            case PracticalActionTypes.UPLOADED:
                return {...state, uploaded:true}
    }
    return state;
};

export default PracticalReducer;
