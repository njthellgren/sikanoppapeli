document.addEventListener("DOMContentLoaded", function() {

    const playerAmountDiv = document.querySelector('.player-amount');
    const playerNamesDiv = document.getElementById('playerNames');
    const inputForm = document.getElementById('playerForm');
    const gameDiv = document.getElementById('gameDiv');
    const gameForm = document.getElementById('gameForm')
    const scoreElement = document.getElementById('score-value');

    let playerScores = [];
    let currentPlayerIndex = 0;
    let goalPointsValue = 0;

    window.addEventListener('DOMContentLoaded', (event) => {
        const radioButtons = document.querySelectorAll('input[name="playerCount"]');
        radioButtons.forEach((radio) => {
            radio.checked = false;
        })
    })

    playerAmountDiv.addEventListener('change', function(event) {
        if (event.target.name === 'playerCount') {
            const playerCount = event.target.value;
            generatePlayerInputs(playerCount);
        }
    });

    inputForm.addEventListener('submit', function(event) {
        if (!isRadioSelected() || areAnyFieldsEmpty() || isGoalFieldEmpty()) {
            event.preventDefault();

            if (!isRadioSelected()) {
                alert('Valitse pelaajien määrä');
            } else if (areAnyFieldsEmpty()) {
                alert('Täytä kaikki kentät');
            } else if (isGoalFieldEmpty())
                alert('Aseta pistetavoite');

        } else {
            event.preventDefault();
            displayPlayers();
        }
    })

    function generatePlayerInputs(count) {
        gameForm.style.display = 'none'
        playerNamesDiv.innerHTML = '';

        for (let i = 1; i <= count; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = `player${i}`;
            input.placeholder = `Pelaaja ${i} nimi`;
            playerNamesDiv.appendChild(input);
            playerNamesDiv.appendChild(document.createElement('br'));
        }
    }

    function isRadioSelected() {
        const radios = document.querySelectorAll('input[name="playerCount"]');

        for (const radio of radios) {
            if (radio.checked) {
                return true;
            }
        }

        return false;
    }

    function areAnyFieldsEmpty() {
        const inputs = playerNamesDiv.querySelectorAll('input[type="text"]');

        for (const input of inputs) {
            if (input.value.trim() === '') {
                return true;
            }
        }

        return false;
    }

    function isGoalFieldEmpty() {
        const goalPointsInput = document.getElementById('goalPoints').value.trim();
            return goalPointsInput === "" || isNaN(goalPointsInput) || Number(goalPointsInput) <= 0;
    }

    function displayPlayers() {
        playerAmountDiv.style.display = 'none';
        playerNamesDiv.style.display = 'none';
        inputForm.style.display = 'none';
        gameForm.style.display = 'block';

        const playerCount = document.querySelector('input[name="playerCount"]:checked').value;
        gameDiv.innerHTML = '';

        goalPointsValue = parseInt(document.getElementById('goalPoints').value);
        const diceCount = document.querySelector('input[name="diceCount"]:checked').value;

        const goalPoints = document.getElementById('goalPoints').value;
        const goalPointsDiv = document.createElement('div');
        goalPointsDiv.className = 'displayed-goal-points';
        goalPointsDiv.textContent = `Pistetavoite: ${goalPoints}`;
        gameDiv.appendChild(goalPointsDiv);

        playerScores = Array(parseInt(playerCount)).fill(0);

        const playersContainer = document.createElement('div');
        playersContainer.className = 'players-container';

        for (let i = 1; i <= playerCount; i++) {
            const playerName = document.querySelector(`input[name="player${i}"]`).value;
            let diceImages = `<img src="./img/dice1.png" id="dice${i}A" class="dice">`;

            if (diceCount === '2') {
                diceImages += `<img src="./img/dice1.png" id="dice${i}B" class="dice">`;
            }

            const playerDiv = document.createElement('div');
            playerDiv.className = 'player';
            playerDiv.innerHTML = `
            <span class="player-label">Pelaaja ${i}:</span><br>
            <span class="player-name">${playerName}</span><br>
            <span class="dice-img">${diceImages}</span><br>
            <button class="roll-button" data-player="${i}" style="display: none;">Heitä</button>
            <span class="rolled-points" id="rolledPoints${i}">Heitetyt: 0</span>
            <button class="hold-button" data-player="${i}" style="display: none;">Pidä</button>
            <span class="player-score" id="player${i}Score">Pisteet: 0</span><br>`;        
            gameDiv.appendChild(playerDiv);

            const rollButton = playerDiv.querySelector('.roll-button');
            const holdButton = playerDiv.querySelector('.hold-button');
            
            rollButton.addEventListener('click', handleRollClick);
            holdButton.addEventListener('click', handleHoldClick);
        }

        gameDiv.appendChild(playersContainer);

        activePlayer();

        const newGameButton = document.getElementById('newGameButton')
        newGameButton.style.display = 'block';
    }

    function activePlayer() {
        const players = document.querySelectorAll('.player');
        players.forEach((playerDiv, index) => {
            const rollButton = playerDiv.querySelector('.roll-button');
            const holdButton = playerDiv.querySelector('.hold-button');
            const rolledPoints = playerDiv.querySelector('.rolled-points');
    
            if (index === currentPlayerIndex) {
                playerDiv.style.background = 'linear-gradient(to top left, #e0f885 10%, #4c523d 90%)';                
                playerDiv.style.opacity = '1';
                rollButton.style.display = 'block';
                holdButton.style.display = 'block';
                rolledPoints.style.display = 'block';
            } else {
                playerDiv.style.backgroundColor = 'rgba(207, 243, 106, 0.5)';
                playerDiv.style.opacity = '0.3';
                rollButton.style.display = 'none';
                holdButton.style.display = 'none';
                rolledPoints.style.display = 'none';
            }
        });
    }

    function rollDice(playerIndex) {
        const diceCount = document.querySelector('input[name="diceCount"]:checked').value;
        const diceElementA = document.getElementById(`dice${playerIndex}A`);
        const rolledPointsElement = document.getElementById(`rolledPoints${playerIndex}`);
        let lastRolledPointsA = 0;
        let lastRolledPointsB = 0;

        const rollDuration = 600;
        const intervalDuration = 80;
        let elapsedTime = 0;

        if (typeof rollDice.doublesCount === 'undefined') {
            rollDice.doublesCount = Array(playerScores.length).fill(0);
        }

        const diceInterval = setInterval(() => {
            const randomFaceA = Math.floor(Math.random() * 6) + 1;
            diceElementA.src = `./img/dice${randomFaceA}.png`;
            
            lastRolledPointsA = randomFaceA;

            if (diceCount === '2') {
                const diceElementB = document.getElementById(`dice${playerIndex}B`);
                const randomFaceB = Math.floor(Math.random() * 6) + 1;
                diceElementB.src = `./img/dice${randomFaceB}.png`;

                lastRolledPointsB = randomFaceB;
            }

            elapsedTime += intervalDuration;

            if (elapsedTime >= rollDuration) {
                clearInterval(diceInterval);

                if (diceCount === '2') {
                    if (lastRolledPointsA === lastRolledPointsB) {
                        rollDice.doublesCount[playerIndex - 1] += 1;

                        if (rollDice.doublesCount[playerIndex - 1] >= 3) {
                            rolledPointsElement.textContent = `Heitetyt: 0`;
                            currentPlayerIndex = (currentPlayerIndex + 1) % playerScores.length;
                            activePlayer();
                            isRolling = false;
                            return;
                        }
                    } else {
                        rollDice.doublesCount[playerIndex - 1] = 0;
                    }
                }

                if (lastRolledPointsA === 1 && lastRolledPointsB === 1) {
                    const currentRolledPoints = parseInt(rolledPointsElement.textContent.split(': ')[1] || 0);
                    rolledPointsElement.textContent = `Heitetyt: ${currentRolledPoints + 25}`;
                } else if (lastRolledPointsA === 1 || (diceCount === '2' && lastRolledPointsB === 1)) {
                    rolledPointsElement.textContent = `Heitetyt: 0`;
                    currentPlayerIndex = (currentPlayerIndex + 1) % playerScores.length;
                    activePlayer();
                } else {
                    let totalPoints = lastRolledPointsA + (diceCount === '2' ? lastRolledPointsB : 0);
                    if (diceCount === '2' && lastRolledPointsA === lastRolledPointsB) {
                        totalPoints *= 2;
                    }

                    const currentRolledPoints = parseInt(rolledPointsElement.textContent.split(': ')[1] || 0);
                    const updatedRolledPoints = currentRolledPoints + totalPoints;
                    rolledPointsElement.textContent = `Heitetyt: ${updatedRolledPoints}`;
                }
            }
        }, intervalDuration);
    }

    function handleRollClick(event) {
        event.preventDefault();
        const playerIndex = parseInt(this.getAttribute('data-player'));
        rollDice(playerIndex);
    }

    function handleHoldClick(event) {
        event.preventDefault();
        const playerIndex = parseInt(this.getAttribute('data-player'));
        holdPoints(playerIndex);
    }

    function holdPoints(playerIndex) {
        const rolledPointsElement = document.getElementById(`rolledPoints${playerIndex}`)
        const currentRolledPoints = parseInt(rolledPointsElement.textContent.split(': ')[1] || 0);

        updatePlayerScore(playerIndex, currentRolledPoints);

        rolledPointsElement.textContent = `Heitetyt: 0`;

        const scoreElement = document.querySelector(`#player${playerIndex}Score`);
        scoreElement.innerHTML = `Pisteet: ${playerScores[playerIndex - 1]}`;

        if (playerScores[playerIndex -1] >= goalPointsValue) {
            console.log(`Player ${playerIndex} wins with score: ${playerScores[playerIndex - 1]}`);
            declareWinner(playerIndex);
            return;
        }

        currentPlayerIndex = (currentPlayerIndex + 1) % playerScores.length;
        activePlayer();
    }

    function updatePlayerScore(playerIndex, score) {
        playerScores[playerIndex - 1] += score;
    }

    function declareWinner(playerIndex) {
        const playerDiv = document.querySelector(`.player:nth-child(${playerIndex + 1})`);
        const playerName = playerDiv.querySelector('.player-name').textContent;
    
        gameDiv.innerHTML = `<h2>${playerName} voitti pelin!</h2>`;
        gameDiv.querySelector('h2').style.color = '#a5be60';
    
        const buttons = document.querySelectorAll('.roll-button, .hold-button');
        buttons.forEach(button => {
            button.style.display = "none";
        });
    }

});