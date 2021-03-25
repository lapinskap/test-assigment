/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Card, CardBody, CardTitle, Row, Button, Label,
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import { searchRange, DAY_START } from './consts';
import {
  createHourSlots, createDateListToCheck,
}
  from './utils';

export default function Main() {
  const [selectedDate, setSelectedDate] = useState('2021-01-05T08:00:00');
  const [selectedTime, setSelectedTime] = useState('08:30');
  const [freeTimeSlots, updateFreeTimeSlots] = useState([]);

  const findFreeTimeslots = (date) => {
    const formatedDate = `${moment(date).format('YYYY-MM-DD')} ${DAY_START}`;
    return createHourSlots(formatedDate);
  };

  useEffect(() => {
    updateFreeTimeSlots(findFreeTimeslots(selectedDate));
  }, [selectedDate]);

  return (
    <>
      <Card className="m-3">
        <CardTitle className="col-sm-12 m-3">New appointment</CardTitle>
        <CardBody className="col-sm-12 m-3">
          <Row className="m-3">
            <Label>
              Select date:
              <DatePicker
                includeDates={createDateListToCheck(searchRange)}
                onChange={(date) => setSelectedDate(date)}
              />
            </Label>
          </Row>
          <Row className="mb-3">
            <div className="col-sm-4">
              <CardTitle>Selected appointment date:</CardTitle>
              <div>
                {moment(selectedDate).format('YYYY-MM-DD')}
              </div>
            </div>
            <div className="col-sm-4">
              <CardTitle>Selected appointment time:</CardTitle>
              <div>
                {selectedTime}
              </div>
            </div>
          </Row>
          <CardTitle>Avabile appoitment hours:</CardTitle>
          <Row className="col-sm-12">
            {freeTimeSlots.map((slot) => (
              <Button
                color={selectedTime === slot ? 'secondary' : 'link'}
                className="col-sm-2 px-3 m-2"
                onClick={() => setSelectedTime(slot)}
              >
                {slot}
              </Button>
            ))}
          </Row>
        </CardBody>
      </Card>
    </>
  );
}
