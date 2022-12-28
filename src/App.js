import React, { useReducer, createContext, useState } from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import "./styles.css"
import "./BackgroundToggle.css"
export const ThemeContext = createContext(null)

export const actionsPossible = {
  add_: "add",
  operation_: "operation",
  clear_: "clear",
  delete_: "delete",
  equal_: "equal",
}
function reducer(state, { type, payload }) {
  switch (type) {
    case actionsPossible.add_:  //add
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "." && state.currentOperand == null) {
        return state
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    case actionsPossible.clear_:  //clear
      {
        return {}
      }
    case actionsPossible.operation_:  //choosing operation
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          Operation: payload.Operation,
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          Operation: payload.Operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
        operation_: payload.operation_,
      }
    case actionsPossible.equal_: //equal
      {
        if (state.Operation == null || state.currentOperand == null || state.previousOperand == null) {
          return state
        }
        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          currentOperand: evaluate(state),
          Operation: null,
        }
      }
    case actionsPossible.delete_: //delete
      {
        if (state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOperand: null
          }
        }
        if (state.currentOperand == null) {
          return state
        }
        if (state.currentOperand.length === 1) {
          return {
            ...state,
            currentOperand: null
          }
        }
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }
      }
    default: return state //default case
  }
}
function evaluate({ currentOperand, previousOperand, Operation }) {
  const previous = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(previous) || isNaN(current)) return ""
  let computation = ""
  switch (Operation) {
    case "+":
      computation = previous + current
      break
    case "-":
      computation = previous - current
      break
    case "*":
      computation = previous * current
      break
    case "÷":
      computation = previous / current
      break
    default:
      return
  }
  return computation.toString()
}
const integer_formatter = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) {
    return
  }
  const [integer, decimal] = operand.split('.')
  if (decimal == null) {
    return integer_formatter.format(integer)
  }
  return `${integer_formatter.format(integer)}.${decimal}`
}

function App() {

  const [theme, setTheme] = useState("light")
  const [{ currentOperand, previousOperand, Operation }, dispatch] = useReducer(reducer, {})
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div id={theme}>
        <div className="calculator-grid">
          <div className="output">
            <div className="previous-operand">{formatOperand(previousOperand)} {Operation}</div>
            <div className="current-operand">{formatOperand(currentOperand)}</div>
          </div>
          <button className="span-two" onClick={() => dispatch({ type: actionsPossible.clear_ })}>AC</button>
          <button onClick={() => dispatch({ type: actionsPossible.delete_ })}>DEL</button>
          <OperationButton Operation="÷" dispatch={dispatch} />
          <DigitButton digit="1" dispatch={dispatch} />
          <DigitButton digit="2" dispatch={dispatch} />
          <DigitButton digit="3" dispatch={dispatch} />
          <OperationButton Operation="*" dispatch={dispatch} />
          <DigitButton digit="4" dispatch={dispatch} />
          <DigitButton digit="5" dispatch={dispatch} />
          <DigitButton digit="6" dispatch={dispatch} />
          <OperationButton Operation="+" dispatch={dispatch} />
          <DigitButton digit="7" dispatch={dispatch} />
          <DigitButton digit="8" dispatch={dispatch} />
          <DigitButton digit="9" dispatch={dispatch} />
          <OperationButton Operation="-" dispatch={dispatch} />
          <DigitButton digit="." dispatch={dispatch} />
          <DigitButton digit="0" dispatch={dispatch} />
          <button className="span-two" onClick={() => dispatch({ type: actionsPossible.equal_ })}>=</button>
          <input type="checkbox" id="toggle_checkbox" onChange={toggleTheme} checked={theme === "dark"} />
          <label htmlFor="toggle_checkbox">
            <div id="star">
              <div className="star" id="star-1">★</div>
              <div className="star" id="star-2">★</div>
            </div>
            <div id="moon"></div>
          </label>
          <h3>{theme === "light" ? "Light Mode" : "Dark Mode"}</h3>
        </div>
      </div>
    </ThemeContext.Provider>

  );
}

export default App;
