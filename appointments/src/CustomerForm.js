import React, { useState } from "react";

export const CustomerForm = ({ firstName }) => (
  <form id="customer">
    <input type="text" name="firstName" value={firstName} readOnly></input>
  </form>
);
