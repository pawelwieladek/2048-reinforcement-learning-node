import registry from "./child-registry";

let createMessage = (action, response) => {
    return {
        action: action,
        response: response
    };
};

process.on('message', message => {
    try {
        let handler = registry.getHandler(message.action);
        let send = (action, response) => {
            process.send(createMessage(action, response));
        };
        handler(send, message);
    } catch (e) {
        console.log(e);
    }
});