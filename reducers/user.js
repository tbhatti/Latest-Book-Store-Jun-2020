import { SET_PROFILE } from '../types/user';

const initState = {
	user: {}
}

export default (state = initState, action) => {

	switch(action.type) {
		case SET_PROFILE :
			return {...state, user: action.payload.user}
		default :
			return state
	}

}