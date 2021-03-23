export const searchRange = { from: "2021-01-04", to: "2021-01-07" };

// The dentists' current appointments, these times are blocked.
export const weeklyAppointments = [
  { from: "2021-01-04T10:15:00", to: "2021-01-04T10:30:00" },
  { from: "2021-01-05T11:00:00", to: "2021-01-05T11:30:00" },
  { from: "2021-01-05T15:30:00", to: "2021-01-05T16:30:00" },
  { from: "2021-01-06T10:00:00", to: "2021-01-06T10:30:00" },
  { from: "2021-01-06T11:00:00", to: "2021-01-06T12:30:00" },
  { from: "2021-01-06T17:30:00", to: "2021-01-06T18:00:00" },
];

// FIXME: actual date objects could be useful... (ಠ⌣ಠ)
export const DAY_START = "08:00";
export const DAY_END = "18:00";
export const LUNCH_START = "12:00";
export const LUNCH_END = "13:00";
