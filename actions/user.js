import { SET_PROFILE } from '../types/user';

export const setProfile = (user) => {

	return dispatch => {

		dispatch({
			type: SET_PROFILE,
			payload: {
				user
			}
		})

	}

}