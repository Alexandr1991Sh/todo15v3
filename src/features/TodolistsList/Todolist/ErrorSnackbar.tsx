import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, {AlertProps} from '@mui/material/Alert'
import {useAppDispatch, useAppSelector} from "../../../app/store";
import {setErrorAC} from "../../../app/app-reducer";
import {SnackbarOrigin} from "@mui/material/Snackbar/Snackbar";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})


export function ErrorSnackbar() {
    const dispatch = useAppDispatch()
    const error = useAppSelector(state => state.app.error)

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        dispatch(setErrorAC(null))
    }

    return (
        <div>
            <Snackbar
                open={!!error}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={handleClose}
                    severity="error"
                    sx={{width: '100%'}}
                >
                    {error}
                </Alert>
            </Snackbar>
        </div>
    )
}