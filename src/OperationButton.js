import { actionsPossible } from "./App"

export default function OperationButton({ dispatch, Operation }) {
    return (
        <button
            onClick={() => dispatch({ type: actionsPossible.operation_, payload: { Operation } })}>
                {Operation}
        </button>
    )
}