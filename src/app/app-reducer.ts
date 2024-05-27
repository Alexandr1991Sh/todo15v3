export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SetStatusLoadingTypeAC = ReturnType<typeof setStatusLoadingAC>
export type SetErrorTypeAC = ReturnType<typeof setErrorAC>
type ActionsType = SetStatusLoadingTypeAC | SetErrorTypeAC

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string
}

type InitialStateType = typeof initialState

export const appReducer = (
    state: InitialStateType = initialState,
    action: ActionsType
): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        default:
            return state
    }
}

export const setStatusLoadingAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)


