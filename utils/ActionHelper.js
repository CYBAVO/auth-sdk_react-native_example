import { Authenticator } from '@cybavo/react-native-auth-service';

const {
  TwoFactorAuthenticationAction: { Types, State, UserAction },
} = Authenticator;

export function stateDesc(action) {
  switch (action.state) {
    case State.CREATED:
      return 'CREATED';
    case State.DONE:
      return 'DONE';
    case State.PASSED:
      return 'PASSED';
    case State.CANCELLED:
      return 'CANCELLED';
    case State.FAILED:
      return 'FAILED';
    case State.UNKNOWN:
    default:
      return `UNKNOWN(${action.state})`;
  }
}

export function userActionDesc(action) {
  switch (action.userAction) {
    case UserAction.NONE:
      return 'NONE';
    case UserAction.ACCEPT:
      return 'ACCEPT';
    case UserAction.REJECT:
      return 'REJECT';
    case UserAction.UNKNOWN:
    default:
      return `UNKNOWN(${action.userAction})`;
  }
}

export function getTitle(action) {
  switch (action.type) {
    case Types.SETUP_PIN_CODE:
      return 'Setup PIN code';
    case Types.CUSTOM_OTP_ACTION:
    case Types.CUSTOM_PIN_CODE_ACTION:
      return action.messageTitle;
    default:
      return `UNKNOWN(${action.type})`;
  }
}

export function getBody(action) {
  switch (action.type) {
    case Types.SETUP_PIN_CODE:
      return 'Setup PIN code to protect your property';
    case Types.CUSTOM_OTP_ACTION:
    case Types.CUSTOM_PIN_CODE_ACTION:
      return action.messageBody;
    default:
      return `UNKNOWN(${action.type})`;
  }
}
