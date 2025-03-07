import "./App.css";
import {  useReducer, useState } from "react";
import Atm from './assets/atm-svgrepo-com.svg'


type Action =
 | {type : "OPEN_ACCAUNT"}
 | {type : "DEPOSIT"; payload : number}
 | {type : "WITHDRAW"; payload : number}
 | {type : "REQUEST_LOAN", payload: number}
 | {type : "PAY_LOAN"}
 | {type : "CLOSE_ACCOUNT"}


type Istate = {
  balance : number;
  loan : number;
  isActive : boolean,
  isRequestedLoan : boolean
}

const initialState : Istate = {
  balance: 0,
  loan: 0,
  isActive: false,
  isRequestedLoan : false,
};


function reducer(state : Istate, action : Action) {
  switch (action.type) {
    case 'OPEN_ACCAUNT':
      return { ...state, isActive: true, balance: 500,  };
    case 'DEPOSIT':
      return { ...state, balance: state.balance + action.payload};
    case 'WITHDRAW':
      return { ...state, balance: 
        state.balance > 0 
          ? state.balance - action.payload
          : state.balance};
    case 'REQUEST_LOAN':
      return  state.isRequestedLoan === true 
        ? state : { ...state, isRequestedLoan: true,
           loan: action.payload, balance: state.balance + action.payload};
    case 'PAY_LOAN':
      return state.loan <= state.balance  ? { ...state, isRequestedLoan: false, balance: state.balance - state.loan , loan: 0,}
      : state 
    case 'CLOSE_ACCOUNT':
      return state.balance === 0  && state.loan === 0 ?
        initialState : {...state};
  }
}


const App = () => {

  const [state, dispatch] = useReducer(reducer, initialState);
  const {balance, loan, isActive, isRequestedLoan} = state;

  const [deposit, setDeposit] = useState(0)
  const [withdraw, setWithdraw] = useState(0)



  function handleWithdraw(e : React.ChangeEvent<HTMLInputElement>){
  
  const value = Math.round(Number(e.target.value)); 
  
  if (isNaN(value) || value <= 0) return; 
  
  if (value > balance) return; 

  if (value > 0 && value % 10 === 0){
    setWithdraw(value); 
  }
  
  }

  return (
    
  <>


   <div className=" relative app container mx-auto border shadow-2xl rounded-2xl py-3 opacity-70 px-10  bg-gray-700">

        <span className="absolute -bottom-[21%] right-0  sm:right-0 sm:-bottom-2 size-[200px] opacity-45">
          <img src={Atm} alt="" />
        </span>      

      <h1 className=" text-3xl md:text-6xl font-medium text-center mb-2 ">useReducer Bank Account</h1>
      <hr />
      <p className="text-2xl font-bold font-mono mt-8">Balance: {balance}$</p>
      <p className="text-2xl font-bold font-mono">Loan: {loan}</p>

      <div className="flex flex-col gap-y-3 mt-4">
        {
          !isActive &&
          <p>
            <button
            className={   `border-2 rounded-md px-3 py-1 cursor-pointer 
              ${!isActive && 
                "hover:shadow-2xl  shadow-black transform hover:scale-x-110 duration-300 font-medium bg-neutral-800"}
              `}
            onClick={() => dispatch({type : 'OPEN_ACCAUNT'})} disabled={isActive}>
              Open account 💳
            </button>
          </p>
        }

<hr className="w-[50%]"/>

      <div className="w-fit mt-4">
        <label htmlFor="deposit">Choose an amount 💸:</label>
        <select 
          disabled={!isActive}
          className="bg-gray-600 px-3 rounded-md shadow-md ml-3 cursor-pointer mb-3"
          onChange={(e)=>setDeposit( Number(e.target.value))} value={deposit}
          name="deposit"
          id={balance.toString()}>
          <option value={0}>0</option>
          <option value="50">50$</option>
          <option value="100">100$</option>
          <option value="200">200$</option>
          <option value="500">500$</option>
        </select>

        <p>
          <button
          className={   `w-full font-bold border-2 rounded-md px-3 py-1 cursor-pointer 
            ${isActive && 
              "hover:shadow-2xl  shadow-black transform hover:scale-x-110 duration-300 font-medium bg-neutral-800"}
            `}
          onClick={() => dispatch({type : "DEPOSIT", payload: deposit})} disabled={!isActive}>
            Deposit: {deposit}
          </button>
        </p>
        {/* <hr  className="mt-4"/> */}
      </div>

      <hr className="w-[50%]"/>

      <div className="w-fit mt-4">
        <label htmlFor="withdraw"> Choose an amount 💸:</label>
        <select 
            disabled={!isActive}
            className="bg-gray-600 px-3 rounded-md shadow-md ml-3 cursor-pointer mb-3"
            onChange={(e)=> setWithdraw(Number(e.target.value))}
            name="withdraw" 
            id={state.balance.toString()}>
          <option value={0}>0</option>
          <option value="50">50$</option> 
          <option value="100">100$</option>
          <option value="200">200$</option>
          <option value="500">500$</option>
        </select>

        <form action="withdraw" >
          <label 
            className=" flex flex-wrap border mb-2 bg-zinc-500 text-gray-900"
            htmlFor="input">Only: {balance} or less can be withdrawn</label>
          <input 
            disabled ={!isActive}
            placeholder="Enter your amount..."
            type="number" 
            name="withdraw" 
            id="withdraw" 
            className="bg-gray-600 px-3 py-1 rounded-md shadow-md ml-3 "
             onChange={(e)=>handleWithdraw(e)}
          />
        </form>

        <p>
          <button
          className={   `border-2 rounded-md px-3 py-1 cursor-pointer w-full mt-3
            ${isActive && 
              "hover:shadow-2xl  shadow-black transform hover:scale-x-110 duration-300 font-medium bg-neutral-800"}
            `}
            onClick={() => {
              dispatch({type : "WITHDRAW", payload: withdraw})
              // setWithdraw(0)
              }} disabled={!isActive}>
            Withdraw : {withdraw}
          </button>
        </p>
      </div>

<hr className="w-[50%]"/>

      <p>
        <button
        className={   `border-2 rounded-md px-3 py-1 cursor-pointer 
          ${!isRequestedLoan  && isActive &&
            "hover:shadow-2xl  shadow-black transform hover:scale-x-110 duration-300 font-medium bg-neutral-800"}
          `}
        onClick={() => dispatch({type: "REQUEST_LOAN", payload: 5000})} disabled={!isActive && !isRequestedLoan}>
          Request a loan of 5000 💰
        </button>
      </p>
      <p>
        <button
        className={   `border-2 rounded-md px-3 py-1 cursor-pointer 
          ${isActive && isRequestedLoan && 
            "hover:shadow-2xl  shadow-black transform hover:scale-x-110 duration-300 font-medium bg-neutral-800"}
          `}
         onClick={() => dispatch({type : "PAY_LOAN",})} disabled={ !(isActive && isRequestedLoan)}>
          Pay loan 🪙
        </button>
      </p>
      <p>
        <button
        className={   `border-2 rounded-md px-3 py-1 cursor-pointer 
          ${isActive && 
            "hover:shadow-2xl  shadow-black transform hover:scale-x-110 duration-300 font-medium bg-neutral-800"}
          `}
         onClick={() => dispatch({type : "CLOSE_ACCOUNT", })} disabled={!isActive}>
          Close account
        </button>
        <br />
        <span className="text-yellow-200"> You can't close account if you have loan or positive balance</span>
      </p>
      </div>
      

    </div>

  </> 
  
  );
};

export default App;
