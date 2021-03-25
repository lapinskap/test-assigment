/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import {
  Card, CardBody, CardTitle, Row, CustomInput,
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import { weeklyAppointments, searchRange } from './consts';
import {
  createHourSlots, createDateListToCheck, createFreeDateSlots, excludeCurrentAppointments,
}
  from './utils';

export const findFreeTimeslots = () => {
  const datesToCheck = createDateListToCheck(searchRange);
  const hourSlots = createHourSlots();
  // create time slots for each day in a list
  const AllTimeSlots = [];
  for (let i = 0; i < datesToCheck.length; i++) {
    AllTimeSlots.push(createFreeDateSlots(datesToCheck[i], hourSlots));
  }
  // exclude slots
  const FreeTimeSlots = excludeCurrentAppointments(AllTimeSlots, weeklyAppointments);

  // update input state
  return FreeTimeSlots;
};

export default function Main() {
  const [selectedDate, setSelectedDate] = useState([]);
  const [freeTimeSlots, updateFreeTimeSlots] = useState([]);

  const onChangeDate = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    updateFreeTimeSlots(findFreeTimeslots());
  }, []);

  return (
    <>
      <Card>
        <CardTitle className="col-sm-12 m-3">New appointment</CardTitle>
        <CardBody className="col-sm-12 ml-3">
          <p>Select date:</p>
          <Row>
            <DatePicker onChange={(date) => onChangeDate(date)} />
            <CustomInput
              type="select"
              className="col-sm-4"
            />
          </Row>
          <div>
            {selectedDate}
          </div>
          <div>
            {freeTimeSlots}
          </div>
        </CardBody>
      </Card>
    </>
  );
}
