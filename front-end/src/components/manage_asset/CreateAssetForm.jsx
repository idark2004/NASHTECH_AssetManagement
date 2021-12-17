import React, { useState, useRef, useEffect } from "react";
import { Button, Form, Header, Icon, Dropdown } from "semantic-ui-react";
import { createBrowserHistory } from "history";
import { Controller, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
// import ErrorHandler from "../utils/errorHandler";
import { useHistory } from "react-router-dom"
import Headers from "../Header";
import Menu from '../Menu'
import CustomDropdown from "../CustomDropdown";
import api from '../../apis/apiFetch';
import store from '../../store/store';
import { LOAD_NEW_ASSET } from '../../actions/actionConstants';
import '../../App.css'


export const customHistory = createBrowserHistory();

const unicodeRegex = /^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/i;

const CreateAssetForm = () => {
    let history = useHistory();
    //if not logged in -> redirect to login
    if (!localStorage.hasOwnProperty("fullName") || localStorage.getItem("fullName") === "") {
        history.push("/login");
    }
    const {
        control,
        register,
        handleSubmit,
        setError,
        formState: { errors, dirtyFields },
    } = useForm({
        defaultValues: {
            assetName: "",
            prefix: "",
            specification: "",
            installedDate: "",
            state: "AVAILABLE",
        }
    });

    const [state, setState] = useState("AVAILABLE")
    const [categoryList, setCategoryList] = useState([{ prefix: '', name: '' }])
    const [selectedCategory, setSelectedCategory] = useState();
    const [newCategory, setNewCategory] = useState({});
    const [installedDate, setInstalledDate] = useState();

    const handleCancel = (e) => {
        e.preventDefault();
        customHistory.push("/admin/asset");
        window.location.reload();
    }

    useEffect(() => {
        async function getCategoryList() {
            await api.list('category')
                .then(response => setCategoryList(response))
        }
        getCategoryList();
    }, []);

    useEffect(() => {
        async function getCategoryList() {
            await api.list('category')
                .then(response => setCategoryList(response))
        }
        getCategoryList();
    }, [newCategory]);

    const convertDateToUTC = (date) => {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
            date.getUTCHours() + 14, date.getUTCMinutes(), date.getUTCSeconds());
    }

    const handleCreateAsset = (input) => {

        // "name":"Dareu Mouse",
        // "prefix":"DM",
        // "specification": "Chuột không dây thời trang",
        // "installedDate": "2021-11-30T07:58:06.185Z",
        // "state": "AVAILABLE",
        // "locationId": 1

        let newAsset = {
            name: input.assetName,
            prefix: selectedCategory.prefix,
            specification: input.specification,
            installedDate: convertDateToUTC(input.installedDate),
            state: input.state,
            locationId: localStorage.getItem("locationId")
        };

        console.log(newAsset);
        api.create("asset/new", newAsset)
            .then(response => {
                store.dispatch({ type: LOAD_NEW_ASSET, payload: response });
                history.push({
                    pathname: '/admin/asset'
                })
            })
            .catch(error => console.log(error));
    };

    const handleStateChange = ({ target }) => {
        setState(target.value)
    };

    return (
        <div>
            <div>
                <Headers />
            </div>
            <div style={{ display: "flex", flexDirection: "row", padding: "3em" }}>
                <div>
                    <Menu />
                </div>
                <div style={{ width: "100%", paddingTop: "8%" }}>
                    <Form
                        onSubmit={handleSubmit(handleCreateAsset)}
                        style={{
                            width: "40%",
                            height: "40%",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <h2 style={{ color: "red" }}>Create New Asset</h2>

                        {/* Asset Name */}
                        <Form.Field inline>
                            <label
                                htmlFor="assetName"
                                style={{ width: "20%" }}
                            >Name</label>
                            <input
                                maxlength="100"
                                {...register("assetName", {
                                    required: "Name is required!",
                                    pattern: { value: unicodeRegex, message: "Name must contain only characters, numbers and whitespaces in between!" }
                                })}
                                style={{
                                    width: "70%",
                                    border: errors.assetName ? '2px solid red' : ''
                                }}
                                type="text"
                                name="assetName"
                            /><br />
                            {errors.assetName && <p style={{ color: "red" }}>{errors.assetName.message}</p>}
                        </Form.Field>

                        {/* Category */}
                        <Form.Field inline className="field-category">
                            <label
                                htmlFor="category"
                                style={{
                                    width: "20%",
                                    float: "left"
                                }}
                            >Category</label>

                            <CustomDropdown items={categoryList} setSelectedCategory={setSelectedCategory} setNewCategory={setNewCategory} />
                            {errors.category && <p style={{ color: "red" }}>{errors.category.message}</p>}
                        </Form.Field>

                        {/* Specification  */}
                        <Form.Field inline>
                            <label
                                htmlFor="specification"
                                style={{ width: "20%" }}
                            >
                                Specification</label>
                            <textarea
                                maxlength="400"
                                {...register("specification", {
                                    required: "Asset Specification is required!",
                                })}
                                style={{
                                    width: "70%",
                                    border: errors.specification ? '2px solid red' : ''
                                }}
                                type="text"
                                name="specification"
                            ></textarea> <br />
                            {errors.specification && <p style={{ color: "red" }}>{errors.specification.message}</p>}
                        </Form.Field>

                        {/* Installed date */}
                        <Form.Field inline readOnly>
                            <label
                                htmlFor="installedDate"
                                style={{ width: "20%" }}
                            >Installed Date</label>
                            <div style={{
                                borderRadius: "0.28571429rem",
                                border: errors.installedDate ? '2px solid red' : '',
                                width: "70%",
                                display: "inline-block"
                            }}>
                                <Controller
                                    rules={{
                                        required: "Installed Date is required!",
                                        validate: value => value < new Date()
                                    }}
                                    control={control}
                                    name='installedDate'
                                    render={({ field }) => (
                                        <DatePicker
                                            dateFormat='dd/MM/yyyy'
                                            onChange={(date) => {
                                                field.onChange(date);
                                                setInstalledDate(date);

                                            }}
                                            selected={field.value}
                                        />
                                    )}
                                />
                            </div>
                            {errors.installedDate && <p style={{ color: "red" }}>Installed Date is the future day. Please select a different date</p>}
                        </Form.Field>

                        {/* State */}
                        <Form.Field inline id='state-input'>
                            <label
                                htmlFor="state"
                                style={{ width: "20%" }}
                            >State</label>
                            <div id="available"><input
                                onClick={handleStateChange}
                                checked={state === "AVAILABLE"}
                                {...register("state")}
                                type="radio"
                                value="AVAILABLE"
                            />Available</div>
                            <div id='not-available'><input
                                onClick={handleStateChange}
                                checked={state === "NOT_AVAILABLE"}
                                {...register("state")}
                                type="radio"
                                value="NOT_AVAILABLE"
                            />Not available</div>
                        </Form.Field>

                        <Button type="submit" color="red" button disabled={(selectedCategory === undefined) || (Object.keys(dirtyFields).length < 3 || dirtyFields.hasOwnProperty('state')) && (Object.keys(dirtyFields).length < 4)}>
                            Save
                        </Button>
                        <Button basic color="black" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default CreateAssetForm;
