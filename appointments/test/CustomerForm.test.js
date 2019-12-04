import React, { useState } from "react";
import { createContainer } from "./domManipulators";
import { isTSAnyKeyword, exportAllDeclaration } from "@babel/types";
import { CustomerForm } from "../src/CustomerForm";
import ReactTestUtils from "react-dom/test-utils";

describe("CustomweForm", () => {
  let render, container;
  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = id => container.querySelector(`form[id="${id}"]`);
  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}"]`);

  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual("INPUT");
    expect(formElement.type).toEqual("text");
  };

  //   const firstNameField = () => form("customer").elements.firstName;
  // const firstNameField = () =>  fieldProgram("firstName") ;
  //   const lastNameField = () => form("customer").elements.lastName;
  // const lastNameField = () =>  fieldProgram("lastName") ;

  const fieldProgram = name => form("customer").elements[name];

  const itIncludesTheExistingValue = fieldName => {
    it("renders the existing value  ", () => {
      render(<CustomerForm {...{ [fieldName]: "value" }}></CustomerForm>);
      expect(fieldProgram(fieldName).value).toEqual("value");
    });
  };
  const itRendersAsATextBox = fieldName => {
    it("renders as a text box", () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(fieldProgram(fieldName));
    });
  };
  const itRendersALabel = (fieldName,valueName)=>{
    it("renders a label  ", () => {
        render(<CustomerForm />);
        expect(labelFor(fieldName)).not.toBeNull();
        expect(labelFor(fieldName).textContent).toEqual(valueName);
      });
  }
  const assignsAnIdThatMatchesTheLabelId =(fieldName) => {
    it("assigns an id that matches the label id", () => {
        render(<CustomerForm />);
        expect(fieldProgram(fieldName).id).toEqual(fieldName);
      });
  }
  const itSubmitsExistingValue =(fieldName,valueName) =>{
    it("saves existing first name when submitted", async () => {
        expect.hasAssertions();
        render(
          <CustomerForm
            { ...{[fieldName]:valueName}}
            onSubmit={props => expect(props[fieldName]).toEqual(valueName)}
          />
        );
        await ReactTestUtils.Simulate.submit(form("customer"));
      });
  }

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
  describe("first name field", () => {
    itRendersAsATextBox("firstName");
    itIncludesTheExistingValue("firstName");
    itRendersALabel("firstName","First Name");
    assignsAnIdThatMatchesTheLabelId("firstName");
    itSubmitsExistingValue("firstName","Ashley");

    it("saves existing first name when submitted", async () => {
      expect.hasAssertions();
      render(
        <CustomerForm
          firstName="Ashley"
          onSubmit={({ firstName }) => expect(firstName).toEqual("Ashley")}
        />
      );
      await ReactTestUtils.Simulate.submit(form("customer"));
    });

    it("saves new first name when submitted", async () => {
      expect.hasAssertions();
      render(
        <CustomerForm
          firstName="Ashley"
          onSubmit={({ firstName }) => expect(firstName).toEqual("Jamie")}
        />
      );
      await ReactTestUtils.Simulate.change(fieldProgram("firstName"), {
        target: { value: "Jamie" }
      });
      await ReactTestUtils.Simulate.submit(form("customer"));
    });
  });
  describe("last name field", () => {
    itRendersAsATextBox("lastName");
    itIncludesTheExistingValue("lastName");
    itRendersALabel("lastName","Last Name");
    assignsAnIdThatMatchesTheLabelId("lastName");
 
    it("saves existing last name when submitted", async () => {
      expect.hasAssertions();
      render(
        <CustomerForm
          lastName="Ashley"
          onSubmit={({ lastName }) => expect(lastName).toEqual("Ashley")}
        />
      );
      await ReactTestUtils.Simulate.submit(form("customer"));
    });

    it("saves new last name when submitted", async () => {
      expect.hasAssertions();
      render(
        <CustomerForm
          lastName="Ashley"
          onSubmit={({ lastName }) => expect(lastName).toEqual("Jamie")}
        />
      );
      await ReactTestUtils.Simulate.change(fieldProgram("lastName"), {
        target: { value: "Jamie" }
      });
      await ReactTestUtils.Simulate.submit(form("customer"));
    });
  });
});
