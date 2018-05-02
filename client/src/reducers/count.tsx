
const initialState = []

export default (state = initialState, action) => {
    switch (action.type) {
        case 'GET_EXPERT_COUNT':
            return action.count
        default:
            return state
    }
}
