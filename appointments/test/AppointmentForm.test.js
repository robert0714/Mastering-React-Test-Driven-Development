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

  const findOption = (dropdownNode, textContent) => {
    const options = Array.from(dropdownNode.childNodes);
    const result = options.find(option => option.textContent === textContent);
    return result;
  };
  it("pre-selects the existing value", () => {
    const selectableServices = ["Cut", "Blow-dry", "Cut & color"];
    render(<AppointmentForm selectableServices={selectableServices}  service="Blow-dry"/>);
    const option =  findOption(field['service'],"Blow-dry");
    expect(option.selected).toBeTruthy();
  });

  it.skip("it renders a form", () => {
    render(<AppointmentForm />);
    expect(form("appointment")).not.toBeNull();
  });

  describe("service field", () => {
    it.skip("it rendes a select box", () => {
      render(<AppointmentForm />);
      expect(field("service")).not.toBeNull();
      expect(field("service").tagName).toEqual("SELECT");
    });

    it.skip("initially has a blank value chosen", () => {
      render(<AppointmentForm />);
      const firstNode = field("service").childNodes[0];
      expect(firstNode.value).toEqual("");
      expect(firstNode.selected).toBeTruthy();
    });
    it.skip("lists all salon services", () => {
      const selectableServices = ['Cut', 'Blow-dry', 'Cut & color'];
      render(<AppointmentForm selectableServices={selectableServices} />);

      const optionNodes = Array.from(field("service").childNodes);
      const renderedServices = optionNodes.map(node =>
        node.textContet
       );

      expect(renderedServices).toEqual(
        expect.arrayContaining(selectableServices)
      );
    });
    it.skip("lists all salon services", () => {
      const selectableServices = ["Cut", "Blow-dry"];

      render(<AppointmentForm selectableServices={selectableServices} />);

      const optionNodes = Array.from(field("service").childNodes);
      const renderedServices = optionNodes.map(node => node.textContent);
      expect(renderedServices).toEqual(
        expect.arrayContaining(selectableServices)
      );
    });
  });
});
