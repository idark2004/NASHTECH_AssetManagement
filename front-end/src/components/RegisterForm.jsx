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
import { LOAD_NEW_USER, LOAD_NEW_FILTER_RULE } from '../actions/actionConstantv2'
import moment from "moment";

export const customHistory = createBrowserHistory();

const unicodeRegex = /^([a-zA-Záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđ]+\s*)*[a-zA-Záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđ]+$/i;

const RegisterForm = () => {
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
        mode: "onChange",
        defaultValues: {
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            gender: "",
            joinDate: "",
            roleId: ""
        }
    });

    const [gender, setGender] = useState("FEMALE")

    const validateDOB = (inputDOB) => {
        console.log(inputDOB);
        //cal the diff between the cur date vs the DOB (millisecs)
        const currentDate = moment(new Date());
        const dateOfBirth = moment(inputDOB);
        const age = currentDate.diff(dateOfBirth, "years");
        //return err if age < 18
        if (age < 18) {
            setError("dateOfBirth", {
                type: "manual",
                message: "User is under 18. Please select a different date!",
            })
            return false;
        }
        return true;
    }

    const validateJoinDate = (inputJoinDate, inputDOB) => {
        //cal the diff between the join date and DOB (millisecs)
        let diff = new Date(inputJoinDate).getTime() - new Date(inputDOB).getTime();
        //return err diff < 0
        if (diff < 0) {
            setError("joinDate", {
                type: "manual",
                message: "Joined date is not later than Date of Birth. Please select a different date!",
            })
            return false;
        }
        //check if joined date is Sat/Sun (6/0)
        //if true => err
        if (inputJoinDate.getDay() === 6 || inputJoinDate.getDay() === 0) {
            setError("joinDate", {
                type: "manual",
                message: "Joined date is Saturday or Sunday. Please select a different date!",
            }
            )
            return false;
        }
        return true;
    }

    const handleCancel = (e) => {
        e.preventDefault();
        customHistory.push("/admin/user");
        window.location.reload();
    }

    const handleGenderChange = ({ target }) => {
        setGender(target.value)
    };

    const convertDateToUTC = (date) => {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
            date.getUTCHours() + 14, date.getUTCMinutes(), date.getUTCSeconds());
    }


    const handleRegister = (input) => {
        if (!validateDOB(input.dateOfBirth)) return;
        if (!validateJoinDate(input.joinDate, input.dateOfBirth)) return;
        AuthService.register(
            input.firstName,
            input.lastName,
            convertDateToUTC(input.dateOfBirth),
            input.gender,
            convertDateToUTC(input.joinDate),
            input.roleId,
        ).then(
            (response) => {
                store.dispatch({ type: LOAD_NEW_USER, payload: response });
                store.dispatch({ type: LOAD_NEW_FILTER_RULE, payload: ["ALL"] });
                history.push({
                    pathname: '/admin/user'
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
                <div style={{ width: "100%", paddingTop: "8%" }}>
                    <Form
                        onSubmit={
                            handleSubmit(handleRegister)
                        }
                        style={{
                            width: "40%",
                            height: "40%",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <h2 style={{ color: "red" }}>Create New User</h2>

                        <Form.Field inline>
                            <label
                                htmlFor="firstname"
                                style={{ width: "20%" }}
                            >
                                First name</label>
                            <input
                                maxlength="25"
                                {...register("firstName", {
                                    required: "First name is required!",
                                    pattern: { value: unicodeRegex, message: "First name must contains only characters and whitespaces in between!" }
                                })}
                                style={{
                                    width: "70%",
                                    border: errors.firstName ? '2px solid red' : ''
                                }}
                                type="text"
                                name="firstName"
                            /><br />
                            {errors.firstName && <p style={{ color: "red" }}>{errors.firstName.message}</p>}
                        </Form.Field>

                        <Form.Field inline>
                            <label
                                htmlFor="lastname"
                                style={{ width: "20%" }}
                            >Last Name</label>
                            <input
                                maxlength="25"
                                {...register("lastName", {
                                    required: "Last name is required!",
                                    pattern: { value: unicodeRegex, message: "Last name must contains only characters and whitespaces in between!" }
                                })}
                                style={{
                                    width: "70%",
                                    border: errors.lastName ? '2px solid red' : ''
                                }}
                                type="text"
                                name="lastName"
                            /><br />
                            {errors.lastName && <p style={{ color: "red" }}>{errors.lastName.message}</p>}
                        </Form.Field>

                        <Form.Field inline readOnly>
                            <label
                                htmlFor="dateOfBirth"
                                style={{ width: "20%" }}
                            >Date of Birth</label>
                            <div style={{
                                borderRadius: "0.28571429rem",
                                border: errors.dateOfBirth ? '2px solid red' : '',
                                width: "70%",
                                display: "inline-block"
                            }}>
                                <Controller
                                    rules={{ required: "Date of birth is required!" }}
                                    control={control}
                                    name='dateOfBirth'
                                    render={({ field }) => (
                                        <DatePicker
                                            dateFormat='dd/MM/yyyy'
                                            onChange={(date) => field.onChange(date)}
                                            selected={field.value}
                                        />
                                    )}
                                />
                            </div>
                            {errors.dateOfBirth && <p style={{ color: "red" }}>{errors.dateOfBirth.message}</p>}
                        </Form.Field>

                        <Form.Field inline>
                            <label
                                htmlFor="gender"
                                style={{ width: "20%" }}
                            >Gender</label>
                            <input
                                onClick={handleGenderChange}
                                checked={gender === "MALE"}
                                {...register("gender", { required: "Gender is required!" })}
                                type="radio"
                                value="MALE"
                                style={{ marginRight: 10, marginLeft: 50 }}
                            />Male
                            <input
                                onClick={handleGenderChange}
                                checked={gender === "FEMALE"}
                                {...register("gender", { required: "Gender is required!" })}
                                type="radio"
                                value="FEMALE"
                                style={{ marginRight: 10, marginLeft: 50 }}
                            />Female
                            {errors.gender && <p style={{ color: "red" }}>{errors.gender.message}</p>}
                        </Form.Field>

                        <Form.Field inline readOnly>
                            <label htmlFor="joinedDate" style={{ width: "20%" }}>Joined Date</label>
                            <div style={{
                                borderRadius: "0.28571429rem",
                                border: errors.joinDate ? '2px solid red' : '',
                                width: "70%",
                                display: "inline-block"
                            }}>
                                <Controller
                                    rules={{ required: "Joined date is required!" }}
                                    control={control}
                                    name='joinDate'
                                    render={({ field }) => (
                                        <div>
                                            <DatePicker
                                                dateFormat='dd/MM/yyyy'
                                                onChange={(date) => field.onChange(date)}
                                                selected={field.value}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            {errors.joinDate && <p style={{ color: "red" }}>{errors.joinDate.message}</p>}
                        </Form.Field>

                        <Form.Field inline>
                            <label
                                htmlFor="type"
                                style={{
                                    width: "20%",
                                    float: "left"
                                }}
                            >Type</label>
                            <select
                                className="ui fluid selection dropdown"
                                {...register("roleId", { required: "Type is required!" })}
                                style={{ width: "70%" }}
                            >
                                <option hidden selected></option>
                                <option
                                    value="2"
                                >Staff</option>
                                <option
                                    value="1"
                                >Admin</option>
                            </select>
                            {errors.roleId && <p style={{ color: "red" }}>{errors.roleId.message}</p>}
                        </Form.Field>
                        <Button type="submit" color="red" button disabled={(Object.keys(dirtyFields).length < 5 || dirtyFields.hasOwnProperty('gender')) && (Object.keys(dirtyFields).length < 6)}>
                            Save
                        </Button>
                        <Button basic color="black" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Form>
                </div>
            </div>
        </div >
    );
};

export default RegisterForm;
