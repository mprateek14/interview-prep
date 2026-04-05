import React, { useEffect, useRef, useState } from "react";

const N = 6;

function OTPInput() {
  const [otp, setOtp] = useState(new Array(N).fill(""));

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (e, idx) => {
    const value = e.target.value;
    if (isNaN(value) || value === " ") return;

    const temp = [...otp];
    temp[idx] = value.slice(-1);
    setOtp(temp);

    const fullOtp = temp.join("")
        if(fullOtp.length === N){
            handleSubmit()
        }

    idx < N-1 && value !== "" && inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key !== "Backspace") return;
    if (!e.target.value) {
      e.preventDefault(); //IMPORTANT
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    console.log("Submitted")
  }

  const handlePaste = (e) => {
    const clipboardData = e.clipboardData.getData("text")
    console.log(clipboardData)
    if(!clipboardData) return;

    let allNums = '';
    for(let i=0; i<clipboardData?.length; i++){
        if(allNums.length === N) break;
        if(isNaN(clipboardData[i]) || clipboardData[i] === "") continue;
        else{
            allNums+=clipboardData[i]
        }
    }

    let temp = [...otp]
    for(let i=0; i<N; i++){
        temp[i] = allNums[i]
    }
    setOtp(temp)
    console.log(allNums)
  }
// "112233sdas1133s"
  return (
    <div>
      {otp.map((item, idx) => {
        return (
          <input
            key={idx}
            name={"input" + idx}
            value={otp[idx]}
            type="text"
            inputMode="numeric"
            onChange={(e) => handleChange(e, idx)}
            ref={(e) => (inputRefs.current[idx] = e)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={(e)=>handlePaste(e)}
            style={{
              height: "50px",
              width: "50px",
              margin: "5px",
              textAlign: "center",
              fontSize: "40px",
            }}
          />
        );
      })}
    </div>
  );
}

export default OTPInput;
