import React, { useState, useEffect } from "react";

import axios from "axios";

import moment from "moment";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from 'react-paginate';

import {
  faCalendarWeek,
  faCaretLeft,
  faCaretRight,
  faCheck,
  faFilter,
  faSearch,
  faSortDown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import '../css/RequestForReturning.css'
import DatePicker from "react-datepicker";
import Header from "../components/Header";
import MenuBar from "../components/Menu";
import { format } from 'date-fns';
import RequestPopup from "../components/manage_assignment/CreateReturnPopup";
import api from "../apis/apiFetch"
import PopupError from "../components/PopupError";

const RequestForReturning = () => {
  const [displayList, setDisplayList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [filterState, setFilterState] = useState(
    "COMPLETED,WAITING_FOR_RETURN"
  );
  const [date, setDate] = useState(null);
  const [sortBy, setSortBy] = useState("assignedDate");
  const [pageNum, setPageNum] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allCheck, setAllCheck] = useState(true);
  const [completedCheck, setCompletedCheck] = useState(false);
  const [waitingForReturningCheck, setWaitingForReturningCheck] =
    useState(false);
  const [warning, setWarning] = useState(false);
  const [completeRequestPopup, setCompleteRequestPopup] = useState(false)
  const [cancelRequestPopup, setCancelRequestPopup] = useState(false)
  const [confirmRequest, setConfirmRequest] = useState()
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")

  const getRequestList = async () => {
    if (filterState.trim().length === 0) {
      setDisplayList([]);
      setTotalPage(1);
      setLoading(false);
    } else {
      let promise = getRequestForReturning(
        keyword,
        filterState,
        date,
        sortBy,
        pageNum
      );
      let finalResult = [];
      const data = (await promise).data;
      if (data === undefined) {
        finalResult = []
      } else {
        finalResult = data.data;
      }
      console.log("finalResult: ", finalResult);
      setDisplayList(finalResult);
      setTotalPage(data.totalPage);
      setLoading(false);
    }
  };

  const textTransformer = (string) => {
    let before = string.replaceAll('_', ' ')
    return (before.charAt(0).toUpperCase() + before.slice(1).toLowerCase());
  }

  //---POP UP START---
  //Open complete popup
  const handleCompleteRequest = (item) => {
    setConfirmRequest(item)
    setCompleteRequestPopup(true)
  }

  //Close complete popup
  const closeCompleteRequest = () => {
    setCompleteRequestPopup(false);
  }

  //Open cancel popup
  const handleCancelRequest = (item) => {
    setConfirmRequest(item)
    setCancelRequestPopup(true)
  }

  //Close cancel popup
  const closeCancelRequest = () => {
    setCancelRequestPopup(false);
  }

  //send request for completion
  const handleCompleteRequestAction = () => {
    const request = {
      requestId: confirmRequest.id,
      userId: localStorage.getItem("userId")
    }
    api.update("request/complete", request)
      .then(res => {
        window.location.reload();
      })
      .catch(error => {
        setCompleteRequestPopup(false)
        setErrorMessage(error.response.data.message)
        setIsError(true)
      })
  }

  const handleCancelRequestAction = () => {
    // const request = {
    const requestId = confirmRequest.id
    const userId = localStorage.getItem("userId")

    api.delete(`request/cancel/${requestId}`, { userId })
      .then(res => {
        window.location.reload();
      })
      .catch(error => {
        setCancelRequestPopup(false)
        setErrorMessage(error.response.data.message)
        setIsError(true)
      })
  }
  //---POP UP END---

  useEffect(() => {
    setLoading(true);
    getRequestList();
  }, [pageNum, filterState, sortBy, date]);

  const filterByState = (checked, value) => {
    let filterStateString = filterState.split(",")

    if (filterState === "") {
      filterStateString = []
    }

    if (checked) {
      if (value === "ALL") {
        setCompletedCheck(false);
        setWaitingForReturningCheck(false);
        filterStateString = ["COMPLETED", "WAITING_FOR_RETURN"]
        setFilterState(filterStateString.join(","))
      } else {
        setAllCheck(false)
        if (filterStateString.length === 2) {
          filterStateString = [value]
          setFilterState(...filterStateString)
        } else {
          filterStateString.push(value)
          setFilterState(filterStateString.join(","))
        }
      }
    } else {
      if (value === "ALL") {
        filterStateString = []
        setFilterState("")
      } else {
        if (filterStateString.length === 1) {
          filterStateString = []
          setFilterState("")
        } else {
          filterStateString = filterStateString.filter(item => item !== value)
          setFilterState(filterStateString.join(","))
        }
      }
    }
    setPageNum(1);
    console.log("filterStateString: ", filterStateString)
    console.log("Filter State: ", filterState)
  };


  const search = () => {
    if (keyword.split(" ").length > 100) {
    } else {
      getRequestList();
    }
  };

  const nextSlide = () => {
    if (pageNum < totalPage) {
      setPageNum(pageNum + 1);
    }
  };

  const prevSlide = () => {
    if (pageNum > 1) {
      setPageNum(pageNum - 1);
    }
  };

  const sort = (rule) => {
    setSortBy(rule);
  }

  const filterByDate = (date) => {
    if (date == null) {
      setDate(null);
    } else {
      console.log(format(date, 'yyyy-MM-dd'));
      setDate(format(date, 'yyyy-MM-dd'))
    }
    setPageNum(1);
  }


  return (
    <div>
      {
        completeRequestPopup ? <RequestPopup
          action={handleCompleteRequestAction}
          close={closeCompleteRequest}
          message='Do you want to mark this returning request as "Completed"?'
        /> : null
      }
      {
        cancelRequestPopup ? <RequestPopup
          action={handleCancelRequestAction}
          close={closeCancelRequest}
          message='Do you want to cancel this returning request?'
        /> : null
      }
      <Header />
      <div className="container">
        <div className="request-for-returning">
          <MenuBar />
          <div className="request-for-returning__content">
            <div className="request-for-returning__content__header">
              <h2>Request List</h2>
              <div className="request-for-returning__content__function">
                <div className="request-for-returning__content__function__left">
                  <div className="request-for-returning__content__function__tools">
                    <div className="request-for-returning__content__function__tools__dropdown">
                      <div className="request-for-returning__content__function__tools__dropdown__select">
                        <span className="request-for-returning__content__function__tools__dropdown__selected">
                          State
                        </span>
                      </div>
                      <div className="icon">
                        <FontAwesomeIcon icon={faFilter} />
                      </div>
                      <ul className="request-for-returning__content__function__tools__dropdown__list">
                        <li className="request-for-returning__content__function__tools__dropdown__list__item">
                          <label className="request-for-returning__content__function__tools__dropdown__list__item__name">
                            All
                            <input
                              checked={allCheck}
                              value="ALL"
                              type="checkbox"
                              onChange={(e) => {
                                filterByState(e.target.checked, e.target.value);
                                setAllCheck(!allCheck)
                              }}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </li>
                        <li className="request-for-returning__content__function__tools__dropdown__list__item">
                          <label className="request-for-returning__content__function__tools__dropdown__list__item__name">
                            Completed
                            <input
                              checked={completedCheck}
                              value="COMPLETED"
                              type="checkbox"
                              onChange={(e) => {
                                filterByState(e.target.checked, e.target.value);
                                setCompletedCheck(!completedCheck);
                              }}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </li>
                        <li className="request-for-returning__content__function__tools__dropdown__list__item">
                          <label className="request-for-returning__content__function__tools__dropdown__list__item__name">
                            Waiting for returning
                            <input
                              checked={waitingForReturningCheck}
                              value="WAITING_FOR_RETURN"
                              type="checkbox"
                              onChange={(e) => {
                                filterByState(e.target.checked, e.target.value);
                                setWaitingForReturningCheck(
                                  !waitingForReturningCheck
                                );
                              }}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </li>
                      </ul>
                    </div>
                    <div className="request-for-returning__content__function__tools__date">
                      <DatePicker isDefaultTimeInput={true} wrapperClassName="assignment-date-section" dateFormat='dd/MM/yyyy' selected={
                        Date.parse(date)} onChange={date => { filterByDate(date) }}
                        isClearable={true}
                        maxDate={new Date()}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        customInput={
                          <div className="wrap-input">
                            <input type="text" value={date === null ? "" : moment(Date.parse(date)).format(
                              "DD/MM/YYYY"
                            )} />
                            <div className="request-for-returning__content__function__tools__date__icon">
                              <FontAwesomeIcon
                                icon={faCalendarWeek}
                                size="lg"
                              />
                            </div>
                          </div>
                        }
                        disableAutoFocus={true}
                        showYearDropdown={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="request-for-returning__content__function__right">
                  <div className="request-for-returning__content__function__search">
                    <form>
                      <input
                        className="request-for-returning__content__function__search__input"
                        maxLength="100"
                        type="text"
                        onChange={(e) => setKeyword(e.target.value)}
                      />
                    </form>
                    <div className="wrap-icon" onClick={search}>
                      <FontAwesomeIcon size="lg" icon={faSearch} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="request-for-returning__content__form">
              {loading ? (
                <h2>Loading ...</h2>
              ) : (
                <table className="request-for-returning__content__form__table">
                  <thead>
                    <tr>
                      <th onClick={() => { sort('id') }}>
                        <p>
                          No. <FontAwesomeIcon icon={faSortDown} />
                        </p>
                      </th>
                      <th onClick={() => { sort('assetCode') }}>
                        <p>
                          Asset Code <FontAwesomeIcon icon={faSortDown} />
                        </p>
                      </th>
                      <th onClick={() => { sort('assetName') }} >
                        <p>
                          Asset Name <FontAwesomeIcon icon={faSortDown} />
                        </p>
                      </th>
                      <th onClick={() => { sort('requestBy') }}>
                        <p>
                          Requested by <FontAwesomeIcon icon={faSortDown} />
                        </p>
                      </th>
                      <th onClick={() => { sort('assignedDate') }}>
                        <p>
                          Assigned Date <FontAwesomeIcon icon={faSortDown} />
                        </p>
                      </th>
                      <th onClick={() => { sort('acceptedBy') }}>
                        <p>
                          Accepted by <FontAwesomeIcon icon={faSortDown} />
                        </p>
                      </th>
                      <th onClick={() => { sort('returnedDate') }}>
                        <p>
                          Returned Date <FontAwesomeIcon icon={faSortDown} />
                        </p>
                      </th>
                      <th onClick={() => { sort('state') }}>
                        <p>
                          State <FontAwesomeIcon icon={faSortDown} />
                        </p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayList.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <p>{item.id}</p>
                        </td>
                        <td className="colName">
                          <p>{item.assetCode}</p>
                        </td>
                        <td>
                          <p>{item.assetName}</p>
                        </td>
                        <td>
                          <p>{item.requester}</p>
                        </td>
                        <td>
                          <p>
                            {moment(Date.parse(item.assignedDate)).format(
                              "DD/MM/YYYY"
                            )}
                          </p>
                        </td>
                        <td>
                          <p>{item.accepter}</p>
                        </td>
                        <td>
                          <p>
                            {item.returnedDate === null
                              ? " "
                              : moment(Date.parse(item.returnedDate)).format(
                                "DD/MM/YYYY"
                              )}
                          </p>
                        </td>
                        <td>
                          <p className="capitalizePara">{item.state === 'WAITING_FOR_RETURN' ? 'Wating for returning' : textTransformer(item.state)}</p>
                        </td>
                        <td>
                          <button
                            style={{ border: "none" }}
                            onClick={() => handleCompleteRequest(item)}
                            className={item.state !== 'COMPLETED' ? "btn" : "btn disable"}
                            disabled={item.state === 'COMPLETED'}>
                            <FontAwesomeIcon
                              icon={faCheck}
                              color="#E30F1B"
                            />
                          </button>
                        </td>
                        <td>
                          <button
                            style={{ border: "none" }}
                            onClick={() => handleCancelRequest(item)}
                            className={item.state !== 'COMPLETED' ? "btn" : "btn disable"}
                            disabled={item.state === 'COMPLETED'}>
                            <FontAwesomeIcon
                              icon={faTimes}
                              color="#000000"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="request-for-returning__content__pagination">
              <ReactPaginate
                onPageChange={(event) => {
                  console.log(event.selected);
                  setPageNum(event.selected + 1);
                }}
                nextLabel={
                  <button className={pageNum + 1 > totalPage ? "btn btn_next disable" : "btn btn_next"}
                    disabled={pageNum + 1 > totalPage ? true : false}
                    onClick={() => nextSlide()}><p>Next</p></button>}
                previousLabel={
                  <button className={pageNum > 1 ? "btn btn_previous" : "btn btn_previous disable"}
                    disabled={pageNum > 1 ? false : true}
                    onClick={() => prevSlide()}><p>Previous</p></button>}
                pageRangeDisplayed={5}
                pageCount={totalPage}
                initialPage={0}
                activePage={pageNum - 1}
                pageClassName="page_number"
                activeClassName="active"
                renderOnZeroPageCount={null}
                className="pagination-list"
                disabledClassName="disable"
                hideNavigation={true}
              />
            </div>
          </div>
        </div>
      </div>
      {isError ? <PopupError close={(e) => {
        setIsError(!isError);
        window.location.reload()
      }} message={errorMessage}></PopupError> : <></>}
    </div>
  );
};

const getRequestForReturning = (
  keyword,
  filterState,
  date,
  sortBy,
  pageNum
) => {
  let url = "https://assetmanagementrookies03.azurewebsites.net/api/v1/request";
  const response = axios
    .get(url, {
      headers: { Authorization: localStorage.getItem("jwt") },
      params: {
        locationId: localStorage.getItem("locationId"),
        keyword: keyword,
        filterState: filterState,
        returnedDate: date,
        sortBy: sortBy,
        pageNum: pageNum,
      },
    })
    .catch((err) => {
      console.log("Err", err);
    });
  return response;
};

export default RequestForReturning;
