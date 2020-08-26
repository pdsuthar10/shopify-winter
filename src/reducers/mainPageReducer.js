import { ADD_NOMINEE, DEL_NOMINEE } from '../actions/types';

const initialState = {
    nominations : localStorage.getItem('nominations') == null ? [] : JSON.parse(localStorage.getItem('nominations'))
}


export default (state = initialState, action) => {
    
    switch(action.type){

        case ADD_NOMINEE : 
            let updatedNominations = [...state.nominations, action.payload]
            localStorage.setItem('nominations', JSON.stringify(updatedNominations))   
            return{     
                ...state,       
                nominations: [...state.nominations, action.payload]
            }

        case DEL_NOMINEE :      
            let newNominations = state.nominations.filter( movie => {
            return movie.imdbID !== action.payload.imdbID             
        })
        localStorage.setItem('nominations', JSON.stringify(newNominations))  
        return{
            ...state,
            nominations: newNominations
        }
        default:
            return state
    }
}