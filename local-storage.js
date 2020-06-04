
    function addToLocalStorage(loggedInUser) {
        localStorage.setItem('userProfile', loggedInUser);
    }
    function clearLocalStorage() {
        localStorage.removeItem('userProfile');	
    }
    function getUserProfile() { 
        let userProfile = localStorage.getItem('userProfile');
        return JSON.parse(userProfile)
        //return userProfile;
    }
 
 export default {
	addToLocalStorage: addToLocalStorage,
	clearLocalStorage: clearLocalStorage,
	getUserProfile: getUserProfile
}
