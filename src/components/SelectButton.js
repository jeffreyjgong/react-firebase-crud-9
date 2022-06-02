import { makeStyles } from '@material-ui/core'
import React from 'react'

const SelectButton = ({children, selected, onClick}) => {
   const useStyles = makeStyles({
      selectbutton: {
         border: "1px solid rgb(0,113,115)",
         borderRadius: 5,
         padding: 10,
         paddingLeft: 20,
         paddingRight: 20,
         fontFamily: "Montserrat",
         cursor: "pointer",
         backgroundColor: selected ? "rgb(0,113,115)" : "",
         color: selected ? "black" : "",
         fontWeight: selected ? 700 : 500,
         "&:hover": {
            backgroundColor: "rgb(0,113,115)",
            color: "black",
         },
         width: "22%"
      }
   });

   const classes = useStyles();

   return (
      <span 
         className={classes.selectbutton}
         onClick={onClick}
         selected={selected}
      >
         {children}
      </span>
   )
}

export default SelectButton