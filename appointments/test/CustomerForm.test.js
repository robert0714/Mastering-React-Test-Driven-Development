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

  const firstNameField = () => form("customer").elements.firstName;

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

  it("renders the existing value for the  first name field", () => {
    render(<CustomerForm firstName="Ashely"></CustomerForm>);
    // const field =form('customer').elements.firstName;
    // expect(field.value).toEqual("Ashely");
    expect(firstNameField().value).toEqual("Ashely");
  });

  it("renders as  a text box", () => {
    render(<CustomerForm />);
    expectToBeInputFieldOfTypeText(firstNameField());
  });

  it("renders a label for the first name field", () => {
    render(<CustomerForm />);
    expect(labelFor("firstName")).not.toBeNull();
    expect(labelFor("firstName").textContent).toEqual("First Name");
  });

  it("assigns an id that matches the label id to the first name field", () => {
    render(<CustomerForm />);
    expect(firstNameField().id).toEqual("firstName");
  });

  it.skip("renders a label for the first name field-2", () => {
    render();
    expect(labelFor("firstName").textContent).toEqual("First Name");
  });

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

//   it("saves existing first name when submitted", async () => {
//     expect.hasAssertions();
//     render(
//       <CustomerForm
//         firstName="Ashley"
//         onSubmit={({ firstName }) => expect(firstName).toEqual("Ashley")}
//       />
//     );
//     await ReactTestUtils.Simulate.submit(form("customer"));
//   });

    it("saves new first name when submitted", async () => {
      expect.hasAssertions(); 
      render(
        <CustomerForm
          firstName="Ashley"
          onSubmit={({ firstName }) =>   expect(firstName).toEqual("Jamie")}
        />
      );
      await ReactTestUtils.Simulate.change(firstNameField(), {
        target: { value: "Jamie" }
      });
      await ReactTestUtils.Simulate.submit(form("customer"));
    });

//   it("saves new first name when submitted", async () => {
//     expect.hasAssertions();
//     render(
//       <CustomerForm
//         firstName="Ashley"
//         onSubmit={({ firstName }) => expect(firstName).toEqual("Jamie")}
//       />
//     );
//     await ReactTestUtils.Simulate.change(firstNameField(), {
//       target: { value: "Jamie" }
//     });
//     await ReactTestUtils.Simulate.submit(form("customer"));
//   });

  
});
