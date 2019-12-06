import React, { useState } from "react";

export const AppointmentForm = ({
  selectableServices,
  service,
  onSubmit,
  salonOpensAt,
  salonClosesAt,
  today
}) => {
  const [appointment, setAppointment] = useState({ service });
  const handleChange = ({ target }) => {
    setAppointment(appointment => ({
      ...appointment,
      [target.name]: target.value
    }));
  };
  const toTimeValue = timestamp =>
    new Date(timestamp).toTimeString().substring(0, 5);
  const timeIcrement =(numberTimes , startTime , increment) => {
    const result = Array(numberTimes)
      .fill([startTime])
      .reduce((acc, _, i) => acc.concat([startTime + i * increment]));
    return result;
  };
  const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
    const totalSlots = (salonClosesAt - salonOpensAt) * 2;
    const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
    const increment = 30 * 60 * 1000;
    const result = timeIcrement(totalSlots, startTime , increment) ;
    return result;
  };
  const weeklyDateValues = startDate => {
    const midnight = new Date(startDate).setHours(0, 0, 0,0);
    const increment = 24 * 60 * 60 * 1000;
    const result = timeIcrement(7, midnight , increment) ;
    return result;
  };
  const toShortDate = timestamp => {
    const [day, , dayOfMonth] = new Date(timestamp).toDateString().split(" ");
    return `${day} ${dayOfMonth}`;
  };

  const TimeSlotTable = ({ salonOpensAt, salonClosesAt, today }) => {
    const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt);
    const dates = weeklyDateValues(today);
    return (
      <table name="time-slots" id="time-slots">
        <thead>
          <tr>
            <th/>
            {dates.map(date => (
              <th key={date}>{toShortDate(date)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(timeSlot => (
            <tr key={timeSlot}>
              <th>{toTimeValue(timeSlot)}</th>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  return (
    <form id="appointment" onSubmit={() => onSubmit(appointment)}>
      <label htmlFor="service">Salon Service</label>
      <select
        name="service"
        id="service"
        value={service}
        onChange={handleChange}
      >
        <option />
        {selectableServices.map(s => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <input type="submit" value="Add" />
      <TimeSlotTable
        salonOpensAt={salonOpensAt}
        salonClosesAt={salonClosesAt}
        today={today}
      />
    </form>
  );
};

AppointmentForm.defaultProps = {
  today: new Date(),
  salonOpensAt: 9,
  salonClosesAt: 19,
  selectableServices: [
    "Cut",
    "Blow-dry",
    "Cut & color",
    "Beard trim",
    "Cut & beard trim",
    "Extensions"
  ]
};
