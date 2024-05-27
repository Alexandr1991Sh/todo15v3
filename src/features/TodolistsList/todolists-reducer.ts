import {ResultCode, todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {
    RequestStatusType,
    setErrorAC,
    SetErrorTypeAC,
    setStatusLoadingAC,
    SetStatusLoadingTypeAC
} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return state.map(tl => tl.id === action.todolistId ? {...tl, entityStatus: action.status} : tl)
        default:
            return state
    }
}

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
export const changeTodolistEntityStatusAC = (todolistId: string, status: RequestStatusType) => ({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS',
    todolistId,
    status
} as const)

// thunks
export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
                dispatch(setStatusLoadingAC('succeeded'))
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setStatusLoadingAC('loading'))
        dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                if (res.data.resultCode === ResultCode.SUCCESS) {
                    dispatch(removeTodolistAC(todolistId))
                    dispatch(setStatusLoadingAC('succeeded'))
                } else {
                    handleServerAppError(res.data,dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
}

export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setStatusLoadingAC('loading'))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === ResultCode.SUCCESS) {
                    dispatch(addTodolistAC(res.data.data.item))
                } else {
                    handleServerAppError(res.data,dispatch)
                }
            }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setStatusLoadingAC('loading'))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                if (res.data.resultCode === ResultCode.SUCCESS) {
                    dispatch(changeTodolistTitleAC(id, title))
                    dispatch(setStatusLoadingAC('succeeded'))
                } else {
                    handleServerAppError(res.data,dispatch)
                }
            }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
    }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>;
type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | SetStatusLoadingTypeAC
    | SetErrorTypeAC
    | ChangeTodolistEntityStatusActionType
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}
