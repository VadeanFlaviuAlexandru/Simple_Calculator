import { actionsPossible } from "./App"

export default function DigitButton({ dispatch, digit }) {
    return (
        <button
            onClick={() => dispatch({ type: actionsPossible.add_, payload: { digit } })}>
                {digit}
        </button>
    )
}