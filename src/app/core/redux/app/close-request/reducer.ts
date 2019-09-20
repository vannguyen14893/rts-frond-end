import { IClosedRequestState, CLOSE_REQUEST_INITAL_STATE } from "./store";
import { Action } from "../../root.action";
import { tassign } from "tassign";
import { SET_CLOSED_REQUEST_ID } from "./action";

export const closeRequestReducer = (state: IClosedRequestState = CLOSE_REQUEST_INITAL_STATE, action: Action ) => {
    switch (action.type) {
        case SET_CLOSED_REQUEST_ID:
            return tassign(state, { closedRequestId : action.payload });
        default: return state;
    }
};

