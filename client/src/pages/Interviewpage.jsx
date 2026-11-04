import React, { useState } from 'react';
import Setup from '../components/Setup';
import Interview from '../components/Interview';
import Report from '../components/Report';

const Interviewpage = () => {
  const [step, setstep] = useState(1)
  const [interviewdata, setinterviewdata] = useState(null)

  return (
    <div>
      {step===1 && (<Setup onstart={(data)=>{
        setinterviewdata(data);
        setstep(2)
      }}  />)}
      {step===2 && (<Interview interviewdata={interviewdata} onfinish={(report)=>{setinterviewdata(report)
      setstep(3)}} />)}
      {step===3 && (<Report report={interviewdata} />)}
    </div>
  );
}

export default Interviewpage;
