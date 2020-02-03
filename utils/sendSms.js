const Nexmo = require('nexmo')

const accountSid = 'AC1099fb5ef48363809ae9de3ae535cbec';
const authToken = 'bd7e992979a930c85f612822f4ee4b44';
const client = require('twilio')(accountSid, authToken);

const nexmo = new Nexmo({
    apiKey: 'b094304a',
    apiSecret: 'dQ0CdPNRkrbBUQQY'
});

const sendSMSNexmo = (to, text) => {
    const from = "NEXMO"

    nexmo.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if (responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully a ", to);

            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    })
}

const sendSMSTwilio = (to, text) => {
    
    client.messages
        .create({
            body: text,
            messagingServiceSid: 'MG8ce2560e8f755612739a05bef0699d6c',
            to: to
        })
        .then(message => {
            console.log("Message sent successfully a ", to, 'Result ::::>', message.sid);
        })
        .done();
}

module.exports = {
    sendSMSNexmo,
    sendSMSTwilio
}