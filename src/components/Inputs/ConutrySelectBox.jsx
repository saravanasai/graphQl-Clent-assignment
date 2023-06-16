import React from 'react'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { useQuery, gql } from '@apollo/client';


const GET_COUNTRIES = gql`
    query {
        countries(filter:{})
        {
          name
          code
        }
      }
    `;

const ConutrySelectBox = ({ name, value, onChange, onBlur, helperText, error }) => {

    const { loading, error:countryError, data } = useQuery(GET_COUNTRIES);

    return (


        <FormControl fullWidth error={error}>
            <InputLabel id="demo-simple-select-label">Country Code</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="country-select-box"
                value={value}
                name={name}
                label="Country Code"
                onChange={onChange}
                onBlur={onBlur}
            >
                {!loading && data?.countries.map(({ name, code }) => (<MenuItem key={code} value={code.toString().toLowerCase()}>{name}</MenuItem>))}
            </Select>
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    )
}

export default ConutrySelectBox