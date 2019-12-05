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
  });
});
