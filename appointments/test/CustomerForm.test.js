import React from "react";
import { createContainer } from "./domManipulators";
import { isTSAnyKeyword, exportAllDeclaration } from "@babel/types";
import { CustomerForm } from "../src/CustomerForm";

describe("CustomweForm", () => {
  let render, container;
  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = id => container.querySelector(`form[id="${id}"]`);

  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual("INPUT");
    expect(formElement.type).toEqual("text");
  };

  it("renders a form", () => {
    render(<CustomerForm />);
    // expect(container.querySelector('form[id="customer"]')).not.toBeNull();
    expect(form("customer")).not.toBeNull();
  });

  it("renders the first name field  as a text box", () => {
    render(<CustomerForm />);
    const field = form("customer").elements.firstName;
    // expect(field).not.toBeNull();
    // expect(field.tagName).toEqual("INPUT");
    // expect(field.type).toEqual("text");
    expectToBeInputFieldOfTypeText(field);
  });
});
