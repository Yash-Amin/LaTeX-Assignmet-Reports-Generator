import { UserActionTypes } from './Store';
 
const initialState = {
    email: '',
    isLoading: false,
    isLoggedIn: false
};

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case UserActionTypes.SET_USER:
            return {
                ...state,
                ...action.payload
            };
        case UserActionTypes.LOGIN:
            return {
                ...state,
                isLoading: true
            };
        case UserActionTypes.LOGIN_COMPLETE:
            return {
                ...state,
                isLoading: false
            };
    }
    return state;
};

export default UserReducer;
