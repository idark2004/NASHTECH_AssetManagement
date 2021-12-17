import { React, useState, useEffect } from "react";
import { useHistory } from "react-router";
import Headers from "../../components/Header";
import Menu from "../../components/Menu";
import { Button, Form } from "semantic-ui-react";
import { Controller, set, useForm } from "react-hook-form";
import api from "../../apis/apiFetch";
import DatePicker from "react-datepicker";
import moment from "moment";
import { connect } from "react-redux";
import "./EditFormStyle.css";
import PopupError from "../PopupError"
function EditAssignment(props) {
  let history = useHistory();
  let location = localStorage.getItem("locationId");

  useEffect(() => {
    if (props.location.state !== undefined && props.location.state !== null) {
      let oldAssignment = props.location.state.assignment
      setAssignment(oldAssignment)
      setUserId(props.location.state.userId)
      setAssCode(oldAssignment.assetCode)
      setNote(oldAssignment.note)
      setLoading(false)
      setAsssignedDate(moment(oldAssignment.assignedDate).toDate())
      defaultAsset.key = oldAssignment.assetCode;
      defaultAsset.value = oldAssignment.assetCode;
      defaultAsset.text = oldAssignment.assetCode + " " + oldAssignment.assetName;
      console.log(assignment)
    }
    else {
      getAssignmentInfo(props.match.params.id);
      console.log(assignment)
    }
  }, [])

  const [assignment, setAssignment] = useState({});
  const [note, setNote] = useState(assignment.note);
  const [assignedDate, setAsssignedDate] = useState(
    moment(assignment.assignedDate).toDate()
  );
  const [assetDrop, setAssetDrop] = useState([]);
  const [userDrop, setUserDrop] = useState([]);
  const [assCode, setAssCode] = useState(assignment.assetCode);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true)

  const getAssignmentInfo = async (assignmentId) => {
      const response = await api
          .list(`assignment/info/${assignmentId}`)
          .then((res) => res);
      console.log(response)
      setAssignment(response)
      setUserId(response.assigneeId)
      setNote(response.note)
      setAssCode(response.assetCode)
      setAsssignedDate(moment(response.assignedDate).toDate())
      defaultAsset.key = response.assetCode;
      defaultAsset.value = response.assetCode;
      defaultAsset.text = response.assetCode + " " + response.assetName;
      setLoading(false)
      return response;
  };

  /*---USE FORM---*/
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: assignment,
  });

  const defaultAsset = {
    key: assignment.assetCode,
    value: assignment.assetCode,
    text: assignment.assetCode + " " + assignment.assetName,
  };

  //--- START OF DROPDOWN---
  useEffect(() => {
    //get user dropdown
    const tempUserList = []
    api.list(`user/available/${location}`).then((res) => {
      res.map((data) => {
        let user = {
          key: data.userId,
          value: data.userId,
          text: data.userId + " " + data.fullName,
        };
        tempUserList.push(user);

      });
      setUserDrop(tempUserList);
    });

    const tempAssetList = []
    tempAssetList.push(defaultAsset);
    api.list(`asset/available/${location}`).then((res) => {
      res.map((data) => {
        let asset = {
          key: data.assetCode,
          value: data.assetCode,
          text: data.assetCode + " " + data.assetName,
        };
        tempAssetList.push(asset);

      });
      setAssetDrop(tempAssetList);
    });
  }, []);
  /*--- END OF DROPDOWN---*/

  const convertDateToUTC = (date) => {
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours() + 14,
      date.getUTCMinutes(),
      date.getUTCSeconds()
    )
  }
    
  /*get value */
  const handleAssetDropdown = (event, data) => {
    setAssCode(data.value);
  };
  const handleUserDropdown = (event, data) => {
    setUserId(data.value);
  };
  const handleNoteChange = ({ target }) => {
    console.log(target.value)
    setNote(target.value);
  };

  const handleSumbitEdit = (input) => {
      const editedAssignment = {
          assetCode: assCode,
          assignerId: localStorage.getItem("userId"),
          assigneeId: userId,
          assignedDate: convertDateToUTC(assignedDate),
          assignmentId: assignment.id,
          note: note,
      };
      console.log(editedAssignment);
      api.update("assignment", editedAssignment).then((response) => {
          console.log(response);
          props.onCreateSuccess(response);
          history.push({
              pathname: "/admin/assignment",
            });
        })
        .catch((error) => {
          setErrorMessage(error.response.data.message)
          setIsError(true)
        });
    };
 
    // useEffect(() => {
    //     const searchInputs = document.querySelectorAll("input");
    //     //user input field
    //     searchInputs[0].setAttribute("maxlength", "70");
    //     //asset input field
    //     searchInputs[1].setAttribute("maxlength", "100");
    // }, []);

    return (
        <div>
            <Headers />
            <div className="container">
                <div className="edit-assignment">
                    <Menu />
                    <div className="edit-assignment__content">
                        <div className="edit-assignment__content__header">
                            <h2>Edit Assignment</h2>
                        </div>
                        {loading ? <h2>Loading...</h2> :
                          <div className="edit-assignment__content__form">
                              <Form onSubmit={handleSubmit(handleSumbitEdit)}>
                                  <Form.Field inline>
                                      <label
                                          className="inline__label"
                                          htmlFor="assignee"
                                      >
                                          User
                                      </label>
                                      {console.log(userId)}
                                      <Form.Dropdown
                                          name="assignee"
                                          defaultValue={userId}
                                          fluid
                                          search
                                          selection
                                          options={userDrop}
                                          onChange={handleUserDropdown}
                                      />
                                  </Form.Field>

                                  <Form.Field inline>
                                      <label
                                          className="inline__label"
                                          htmlFor="assetCode"
                                      >
                                          Asset
                                      </label>

                                      <Form.Dropdown
                                          name="assetCode"
                                          defaultValue={
                                              assignment.assetCode
                                          }
                                          fluid
                                          search
                                          selection
                                          options={assetDrop}
                                          onChange={handleAssetDropdown}
                                      />
                                  </Form.Field>

                                  <Form.Field inline>
                                      <label
                                          className="inline__label"
                                          htmlFor="assigned"
                                      >
                                          Assigned Date
                                      </label>
                                      <div
                                          style={{
                                              border: errors.assigned
                                                  ? "2px solid red"
                                                  : "",
                                          }}
                                      >
                                          <Controller
                                            control={control}
                                            name="assigned"
                                            defaultValue={moment(assignment.assignedDate).toDate()}
                                            render={({ field }) => (
                                              <DatePicker
                                                dateFormat="dd/MM/yyyy"
                                                minDate={new Date()}
                                                onChange={(date) => {
                                                  field.onChange(date);
                                                  setAsssignedDate(date);
                                              }}
                                                selected={field.value}
                                              />
                                            )}
                                          />
                                      </div>
                                  </Form.Field>

                                  <Form.Field inline>
                                      <label
                                          className="inline__label"
                                          htmlFor="specification"
                                      >
                                          Note
                                      </label>
                                      <textarea
                                          className="note"
                                          maxLength="400"
                                          type="text"
                                          name="specification"
                                          onChange={handleNoteChange}
                                          defaultValue={assignment.note}
                                      ></textarea>
                                  </Form.Field>
                                  <div className="ui__button">
                                  <Button
                                    id="save"
                                    type="submit"
                                    button
                                    disabled={assignedDate === null}
                                  >
                                    Save
                                  </Button>
                                      <Button
                                          id="cancel"
                                          basic
                                          onClick={() => {
                                              history.push(
                                                  "/admin/assignment"
                                              );
                                          }}
                                      >
                                          Cancel
                                      </Button>
                                  </div>
                              </Form>
                          </div>
                        }
                    </div>
                </div>
            </div>
            {isError ? <PopupError close={(e) => { setIsError(!isError) }} message={errorMessage}></PopupError> : <></>}
        </div>
  );
}

const mapDispatchToProps = (dispatch) => {
    return {
        onCreateSuccess: (newAssignment) => {
            console.log(newAssignment);
            dispatch({
                type: "LOAD_NEW_CREATE_ASSIGNMENT",
                payload: newAssignment,
            });
        },
    };
};
export default connect(null, mapDispatchToProps)(EditAssignment);
