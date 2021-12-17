import React, { useState } from 'react'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import '../../css/ManageAssigment.css'
import { DateRangePicker, DateRange } from 'react-date-range';
import ReactDatePicker from 'react-datepicker';
export default function DatePopup() {
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);


    return (
        <div className="popupdate">
            <div className="popupdate_header">
                <div className="popupdate_from_date"></div>
                <div className="popupdate_to_date"></div>
            </div>
            <div className="popupdate_content">
                {/* <DateRangePicker
                    editableDateInputs={true}
                    onChange={item => setRange([item.selection])}
                    moveRangeOnFirstSelection={true}
                    ranges={range}
                /> */}
                <ReactDatePicker />
            </div>
        </div>
    )
}
