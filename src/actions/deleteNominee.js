import { DEL_NOMINEE } from './types';


export const deleteNominee = (movie) =>{
    return(dispatch) => {
        dispatch({
            type: DEL_NOMINEE,
            payload: movie
        });
    }
}