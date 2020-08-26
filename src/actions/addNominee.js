import { ADD_NOMINEE } from './types';


export const addNominee = (movie) =>{
    return(dispatch) => {
        dispatch({
            type: ADD_NOMINEE,
            payload: movie
        });
    }
}