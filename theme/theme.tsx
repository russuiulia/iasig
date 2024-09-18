import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: { marginLeft: 0, color: '#428bf9' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: '#B8C8D9',
          color: '#B8C8D9',
        },
        root: {
          '&.Mui-focused': {
            '& fieldset': {
              borderColor: '#111439 !important',
            },
          },
          '& svg': {
            color: '#B8C8D9',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#B8C8D9',
          '&.Mui-error': {
            color: '#B8C8D9',
          },
          '&.Mui-focused': {
            color: '#111439 !important',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: '#B8C8D9',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: '#536980',
          fontSize: '14px',
          lineHeight: '20px',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          paddingTop: '0px',
          paddingBottom: '0px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: '#F2F5F8 !important',
          borderRadius: '4px',
        },
        label: {
          fontSize: '14px',
          lineHeight: '16px',
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          width: '30px',
        },
      },
    },
  },
})

export default theme
