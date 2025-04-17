document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const wordDisplay = document.getElementById('word-display');
    const messageElement = document.getElementById('message');
    const keyboard = document.getElementById('keyboard');
    const resetBtn = document.getElementById('reset-btn');
    const categoryElement = document.getElementById('category');
    const hangmanParts = document.querySelectorAll('.hangman-part');
    
    // Palavras por categoria
    const wordsByCategory = {
        'Animais': ['ELEFANTE', 'GIRAFA', 'TIGRE', 'LEOPARDO', 'RINOCERONTE', 'HIPOPOTAMO', 'CROCODILO', 'ARARA', 'TUCANO', 'PANTERA'],
        'Países': ['BRASIL', 'ARGENTINA', 'CANADA', 'JAPAO', 'AUSTRALIA', 'ALEMANHA', 'FRANCA', 'ITALIA', 'ESPANHA', 'PORTUGAL'],
        'Frutas': ['BANANA', 'MORANGO', 'ABACAXI', 'LARANJA', 'MELANCIA', 'UVA', 'MANGA', 'KIWI', 'MELAO', 'AMORA'],
        'Objetos': ['TELEFONE', 'COMPUTADOR', 'CADERNO', 'CANETA', 'TESOURA', 'GUARDA-CHUVA', 'RELOGIO', 'OCULOS', 'CADEIRA', 'MESA'],
        'Linguagens de Programação': ['LUA', 'JAVA', 'PYTHON', 'JAVASCRIPT', 'REACT', 'HTML', 'ASPNET', 'COBOL']
    };
    
    // Variáveis do jogo
    let selectedWord = '';
    let guessedLetters = [];
    let wrongGuesses = 0;
    let currentCategory = '';
    const maxWrongGuesses = 6;
    
    // Inicializa o teclado
    function initializeKeyboard() {
        keyboard.innerHTML = '';
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);
            const button = document.createElement('button');
            button.textContent = letter;
            button.className = 'letter-btn';
            button.id = `letter-${letter}`;
            button.addEventListener('click', () => handleGuess(letter));
            keyboard.appendChild(button);
        }
    }
    
    // Seleciona uma palavra aleatória
    function selectRandomWord() {
        const categories = Object.keys(wordsByCategory);
        currentCategory = categories[Math.floor(Math.random() * categories.length)];
        const words = wordsByCategory[currentCategory];
        selectedWord = words[Math.floor(Math.random() * words.length)];
        guessedLetters = [];
        wrongGuesses = 0;
        
        // Atualiza a categoria
        categoryElement.textContent = `Categoria: ${currentCategory}`;
        
        // Esconde todas as partes do boneco
        hangmanParts.forEach(part => part.style.display = 'none');
        
        // Mostra apenas a base
        document.getElementById('base').style.display = 'block';
        document.getElementById('pole').style.display = 'block';
        document.getElementById('top-bar').style.display = 'block';
        document.getElementById('rope').style.display = 'block';
        
        // Atualiza a exibição da palavra
        updateWordDisplay();
        
        // Limpa a mensagem
        messageElement.textContent = '';
        messageElement.className = '';
        
        // Habilita todos os botões
        document.querySelectorAll('.letter-btn').forEach(btn => {
            btn.disabled = false;
        });
    }
    
    // Atualiza a exibição da palavra
    function updateWordDisplay() {
        wordDisplay.textContent = selectedWord
            .split('')
            .map(letter => guessedLetters.includes(letter) ? letter : '_')
            .join(' ');
    }
    
    // Processa um palpite
    function handleGuess(letter) {
        if (guessedLetters.includes(letter)) return;
        
        guessedLetters.push(letter);
        document.getElementById(`letter-${letter}`).disabled = true;
        
        if (selectedWord.includes(letter)) {
            // Letra correta
            document.getElementById(`letter-${letter}`).style.backgroundColor = '#4CAF50';
            document.getElementById(`letter-${letter}`).style.color = 'white';
            updateWordDisplay();
            checkWin();
        } else {
            // Letra incorreta
            wrongGuesses++;
            document.getElementById(`letter-${letter}`).style.backgroundColor = 'red';
            document.getElementById(`letter-${letter}`).style.color = 'white';  
            updateHangman();
            checkLose();
        }
    }
    
    // Atualiza o desenho da forca
    function updateHangman() {
        switch(wrongGuesses) {
            case 1:
                document.getElementById('head').style.display = 'block';
                break;
            case 2:
                document.getElementById('body').style.display = 'block';
                break;
            case 3:
                document.getElementById('left-arm').style.display = 'block';
                break;
            case 4:
                document.getElementById('right-arm').style.display = 'block';
                break;
            case 5:
                document.getElementById('left-leg').style.display = 'block';
                break;
            case 6:
                document.getElementById('right-leg').style.display = 'block';
                break;
        }
    }
    
    // Verifica se o jogador ganhou
    function checkWin() {
        if (selectedWord.split('').every(letter => guessedLetters.includes(letter))) {
            messageElement.textContent = 'Parabéns! Você ganhou!';
            messageElement.className = 'win';
            disableAllButtons();
        }
    }
    
    // Verifica se o jogador perdeu
    function checkLose() {
        if (wrongGuesses >= maxWrongGuesses) {
            messageElement.textContent = `Game Over! A palavra era: ${selectedWord}`;
            messageElement.className = 'lose';
            wordDisplay.textContent = selectedWord.split('').join(' ');
            disableAllButtons();
        }
    }
    
    // Desabilita todos os botões
    function disableAllButtons() {
        document.querySelectorAll('.letter-btn').forEach(btn => {
            btn.disabled = true;
        });
    }
    
    // Event listeners
    resetBtn.addEventListener('click', () => {
        selectRandomWord();
        initializeKeyboard();
    });
    
    // Inicializa o jogo
    initializeKeyboard();
    selectRandomWord();
    
    // Adiciona suporte para teclado físico
    document.addEventListener('keydown', (e) => {
        if (e.keyCode >= 65 && e.keyCode <= 90) {
            const letter = e.key.toUpperCase();
            const button = document.getElementById(`letter-${letter}`);
            if (button && !button.disabled) {
                button.click();
            }
        }
    });
});