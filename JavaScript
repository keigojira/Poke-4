// ゲームの基本データ
const cards = [
    { name: 'ピカチュウ', type: 'でんき', hp: 50, attack: 20, ability: 'かみなり', evolution: 'ライチュウ' },
    { name: 'フシギダネ', type: 'くさ', hp: 60, attack: 15, ability: 'はっぱカッター', evolution: 'フシギソウ' },
    { name: 'ヒトカゲ', type: 'ほのお', hp: 40, attack: 25, ability: 'ひのこ', evolution: 'リザード' },
    { name: 'ゼニガメ', type: 'みず', hp: 50, attack: 18, ability: 'みずでっぽう', evolution: 'カメール' }
];

let playerDeck = [];
let opponentDeck = [];
let playerEnergy = 3;
let opponentEnergy = 3;
let playerTurn = true;
let playerPokemon = null;
let opponentPokemon = null;

// ゲームの初期化
function initializeGame() {
    playerDeck = generateDeck();
    opponentDeck = generateDeck();

    dealCards(playerDeck, 'player-hand');
    dealCards(opponentDeck, 'opponent-hand');

    startTurn();
}

// デッキ生成
function generateDeck() {
    return [...cards]; // 今回は簡単のため全カードを使用
}

// カードを手札に配布
function dealCards(deck, areaId) {
    const handArea = document.getElementById(areaId);
    handArea.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const card = deck[i];
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.setAttribute('draggable', 'true');
        cardDiv.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <h3>${card.name}</h3>
                    <p>HP: ${card.hp}</p>
                    <p>技: ${card.ability}</p>
                </div>
                <div class="card-back">
                    <p>進化: ${card.evolution}</p>
                </div>
            </div>
        `;
        cardDiv.addEventListener('click', () => showCardDetails(card));
        handArea.appendChild(cardDiv);
    }
}

// ゲームログの更新
function updateGameLog(message) {
    const logArea = document.getElementById('game-log');
    logArea.innerHTML = message;
}

// カードの詳細を表示
function showCardDetails(card) {
    const detailsArea = document.getElementById('card-details');
    detailsArea.style.display = 'block';
    detailsArea.innerHTML = `
        <h2>${card.name}</h2>
        <p>タイプ: ${card.type}</p>
        <p>HP: ${card.hp}</p>
        <p>攻撃: ${card.attack}</p>
        <p>技: ${card.ability}</p>
        <p>進化: ${card.evolution}</p>
        <button onclick="hideCardDetails()">閉じる</button>
    `;
}

// 詳細を隠す
function hideCardDetails() {
    const detailsArea = document.getElementById('card-details');
    detailsArea.style.display = 'none';
}

// プレイヤーがカードを選んだとき
function onCardClick(card) {
    if (!playerTurn) return;
    const cardElement = document.querySelector(`[data-card-name="${card.name}"]`);
    cardElement.classList.add('animation');  // アニメーションクラスを追加

    // 攻撃アニメーション
    setTimeout(() => {
        updateGameLog(`${card.name}の技「${card.ability}」を使用！`);
        opponentPokemon.hp -= card.attack;

        // 相手ポケモンがHP0以下になったら
        if (opponentPokemon.hp <= 0) {
            updateGameLog(`${opponentPokemon.name}を倒しました！`);
            opponentPokemon = null;
        }

        playerTurn = false;
        opponentTurn();
    }, 1000); // 1秒後に攻撃

    // アニメーション後にリセット
    setTimeout(() => {
        cardElement.classList.remove('animation');
    }, 1500);  // アニメーションが終わった後
}

// 相手のターンでカードが攻撃するアニメーション
function opponentTurn() {
    setTimeout(() => {
        const randomCard = opponentDeck[Math.floor(Math.random() * opponentDeck.length)];
        updateGameLog(`相手が技「${randomCard.ability}」を使用！`);
        opponentPokemon.hp -= randomCard.attack;

        if (opponentPokemon.hp <= 0) {
            updateGameLog(`${opponentPokemon.name}を倒しました！`);
            opponentPokemon = null;
        }

        playerTurn = true;
        updateGameLog('あなたのターンです');
    }, 1500);
}
