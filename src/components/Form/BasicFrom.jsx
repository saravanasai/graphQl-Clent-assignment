
import { Autocomplete, Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useQuery, gql } from '@apollo/client';
import axios from 'axios';
import DivisonSelectBox from '../Inputs/DivisonSelectBox';
import ConutrySelectBox from '../Inputs/ConutrySelectBox';
import { toast } from 'react-toastify';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const BasicFrom = () => {

    const theme = useTheme();
    const [languesName, setLanguesName] = React.useState([]);

    const [fromState, setFormState] = useState({
        searchId: 0,
        searchString: "",
        app_name: "",
        division: 0,
        country: "",
        language: []
    })

    const [errors, setErrors] = useState({
        app_name: "",
        division: 0,
        country: "",
        language: ""
    })

    const GET_LANGUAGE = gql`
    query {
        country(code:"${fromState.country.toUpperCase()}") {
          name
          languages{
            name
          }
        }
      }
    `;

    const [appList, setAppList] = useState([])
    const [fetch, setFetch] = useState(true)
    const [isLoading, setisLoading] = useState(true)
    const { refetch } = useQuery(GET_LANGUAGE);



    const handleMultiSelectChange = (event) => {
        const {
            target: { value },
        } = event;
        setLanguesName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const validateInputs = () => {

        const errors = {};
        if (!fromState.app_name) {
            errors.app_name = "Required";
        } else if (
            !(/^[A-Za-z0-9_-]*$$/i.test(fromState.app_name))
        ) {
            errors.app_name = 'Invalid Application name    ';
        }

        if (!fromState.division) {
            errors.division = "Required";
        }

        if (!fromState.country) {
            errors.country = "Required";
        }

        if (fromState.language.length === 0) {
            errors.language = "Required";
        }

        setErrors(errors)
        return errors;

    }

    const handleOnBlur = () => {
        validateInputs()
    }

    const handleChange = (e) => {
        validateInputs()
        setFormState(prev => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    const handleSearchId = (e, newValue) => {
        setFormState(prev => {
            return { ...prev, searchId: newValue?.id ?? null }
        })
    }

    const clearInputs = () => {
        setFormState(() => {
            return {
                searchId: 0,
                app_name: "",
                division: 0,
                country: "",
                language: "",
                searchString: 0
            }
        })
    }

    const generateFromData = () => {


        return {
            app_name: fromState.app_name,
            division: fromState.division,
            country: fromState.country,
            language: fromState.language
        }
    }

    const handlFetchLanguage = async () => {

        const GET_LANGUAGE_REFETCH = gql`
        query {
            country(code:"${fromState.country.toUpperCase()}") {
              name
              languages{
                name
              }
            }
          }
        `;

        const { data } = await refetch(GET_LANGUAGE, GET_LANGUAGE_REFETCH)

        if (data.country.languages) {
            setFormState(prev => {
                let tempArr = [];
                data.country.languages.map(({ name }) => tempArr.push(name))
                return { ...prev, language: tempArr }
            })
        } else {
            setFormState(prev => {
                return { ...prev, language: "Cannot Find" }
            })
        }

    }

    const fetchBussinessAppList = async () => {

        let response = await axios.get('http://localhost:3000/applications')

        if (response.status === 200) {
            setAppList(response.data);
        }
        setisLoading(false)
    }

    const fetchSelectedApp = async () => {

        let response = await axios.get('http://localhost:3000/applications/' + fromState.searchId)

        if (response.status === 200) {
            setFormState(() => {
                return {
                    searchId: response.data.id,
                    app_name: response.data.app_name,
                    division: response.data.division,
                    country: response.data.country,
                    language: response.data.language
                }
            })
        }

    }

    const handleCreate = async () => {

        let error = validateInputs()

        if (Object.keys(error).length) {
            return;
        }

        let data = generateFromData()

        let response = await axios.post('http://localhost:3000/applications/', data)

        if (response.status === 201) {

            toast.success("Applcation Added")
            clearInputs()
            setFetch((prev) => !prev)
        }


    }

    const handleUpdate = async () => {

        let error = validateInputs()

        if (Object.keys(error).length) {
            return;
        }

        let data = generateFromData();

        try {
            let response = await axios.patch('http://localhost:3000/applications/' + fromState.searchId, data)

            if (response.status === 200) {
                clearInputs()
                toast.success("Applcation Updated")
                setFetch((prev) => !prev)
            }

        } catch (e) {
            toast.error(e.message)
        }


    }

    const handleDelete = async () => {

        let response = await axios.delete('http://localhost:3000/applications/' + fromState.searchId)

        if (response.status === 200) {
            clearInputs()
            toast.success("Applcation Deleted")
            setFetch((prev) => !prev)
        }
    }



    useEffect(() => {

        handlFetchLanguage()

    }, [fromState.country])



    useEffect(() => {

        fetchSelectedApp()

    }, [fromState.searchId])


    useEffect(() => {

        fetchBussinessAppList()

    }, [fetch])


    return (
        <Paper elevation={3}>
            <Box
                sx={{
                    marginTop: 5,
                    marginBottom: 15,
                    marginLeft: 10,
                    marginRight: 10,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {isLoading ? <>Loading.....</> :
                    <Box component="section" sx={{ mt: 5, mb: 10 }}>
                        <Grid container style={{ marginBottom: 30 }} spacing={2} justifyContent="flex-end">
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    onChange={(event, newInputValue) => handleSearchId(event, newInputValue)}
                                    name="searchString"
                                    id="combo-box-demo"
                                    options={appList}
                                    getOptionLabel={option => option.app_name}
                                    renderInput={(params) => <TextField {...params} label="Search Business App" />}
                                />
                            </Grid>
                        </Grid>
                        <Box component="section" sx={{ mt: 5, mb: 10 }}>
                            <Grid container spacing={2} rowSpacing={3}>
                                <Grid item xs={12} sm={6} >
                                    <TextField
                                        variant="outlined"
                                        name="app_name"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="Business App"
                                        onChange={handleChange}
                                        value={fromState.app_name}
                                        error={errors.app_name ? true : false}
                                        helperText={errors.app_name}
                                        onBlur={handleOnBlur}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <DivisonSelectBox name={"division"} value={fromState.division} onChange={handleChange} error={errors.division ? true : false}
                                        helperText={errors.division} onBlur={handleOnBlur} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <ConutrySelectBox name={"country"} value={fromState.country} onChange={handleChange} error={errors.country ? true : false}
                                        helperText={errors.country} onBlur={handleOnBlur} />
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                    <FormControl fullWidth error={errors.language}>
                                        <InputLabel id="demo-multiple-name-label">Languages</InputLabel>
                                        <Select
                                            labelId="demo-multiple-name-label"
                                            id="demo-multiple-name"
                                            multiple
                                            value={languesName}
                                            onChange={handleMultiSelectChange}
                                            input={<OutlinedInput label="Languages" />}
                                            MenuProps={MenuProps}
                                        >
                                            {fromState.language.length > 0 && fromState.language.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                    style={getStyles(name, languesName, theme)}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}

                                        </Select>
                                        <FormHelperText>{errors.language ? errors.language : ''}</FormHelperText>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} >
                                <Grid item xs={12} sm={6} md={4}>
                                    <Button
                                        onClick={() => handleCreate()}
                                        type="buttom"
                                        fullWidth
                                        color="success"
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        ADD
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Button
                                        onClick={() => handleUpdate()}
                                        type="button"
                                        fullWidth
                                        color="info"
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        UPDATE
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Button
                                        onClick={() => handleDelete()}
                                        type="button"
                                        fullWidth
                                        color="error"
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        DELETE
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                }
            </Box>
        </Paper>
    )
}

export default BasicFrom