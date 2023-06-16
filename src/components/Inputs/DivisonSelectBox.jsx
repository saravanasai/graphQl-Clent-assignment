import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'

const DivisonSelectBox = ({name,value,onChange,onBlur,helperText,error}) => {

    const division = [
        {
            id: 1,
            value: "Pharmacy"
        },
        {
            id: 2,
            value: "Market Place"
        },
        {
            id: 3,
            value: "Book Store"
        },
        {
            id: 4,
            value: "Food Delivery"
        },
    ]

    return (
        <FormControl fullWidth  error={error} > 
            <InputLabel id="demo-simple-select-label">Division</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="divson-select-box"
                name={name}
                value={value}
                label="Division"
                onBlur={onBlur}
                onChange={onChange}
               
              
            >
                {division.map(({ id, value }) => (<MenuItem key={id} value={id}>{value}</MenuItem>))}
            </Select>
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    )
}

export default DivisonSelectBox