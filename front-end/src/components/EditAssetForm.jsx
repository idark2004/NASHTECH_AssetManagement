import React, { useState, useRef } from "react";
import { Button, Form, Header, Icon, Dropdown } from "semantic-ui-react";
import AuthService from "../services/authService";
import { createBrowserHistory } from "history";
import { Controller, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import ErrorHandler from "../utils/errorHandler";
import { useHistory } from "react-router-dom"
import Headers from "./Header";
import Menu from './Menu'
import store from '../store/store'
import { LOAD_NEW_ASSET } from '../actions/actionConstants'
import api from "../apis/apiFetch"
import moment from 'moment'

export const customHistory = createBrowserHistory();

const assetNameRegex = /^([a-zA-Záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđ0-9]+\s*)*[a-zA-Záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđ0-9]+$/i;

const EditAssetForm = (props) => {
    let history = useHistory();

    //if no props avail -> redirect to create new asset
    let asset = {};
    try {
        asset = props.location.state.asset;
        console.log(asset)
    }
    catch (err) {
        history.push("/admin/asset/new");
    }

    const defaultValues = {
        assetCode: asset.assetCode,
        assetName: asset.assetName,
        specification: asset.specification,
        installedDate: moment(asset.installedDate).toDate(),
        state: asset.state,
        category: asset.categoryName,
    }

    const {
        control,
        register,
        handleSubmit,
        setError,
        formState: { errors, dirtyFields },
    } = useForm({
        defaultValues: defaultValues
    });

    const [assetState, setAssetState] = useState(defaultValues.state)
    const [assetName, setAssetName] = useState(defaultValues.assetName)
    const [specification, setSpecification] = useState(defaultValues.specification)
    const [installedDate, setInstalledDate] = useState()

    const handleCancel = (e) => {
        e.preventDefault();
        customHistory.push("/admin/asset");
        window.location.reload();
    }

    const handleAssetStateChange = ({ target }) => {
        setAssetState(target.value)
    };

    const handleAssetNameChange = ({ target }) => {
        setAssetName(target.value)
    }

    const handleSpecificationChange = ({ target }) => {
        setSpecification(target.value)
    }

    const convertDateToUTC = (date) => {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
            date.getUTCHours() + 14, date.getUTCMinutes(), date.getUTCSeconds());
    }

    const handleEditReq = (input) => {
        const editedAsset = {
            assetCode: defaultValues.assetCode,
            assetName: input.assetName,
            specification: specification,
            installedDate: convertDateToUTC(input.installedDate),
            state: input.state,
        }
        console.log(editedAsset)
        api.update('asset/edit', editedAsset).then(
            (response) => {
                console.log(response)
                store.dispatch({ type: LOAD_NEW_ASSET, payload: response });
                history.push({
                    pathname: '/admin/asset'
                })
            }
        );
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
                <div style={{ width: "100%", paddingTop: "4%" }}>
                    <Form
                        onSubmit={handleSubmit(handleEditReq)}
                        style={{
                            width: "40%",
                            height: "40%",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <h2 style={{ color: "red" }}>Edit Asset</h2>

                        <Form.Field inline>
                            <label
                                htmlFor="name"
                                style={{ width: "20%" }}
                            >
                                Name</label>
                            <input
                                {...register("assetName", {
                                    required: "Name is required!",
                                    pattern: { value: assetNameRegex, message: "Name must contain only characters, numbers and whitespaces in between!" }
                                })}
                                style={{
                                    borderRadius: "0.28571429rem",
                                    border: errors.assetName ? '2px solid red' : '',
                                    width: "70%"
                                }}
                                type="text"
                                name="assetName"
                                maxLength="100"
                                onChange={handleAssetNameChange}
                                defaultValue={defaultValues.assetName}
                            /><br />
                            {errors.assetName && <p style={{ color: "red" }}>{errors.assetName.message}</p>}
                        </Form.Field>

                        <Form.Field inline>
                            <label
                                htmlFor="category"
                                style={{
                                    width: "20%"
                                }}
                            >Category</label>
                            <select
                                disabled
                                className="ui fluid selection dropdown"
                                style={{ width: "70%" }}
                            >
                                <option selected>{defaultValues.category}</option>
                            </select>
                        </Form.Field>

                        <Form.Field inline>
                            <label
                                htmlFor="specification"
                                style={{ width: "20%" }}
                            >
                                Specification</label>
                            <textarea
                                style={{
                                    width: "70%"
                                }}
                                maxLength="400"
                                type="text"
                                name="specification"
                                onChange={handleSpecificationChange}
                                defaultValue={defaultValues.specification}
                            ></textarea><br />
                        </Form.Field>

                        <Form.Field inline readOnly>
                            <label htmlFor="installedDate" style={{ width: "20%" }}>Installed Date</label>
                            <div style={{
                                borderRadius: "0.28571429rem",
                                border: errors.installedDate ? '2px solid red' : '',
                                width: "70%",
                                display: "inline-block"
                            }}>
                                <Controller
                                    rules={{
                                        required: "Installed date is required!",
                                        validate: { value: date => date < new Date() || "Installed Date is the future day. Please select a different date!" }
                                    }}
                                    control={control}
                                    name='installedDate'
                                    defaultValue={defaultValues.installedDate}
                                    render={({ field }) => (
                                        <div>
                                            <DatePicker
                                                dateFormat='dd/MM/yyyy'
                                                onChange={(date) => {
                                                    field.onChange(date)
                                                    setInstalledDate(date)
                                                }}
                                                selected={field.value}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            {errors.installedDate && <p style={{ color: "red" }}>{errors.installedDate.message}</p>}
                        </Form.Field>

                        <Form.Field inline>
                            <label
                                htmlFor="state"
                                style={{ width: "20%" }}
                            >State</label>
                            <div id="state" style={{ width: "70%" }}>
                                <input
                                    onClick={handleAssetStateChange}
                                    checked={assetState === "AVAILABLE"}
                                    {...register("state")}
                                    type="radio"
                                    value="AVAILABLE"
                                    style={{ marginRight: 10, marginLeft: 156 }}
                                />Available
                                <br />
                                <input
                                    onClick={handleAssetStateChange}
                                    checked={assetState === "NOT_AVAILABLE"}
                                    {...register("state")}
                                    type="radio"
                                    value="NOT_AVAILABLE"
                                    style={{ marginRight: 10, marginLeft: 156 }}
                                />Not available
                                <br />
                                <input
                                    onClick={handleAssetStateChange}
                                    checked={assetState === "WAITING_FOR_RECYCLING"}
                                    {...register("state")}
                                    type="radio"
                                    value="WAITING_FOR_RECYCLING"
                                    style={{ marginRight: 10, marginLeft: 156 }}
                                />Waiting for recycling
                                <br />
                                <input
                                    onClick={handleAssetStateChange}
                                    checked={assetState === "RECYCLED"}
                                    {...register("state")}
                                    type="radio"
                                    value="RECYCLED"
                                    style={{ marginRight: 10, marginLeft: 156 }}
                                />Recycled
                            </div>
                        </Form.Field>

                        <Button type="submit" color="red" button
                            disabled={assetName === "" || installedDate === null || specification === ""}>
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

export default EditAssetForm;
