import {setErrorAC, SetErrorTypeAC, setStatusLoadingAC, SetStatusLoadingTypeAC} from "../app/app-reducer";
import {ResponseType} from "../api/todolists-api";
import {Dispatch} from "redux";

type ErrorUtilsDispatchType = Dispatch<SetStatusLoadingTypeAC | SetErrorTypeAC>
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setErrorAC(data.messages[0]))
    } else {
        dispatch(setErrorAC('Some error occurred'))
    }
    dispatch(setStatusLoadingAC('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setErrorAC(error.message))
    dispatch(setStatusLoadingAC('failed'))
}