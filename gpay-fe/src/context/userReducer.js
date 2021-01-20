
const userReducer = (state, action) => {
    let user = {}
    switch (action.type) {
        case 'LOGIN':
            user = action.payload
            localStorage.setItem('user', JSON.stringify(action.payload));
            return user;
        case 'LOGOUT':
            user = {}
            localStorage.removeItem('user');
            return user
        case 'REFRESH_USER':
            user = action.payload
            localStorage.setItem('user', JSON.stringify(action.payload));
            return user
        default:
            return state;
    }
};

export default userReducer;