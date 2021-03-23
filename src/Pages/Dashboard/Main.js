import React, { useState, useEffect } from 'react';
import { match as matchPropTypes } from 'react-router-prop-types';
import { useHistory } from 'react-router-dom';
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button,
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import { weeklyAppointments, searchRange } from './consts';

const findFreeTimeslots = () => [];

export default function Main() {
  const [startDate, setStartDate] = useState([]);
  //   useEffect(() => {
  //     fetchSubscribeData(id);
  //   }, [id]);

  useEffect(() => {
    setStartDate('nukk');
  }, [startDate]);

  return (
    <>
      <p>Test</p>
      <DatePicker onChange={(date) => console.log(date)} />
    </>
  );
}
