import React, { useState } from "react";

function InputTypes() {
  // Radio Group State (Single String)
  const [subscriptionPlan, setSubscriptionPlan] = useState("basic");

  // Checkbox Group State (Array of Strings)
  const [communicationPrefs, setCommunicationPrefs] = useState(["email"]);

  // Handler for the Radio Group
  const handlePlanChange = (e) => {
    console.log(subscriptionPlan, e.target.value)
    setSubscriptionPlan(e.target.value);
  };

  // Handler for the Checkbox Group
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    console.log(value, checked)

    setCommunicationPrefs((prevPrefs) => {
      if (checked) {
        // Add the new value to the array immutably
        return [...prevPrefs, value];
      } else {
        // Remove the value from the array immutably
        return prevPrefs.filter((pref) => pref !== value);
      }
    });
  };

  const radioValues = [
    { value: "basic", label: "Basic Plan" },
    { value: "pro", label: "Pro plan" },
  ];

  return (
    <>
      <div>
        <form
          id="new-form"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <fieldset>
            <legend>Personal info</legend>
            <label htmlFor="name">Enter name: </label>
            <input type="text" id="name" autoComplete="false" />

            <label htmlFor="age">Enter age: </label>
            <input type="number" id="age"></input>
          </fieldset>

          {/* RADIO GROUP
        Notice the <fieldset> and <legend>. These are MANDATORY for accessibility.
      */}
          <fieldset className="form-group">
            <legend>Select Subscription Plan (Choose exactly one)</legend>

            {radioValues.map((item, idx) => {
              return (
                <>
                  <label htmlFor={item.value}>{item.label}</label>
                  <input
                    id={item.value}
                    type="radio"
                    name="plan"
                    value={item.value}
                    checked={item.value === subscriptionPlan}
                    onChange={handlePlanChange}
                  />
                </>
              );
            })}

            {/* <label>
              <input
                type="radio"
                name="plan" // Shared name enforces mutual exclusivity
                value="basic"
                checked={subscriptionPlan === "basic"}
                onChange={handlePlanChange}
              />
              Basic ($9/mo)
            </label>

            <label>
              <input
                type="radio"
                name="plan"
                value="pro"
                checked={subscriptionPlan === "pro"}
                onChange={handlePlanChange}
              />
              Pro ($19/mo)
            </label> */}
          </fieldset>

          {/* CHECKBOX GROUP
           */}
          <fieldset className="form-group">
            <legend>Communication Preferences (Choose multiple)</legend>

            <label>
              <input
                type="checkbox"
                name="communications"
                value="email"
                // The box is checked if its value exists inside our state array
                checked={communicationPrefs.includes("email")}
                onChange={handleCheckboxChange}
              />
              Email Alerts
            </label>

            <label>
              <input
                type="checkbox"
                name="communications"
                value="sms"
                checked={communicationPrefs.includes("sms")}
                onChange={handleCheckboxChange}
              />
              SMS Notifications
            </label>
          </fieldset>
        </form>
      </div>
    </>
  );
}

export default InputTypes;
