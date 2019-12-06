import React, { useState } from "react";
import { createContainer } from "./domManipulators";
import { isTSAnyKeyword, exportAllDeclaration } from "@babel/types";
import { AppointmentForm } from "../src/AppointmentForm";
import ReactTestUtils from "react-dom/test-utils";

describe("AppointmentForm", () => {
  let render, container;
  beforeEach(() => {
    ({ render, container } = createContainer());
  });
  const form = id => container.querySelector(`form[id="${id}"]`);
  const field = name => form("appointment").elements[name];
  const fieldProgram = name => form("appointment").elements[name];
  const timeSlotTable = () => container.querySelector("table#time-slots");

  const findOption = (dropdownNode, textContent) => {
    const options = Array.from(dropdownNode.childNodes);
    return options.find(option => option.textContent === textContent);
  };
  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}"]`);

  const startsAtField = index => 
    container.querySelectorAll(`input[name="startsAt"]`)[index];


  const itRendersALabel = (fieldName, valueName) => {
    it("renders a label  ", () => {
      render(<AppointmentForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(valueName);
    });
  };

  const itSubmitsExistingValue = (fieldName, valueName) => {
    it("saves existing value when submitted", async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          {...{ [fieldName]: valueName }}
          onSubmit={props => expect(props[fieldName]).toEqual(valueName)}
        />
      );
      await ReactTestUtils.Simulate.submit(form("appointment"));
    });
  };
  const itSubmitsNewValue = (fieldName, valueName) => {
    it("saves existing new value when submitted", async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          {...{ [fieldName]: valueName }}
          onSubmit={props => expect(props[fieldName]).toEqual(valueName)}
        />
      );
      await ReactTestUtils.Simulate.change(fieldProgram(fieldName), {
        target: { value: valueName, name: fieldName }
      });
      await ReactTestUtils.Simulate.submit(form("appointment"));
    });
  };
  


  it("it renders a form", () => {
    render(<AppointmentForm />);
    expect(form("appointment")).not.toBeNull();
  });

  describe("service field", () => {
    it("it rendes a select box", () => {
      render(<AppointmentForm />);
      expect(field("service")).not.toBeNull();
      expect(field("service").tagName).toEqual("SELECT");
    });

    it("initially has a blank value chosen", () => {
      render(<AppointmentForm />);
      const firstNode = field("service").childNodes[0];
      expect(firstNode.value).toEqual("");
      expect(firstNode.selected).toBeTruthy();
    });

    it("lists all salon services", () => {
      const selectableServices = ["Cut", "Blow-dry", "Cut & color"];

      render(<AppointmentForm selectableServices={selectableServices} />);

      const optionNodes = Array.from(field("service").childNodes);
      const renderedServices = optionNodes.map(node => node.textContent);
      expect(renderedServices).toEqual(
        expect.arrayContaining(selectableServices)
      );
    });

    it("lists all salon services", () => {
      const selectableServices = ["Cut", "Blow-dry"];

      render(<AppointmentForm selectableServices={selectableServices} />);

      const optionNodes = Array.from(field("service").childNodes);
      const renderedServices = optionNodes.map(node => node.textContent);
      expect(renderedServices).toEqual(
        expect.arrayContaining(selectableServices)
      );
    });
    it("pre-selects the existing value", () => {
      const services = ["Cut", "Blow-dry", "Cut & color"];
      render(
        <AppointmentForm selectableServices={services} service="Blow-dry" />
      );
      const option = findOption(field("service"), "Blow-dry");
      expect(option.selected).toBeTruthy();
    });
    itRendersALabel("service", "Salon Service");
    itSubmitsExistingValue("service", "Blow-dry");
    itSubmitsNewValue("service", "Cut");
  });
  describe("time slots table", () => {
    it("renders a table for time slots", () => {
      render(<AppointmentForm />);
      expect(container.querySelector("table#time-slots")).not.toBeNull();
    });
    it("renders a time slot for every half  an hour between  open  and close times ", () => {
      render(<AppointmentForm salonOpensAt={9} salonClosesAt={11} />);
      const timesOfDay = timeSlotTable().querySelectorAll("tbody >* th");
      expect(timesOfDay).toHaveLength(4);
      expect(timesOfDay[0].textContent).toEqual("09:00");
      expect(timesOfDay[1].textContent).toEqual("09:30");
      expect(timesOfDay[3].textContent).toEqual("10:30");
    });
    it("renders an empty cell at the start  of the header row", () => {
      render(<AppointmentForm />);
      const headerRow = timeSlotTable().querySelector('thead > tr');
      expect(headerRow.firstChild.textContent).toEqual("");
    });
    it('renders a week of available dates',()=>{
      const date = new Date(2018,11,1);
      render(<AppointmentForm today={date}   />);
      const dates = timeSlotTable().querySelectorAll('thead > * th:not(:first-child)');
      expect(dates).toHaveLength(7);
      expect(dates[0].textContent).toEqual('Sat 01');
      expect(dates[1].textContent).toEqual('Sun 02');
      expect(dates[6].textContent).toEqual('Fri 07');
    });
    it('renders a radio button for each time slot',()=>{
      const date = new Date();
      const availableTimeSlots =[{startsAt: date.setHours(9,0,0,0) },{startsAt: date.setHours(9,30,0,0)}];
     
      render(<AppointmentForm  today={date} availableTimeSlots ={availableTimeSlots} />);

      const cells = timeSlotTable().querySelectorAll('td');
      expect(cells[0].querySelector('input[type="radio"]')).not.toBeNull();
      expect(cells[7].querySelector('input[type="radio"]')).not.toBeNull();
    });
    it('does not render a radio button for unavailable time slots',() => {
      const availableTimeSlots =[];
     
      render(<AppointmentForm   availableTimeSlots ={availableTimeSlots} />);

      const timesOfDay = timeSlotTable().querySelectorAll('input');
      expect(timesOfDay).toHaveLength(0);
    });

    it ('sets the radio button values to the index of the corresponding appointment',() => {
      const today = new Date();
      const availableTimeSlots =[
        {startsAt: today.setHours(9,0,0,0) },
        {startsAt: today.setHours(9,30,0,0)}
      ];
     
      render(<AppointmentForm  today={today} availableTimeSlots ={availableTimeSlots} />);
      const timesOfDay = timeSlotTable().querySelectorAll('input');
      expect(timesOfDay).toHaveLength(2);
      expect(startsAtField(0).value).toEqual(availableTimeSlots[0].startsAt.toString());
      expect(startsAtField(1).value).toEqual(availableTimeSlots[1].startsAt.toString());
    });

    it('saves new value when submitted',  () =>{
      const today = new Date();
      const availableTimeSlots =[
        {startsAt: today.setHours(9,0,0,0) },
        {startsAt: today.setHours(9,30,0,0)}
      ];     
      render(<AppointmentForm  
        today={today} 
        availableTimeSlots ={availableTimeSlots} 
        startsAt ={availableTimeSlots[0].startsAt}
        onSubmit={
          ({startsAt}) =>{
            expect(startsAt).toEqual(availableTimeSlots[1].startsAt)
          }
        }
        />
      );
      ReactTestUtils.Simulate.change(startsAtField(1),{
        target:{
          value: availableTimeSlots[1].startsAt.toString(), 
          name: 'startsAt'
        }
      });
      ReactTestUtils.Simulate.submit(form("appointment"));
    });
  });
});
