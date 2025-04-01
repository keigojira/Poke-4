// ゲームの基本データ
const cards = [
    { name: 'ピカチュウ', type: 'でんき', hp: 50, attack: 20, energyCost: { 'でんき': 2 }, ability: 'かみなり', specialAbility: null, evolution: 'ライチュウ' },
    { name: 'フシギダネ', type: 'くさ', hp: 60, attack: 15, energyCost: { 'くさ': 1, 'みず': 1 }, ability: 'はっぱカッター', specialAbility: null, evolution: 'フシギソウ' },
    { name: 'ヒトカゲ', type: 'ほのお', hp: 40, attack: 25, energyCost: { 'ほのお': 2 }, ability: 'ひのこ', specialAbility: 'やけど', evolution: 'リザード' },
    { name: 'ゼニガメ', type: 'みず', hp: 50, attack: 18, energyCost: { 'みず': 2 }, ability: 'みずでっぽう', specialAbility: 'どく', evolution: 'カメール' },
    { name: 'サポートカード', type: 'サポート', hp: 0, attack: 0, energyCost: { 'サポート': 1 }, ability: 'エネルギー回復', specialAbility: null, evolution: null }, // サポートカードの例
];

let playerDeck = [];
let opponentDeck = [];
let playerEnergy = 3; // プレイヤーのエネルギー
let opponentEnergy = 3; // 相手のエネルギー
let playerTurn = true; // プレイヤーのターンかどうか
let playerPokemon = null;
let opponentPokemon = null;

// ゲームの初期化
function initializeGame() {
    // プレイヤーと相手のデッキをランダムに選ぶ
    playerDeck = generateDeck();
    opponentDeck = generateDeck();

    // カードを配る
    dealCards(playerDeck, 'player-hand');
    dealCards(opponentDeck, 'opponent-hand');

    // プレイヤーターンで開始
    startTurn();
}

// デッキ生成
function generateDeck() {
    return [...cards]; // 今回は簡単のため全カードを使う
}

// カードを手札に配布
function dealCards(deck, areaId) {
    const handArea = document.getElementById(areaId);
    handArea.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const card = deck[i];
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerHTML = `
            <h3>${card.name}</h3>
            <p>HP: ${card.hp}</p>
            <p>技: ${card.ability}</p>
        `;
        cardDiv.onclick = () => onCardClick(card); // カードクリック時の処理
        handArea.appendChild(cardDiv);
    }
}

// ゲームログの更新
function updateGameLog(message) {
    const logArea = document.getElementById('game-log');
    logArea.innerHTML = message;
}

// プレイヤーがカードを選んだとき
function onCardClick(card) {
    if (!playerTurn) return;

    if (card.type === 'サポート') {
        useSupportCard(card);
    } else if (playerEnergy >= card.energyCost['でんき'] || playerEnergy >= card.energyCost['くさ'] || playerEnergy >= card.energyCost['みず']) {
        // エネルギーが足りている場合は技を使用
        useAbility(card);
    } else {
        updateGameLog('エネルギーが足りません！');
    }
}

// 技を使用する
function useAbility(card) {
    playerEnergy -= card.energyCost['でんき'] || card.energyCost['くさ'] || card.energyCost['みず']; // エネルギー消費
    updateGameLog(`${card.name}の技「${card.ability}」を使用！`);

    // バトルアニメーション
    battleAnimation(card, opponentPokemon);

    opponentPokemon.hp -= card.attack; // 相手にダメージを与える
    if (card.specialAbility === 'やけど') {
        opponentPokemon.hp -= 5; // やけどのダメージ
        updateGameLog(`${opponentPokemon.name}はやけどにより毎ターンダメージを受けています！`);
    } else if (card.specialAbility === 'どく') {
        opponentPokemon.hp -= 3; // どくのダメージ
        updateGameLog(`${opponentPokemon.name}はどくでダメージを受けています！`);
    }

    if (opponentPokemon.hp <= 0) {
        updateGameLog(`${opponentPokemon.name}を倒しました！`);
        opponentPokemon = null; // 相手のポケモンが倒された
    }

    // ターンを交代
    playerTurn = false;
    opponentTurn();
}

// 相手のターン
function opponentTurn() {
    setTimeout(() => {
        if (!opponentPokemon) {
            updateGameLog('相手はポケモンを出していません！');
            return;
        }

        // 相手のランダムな技選択
        const randomCard = opponentDeck[Math.floor(Math.random() * opponentDeck.length)];
        updateGameLog(`相手が技「${randomCard.ability}」を使用！`);

        battleAnimation(randomCard, playerPokemon); // バトルアニメーション

        playerPokemon.hp -= randomCard.attack; // プレイヤーにダメージ
        if (randomCard.specialAbility === 'やけど') {
            playerPokemon.hp -= 5; // やけどのダメージ
            updateGameLog(`${playerPokemon.name}はやけどでダメージを受けています！`);
        } else if (randomCard.specialAbility === 'どく') {
            playerPokemon.hp -= 3; // どくのダメージ
            updateGameLog(`${playerPokemon.name}はどくでダメージを受けています！`);
        }

        if (playerPokemon.hp <= 0) {
            updateGameLog(`${playerPokemon.name}が倒されました！`);
            playerPokemon = null; // プレイヤーのポケモンが倒された
        }

        playerTurn = true;
        startTurn();
    }, 1000);
}

// プレイヤーのターン開始
function startTurn() {
    if (playerPokemon) {
        updateGameLog(`あなたのターンです。ポケモン: ${playerPokemon.name} (HP: ${playerPokemon.hp})`);
    } else {
        updateGameLog('あなたのポケモンが倒されました。');
    }

    // ターン開始時にエネルギー回復
    playerEnergy = Math.min(playerEnergy + 1, 10); // 最大エネルギーは10
    opponentEnergy = Math.min(opponentEnergy + 1, 10);
    updateGameLog(`エネルギーが回復しました！ プレイヤー: ${playerEnergy} / 相手: ${opponentEnergy}`);
}

// バトルアニメーション
function battleAnimation(card, target) {
    const battleField = document.getElementById('battle-field');
    battleField.innerHTML = `
        <p>技「${card.ability}」がヒット！</p>
        <div class="animation">💥</div>
    `;
    setTimeout(() => {
        battleField.innerHTML = '';
    }, 1500);
}

// サポートカードを使用する
function useSupportCard(card) {
    playerEnergy += 3; // サポートカードでエネルギー回復
    updateGameLog(`${card.name}を使用してエネルギーが回復！`);
    playerTurn = false;
    opponentTurn();
}

// 進化
function evolvePokemon() {
    if (playerPokemon.evolution) {
        updateGameLog(`${playerPokemon.name}が進化！`);
        playerPokemon.name = playerPokemon.evolution; // 進化後の名前
        playerPokemon.hp += 20; // 進化によるHPの増加
        playerPokemon.attack += 10; // 進化による攻撃力の増加
    }
}

// 初期化
initializeGame();
