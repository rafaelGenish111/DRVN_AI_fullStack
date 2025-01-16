const axios = require('axios');

const demoApiUrl = 'http://localhost:7070/lines';
const webhookUrl = 'http://localhost:3001/webhook/lines';

const sendLinesToWebhook = async () => {
    try {
        const response = await axios.get(demoApiUrl)
        console.log(response.data);
        const line = response.data;

        const newBet = {
            lineId: +1,
            id: line.id,
            action: line.action,
            options: line.odds || [],
            line_type: line.line_type || '',
            line_type_name: line.line_type_name || '',
            competition: line.competition || '',
            line_question: line.line_question || '',
            home_team: line.home_team || '',
            away_team: line.away_team || '',
            amount: [1, 3, 5, 7, 9]
        }
        console.log('new bet:', newBet);

        // console.log(`Sending line ${newBet.id} to Webhook...`);
        // console.log("Data being sent to Webhook:", JSON.stringify(newBet, null, 2));
        await axios.post(webhookUrl, newBet, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        console.log(`Line ${newBet.id} successfully send to Webhook`, newBet);

    } catch (error) {
        console.error("Error sending lines to Webhook:", error.message);
    };
};

setInterval(() => {
    sendLinesToWebhook()
}, 60000)
