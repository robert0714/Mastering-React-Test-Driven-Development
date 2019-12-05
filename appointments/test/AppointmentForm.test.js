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

  const findOption = (dropdownNode, textContent) => {
    const options = Array.from(dropdownNode.childNodes);
    return options.find(option => option.textContent === textContent);
  };
  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}"]`);

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
    itRendersALabel("service" ,"Service");
    itSubmitsExistingValue("service" ,"Blow-dry");
    itSubmitsNewValue("service" ,"Cut");
  });
});
