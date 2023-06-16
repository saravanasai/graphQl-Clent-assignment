
import { Autocomplete, Box, Button, Grid, Paper, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useQuery, gql } from '@apollo/client';
import axios from 'axios';
import DivisonSelectBox from '../Inputs/DivisonSelectBox';
import ConutrySelectBox from '../Inputs/ConutrySelectBox';
import { toast } from 'react-toastify';

const BasicFrom = () => {


    const [fromState, setFormState] = useState({
        searchId: 0,
        searchString: "",
        app_name: "",
        division: 0,
        country: "",
        language: ""
    })

    const [errors, setErrors] = useState({
        app_name: "",
        division: 0,
        country: "",
    })

    const GET_LANGUAGE = gql`
    query {
        language(code:"${fromState.country}"){
            name,
            code
        }
      }
    `;

    const [appList, setAppList] = useState([])
    const [fetch, setFetch] = useState(true)
    const [isLoading, setisLoading] = useState(true)
    const { refetch } = useQuery(GET_LANGUAGE);





  


    const validateInputs = () => {

        const errors = {};
        console.log(!( /^[A-Za-z0-9_-]*$$/i.test(fromState.app_name)))
        if (!fromState.app_name) {
            errors.app_name = "Required";
        } else if (
           !( /^[A-Za-z0-9_-]*$$/i.test(fromState.app_name))
          ) {
            errors.app_name = 'Invalid Application name    ';
          }

        if (!fromState.division) {
            errors.division = "Required";
        }

        if (!fromState.country) {
            errors.country = "Required";
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
            language(code:"${fromState.country}"){
                name,
                code
            }
        }
        `;

        const { data } = await refetch(GET_LANGUAGE, GET_LANGUAGE_REFETCH)

        if (data.language) {
            setFormState(prev => {
                return { ...prev, language: data.language.name }
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
                                        helperText={errors.division}  onBlur={handleOnBlur} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <ConutrySelectBox name={"country"} value={fromState.country} onChange={handleChange} error={errors.country ? true : false}
                                        helperText={errors.country}  onBlur={handleOnBlur} />
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                    <TextField
                                        variant="outlined"
                                        value={fromState.language}
                                        name="laguuage"
                                        fullWidth
                                        id="language"
                                        label="Language"
                                        disabled
                                    />
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