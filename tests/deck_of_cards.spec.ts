import { test, expect } from '@playwright/test';

test('Check for blackjack', async ({ request }) => {
    let deckId;

    await test.step('Get a new deck', async () => {
        const response = await request.get("https://deckofcardsapi.com/api/deck/new/");
        expect(response.ok()).toBeTruthy();
        const responseBody = JSON.parse(await response.text());
        deckId = responseBody.deck_id;
    });

    await test.step('Shuffle deck', async () => {
        const response = await request.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
        expect(response.ok()).toBeTruthy();
        const responseBody = JSON.parse(await response.text());
        expect(responseBody.shuffled).toBeTruthy();
    });

    await test.step('Draw 3 cards for player 1 and check for blackjack', async () => {
        const response = await request.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`);
        expect(response.ok()).toBeTruthy();
        const responseBody = JSON.parse(await response.text());
        const response2 = await request.get(`https://deckofcardsapi.com/api/deck/${deckId}/pile/player1/add/?cards=${responseBody.cards[0].code},${responseBody.cards[1].code},${responseBody.cards[2].code}`);
        expect(response2.ok()).toBeTruthy();
        const card1 = checkForFaceCard(responseBody.cards[0].value);
        const card2 = checkForFaceCard(responseBody.cards[1].value);
        const card3 = checkForFaceCard(responseBody.cards[2].value);
        const player1Sum = Number(card1) + Number(card2) + Number(card3);
        console.log(player1Sum);
        if (player1Sum == 21) {
            console.log('Player 1 has blackjack!');
        };
    });

    await test.step('Draw 3 cards for player 2', async () => {
        const response = await request.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`);
        expect(response.ok()).toBeTruthy();
        const responseBody = JSON.parse(await response.text());
        const response2 = await request.get(`https://deckofcardsapi.com/api/deck/${deckId}/pile/player2/add/?cards=${responseBody.cards[0].code},${responseBody.cards[1].code},${responseBody.cards[2].code}`);
        expect(response2.ok()).toBeTruthy();
        const card1 = checkForFaceCard(responseBody.cards[0].value);
        const card2 = checkForFaceCard(responseBody.cards[1].value);
        const card3 = checkForFaceCard(responseBody.cards[2].value);
        const player2Sum = Number(card1) + Number(card2) + Number(card3);
        console.log(player2Sum);
        if (player2Sum == 21) {
            console.log('Player 2 has blackjack!');
        };
    });
})

function checkForFaceCard(card: string) {
    if (card == 'JACK' || card == 'QUEEN' || card == 'KING') {
        return "10";
    } else if (card == 'ACE') {
        return "11";
    } else {
        return card;
    }
}