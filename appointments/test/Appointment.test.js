import { isTSAnyKeyword, exportAllDeclaration } from "@babel/types";
import ReactDOM from 'react-dom';
import React from 'react';
import { Appointment } from "../src/Appointment";



describe('Appointment' , () =>{
   let container;
   let customer;
   let render ;
 
   beforeEach(() => {
     container = document.createElement('div');
     render = (component) => ReactDOM.render(component , container );
   });
    

   it('renders the customer first name', () =>{
      customer = { firstName: 'Ashley' } ;
      render(<Appointment customer={customer} />) ;
      expect(container.textContent).toMatch('Ashley');
   });
   
   it ('renders another customer first name',() =>{
	customer = { firstName: 'Jordan' } ;
      render(<Appointment customer={customer} />) ;
      expect(container.textContent).toMatch('Jordan');

   })
});
