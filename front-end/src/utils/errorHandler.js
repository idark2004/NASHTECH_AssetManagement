
class ErrorHandler {
    getErrorMessage(errorMsg) {
        //remove the status number + error name
        //only keeps the message
        const errorRegex = (/"([^"]*)"$/);
        errorMsg = errorMsg.match(errorRegex)[1]
        return errorMsg
    }
}

export default new ErrorHandler();