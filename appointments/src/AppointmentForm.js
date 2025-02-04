import React, { useState, useCallback } from 'react';
const Error = () => (
  <div className="error">An error occurred during save.</div>
);
const timeIcrements = (numberTimes, startTime, increment) => {
  const result = Array(numberTimes)
    .fill([startTime])
    .reduce((acc, _, i) =>
      acc.concat([startTime + i * increment])
    );
  return result;
};
const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
  const totalSlots = (salonClosesAt - salonOpensAt) * 2;
  const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
  const increment = 30 * 60 * 1000;
  const result = timeIcrements(totalSlots, startTime, increment);
  return result;
};
const weeklyDateValues = startDate => {
  const midnight = new Date(startDate).setHours(0, 0, 0, 0);
  const increment = 24 * 60 * 60 * 1000;
  const result = timeIcrements(7, midnight, increment);
  return result;
};
const toShortDate = timestamp => {
  const [day, , dayOfMonth] = new Date(timestamp)
    .toDateString()
    .split(' ');
  return `${day} ${dayOfMonth}`;
};
const mergeDateAndTime = (date, timeSlot) => {
  const time = new Date(timeSlot);
  const result = new Date(date).setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
  return result;
};
const toTimeValue = timestamp =>
  new Date(timestamp).toTimeString().substring(0, 5);

const RadioButtonIfAvailable = ({
  availableTimeSlots,
  date,
  timeSlot,
  checkedTimeSlot,
  handleChange
}) => {
  const startsAt = mergeDateAndTime(date, timeSlot);
  if (availableTimeSlots.some(a => a.startsAt === startsAt)) {
    const isChecked = startsAt === checkedTimeSlot;
    return (
      <input
        name="startsAt"
        type="radio"
        value={startsAt}
        checked={isChecked}
        onChange={handleChange}
      />
    );
  }
  return null;
};

const TimeSlotTable = ({
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  checkedTimeSlot,
  handleChange
}) => {
  const dates = weeklyDateValues(today);
  const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt);    
  return (
    <table name="time-slots" id="time-slots">
      <thead>
        <tr>
          <th />
          {dates.map(date => (
            <th key={date}>{toShortDate(date)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map(timeSlot => (
          <tr key={timeSlot}>
            <th>{toTimeValue(timeSlot)}</th>
            {dates.map(date => (
              <td key={date}>
                <RadioButtonIfAvailable
                  availableTimeSlots={availableTimeSlots}
                  date={date}
                  timeSlot={timeSlot}
                  checkedTimeSlot={checkedTimeSlot}
                  handleChange={handleChange}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const AppointmentForm = ({
  selectableServices,
  service,
  onSave,
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  customer
}) => {
  const [appointment, setAppointment] = useState({ service });
  const [error, setError] = useState(false);
  const handleChange = ({ target }) => {
    setAppointment(appointment => ({
      ...appointment,
      [target.name]: target.value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const result = await window.fetch('/appointments', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...appointment,
        customer: customer.id
      })
    });
    if (result.ok) {
      setError(false);
      // const customerWithId = await result.json();
      // onSave(customerWithId);
      onSave();
    } else {
      setError(true);
    }
  };

  const handleStartsAtChange = useCallback(
    ({ target: { value } }) => {
      setAppointment(appointment => ({
        ...appointment,
        startsAt: parseInt(value)
      }));
    }
  );
  return (
    <form id="appointment" onSubmit={handleSubmit}>
      {error ? <Error /> : null}
      <label htmlFor="service">Salon Service</label>
      <select
        name="service"
        id="service"
        value={service}
        onChange={handleChange}>
        <option />
        {selectableServices.map(s => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <TimeSlotTable
        salonOpensAt={salonOpensAt}
        salonClosesAt={salonClosesAt}
        today={today}
        availableTimeSlots={availableTimeSlots}
        checkedTimeSlot={appointment.startsAt}
        handleChange={handleStartsAtChange}
      />
      <input type="submit" value="Add" />
    </form>
  );
};

AppointmentForm.defaultProps = {
  availableTimeSlots: [],
  today: new Date(),
  salonOpensAt: 9,
  salonClosesAt: 19,
  selectableServices: [
    'Cut',
    'Blow-dry',
    'Cut & color',
    'Beard trim',
    'Cut & beard trim',
    'Extensions'
  ],
  onSave: () => {}
};
