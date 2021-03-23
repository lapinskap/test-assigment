import PropTypes from 'prop-types';
import React from 'react';
import { Label } from 'reactstrap';
import Slider from 'rc-slider';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const HoursSlider = ({
  label, valueFrom, valueTo, onChange, id,
}) => {
  const handleChange = (range) => {
    onChange(id, range);
  };
  const useLongScale = Boolean(valueTo >= MINUTES_IN_DAY);
  return (
    <div className="p-2">
      <Label>
        {label}
        :
        {' '}
        {rangeValueToHourFormatter(valueFrom)}
        -
        {rangeValueToHourFormatter(valueTo)}
      </Label>
      <div className="p-2">
        <Range
          className="rc-slider-line mb-4"
          step={30}
          min={0}
          // 2160 = 36 * 60
          max={useLongScale ? 2160 : MINUTES_IN_DAY}
          onChange={handleChange}
          marks={useLongScale ? longScaleMarks : shortScaleMarks}
          defaultValue={[valueFrom, valueTo]}
          tipFormatter={rangeValueToHourFormatter}
        />
      </div>
    </div>
  );
};

const MINUTES_IN_DAY = 1440;

export const parseHourFromBackend = (from, to) => {
  const fromValue = from;
  let toValue = to;
  if (toValue !== null && toValue < fromValue) {
    toValue += MINUTES_IN_DAY;
  }

  return [fromValue, toValue];
};

export const parseHourToBackend = (value) => (value >= MINUTES_IN_DAY ? value - MINUTES_IN_DAY : value);

export const rangeValueToHourFormatter = (minutesValue) => {
  const value = minutesValue / 60;
  const realValue = value >= 24 ? value - 24 : value;

  const hour = Math.floor(realValue);
  const hourDisplay = hour < 10 ? `0${hour}` : `${hour}`;
  const minutes = Math.round((realValue - hour) * 60);
  const minutesDisplay = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${hourDisplay}:${minutesDisplay}`;
};

const shortScaleMarks = {
  0: '00:00',
  360: '06:00',
  720: '12:00',
  1080: '18:00',
  1440: '24:00',
};
const longScaleMarks = {
  ...shortScaleMarks,
  1800: '06:00',
  2160: '12:00',
};

HoursSlider.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  valueFrom: PropTypes.number,
  valueTo: PropTypes.number,
};

HoursSlider.defaultProps = {
  valueFrom: null,
  valueTo: null,
};

export default HoursSlider;
