document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const wordDisplay = document.getElementById('word-display');
    const messageElement = document.getElementById('message');
    const keyboard = document.getElementById('keyboard');
    const resetBtn = document.getElementById('reset-btn');
    const startBtn = document.getElementById('start-btn');
    const categoryElement = document.getElementById('category');
    const hangmanParts = document.querySelectorAll('.hangman-part');
    const gamerContainer = document.getElementById('game-container');
    const startCotainer = document.getElementById('game-start');
    
    // Palavras por categoria
    const opcoesPalavrasPorCategoria = {
        'Animais': ['ELEFANTE', 'GIRAFA', 'TIGRE', 'LEOPARDO', 'RINOCERONTE', 'HIPOPOTAMO', 'CROCODILO', 'ARARA', 'TUCANO', 'PANTERA'],
        'Países': ['BRASIL', 'ARGENTINA', 'CANADA', 'JAPAO', 'AUSTRALIA', 'ALEMANHA', 'FRANCA', 'ITALIA', 'ESPANHA', 'PORTUGAL'],
        'Frutas': ['BANANA', 'MORANGO', 'ABACAXI', 'LARANJA', 'MELANCIA', 'UVA', 'MANGA', 'KIWI', 'MELAO', 'AMORA'],
        'Objetos': ['TELEFONE', 'COMPUTADOR', 'CADERNO', 'CANETA', 'TESOURA', 'GUARDA-CHUVA', 'RELOGIO', 'OCULOS', 'CADEIRA', 'MESA'],
        'Linguagens de Programação': ['LUA', 'JAVA', 'PYTHON', 'JAVASCRIPT', 'TYPESCRIPT', 'PHP', 'ASPNET', 'COBOL'],
        'Esportes' : ['JUDO', 'TENIS', 'MOTOCICLISMO', 'AUTOMOBILISMO', 'FISICULTURISMO', 'HIPISMO', 'BEACHTENNIS', 'SOFTBALL']
    };
    
    // Variáveis do jogo
    let palavraSelecionada = '';
    let categoriaSelecionada = '';
    let contagemErro = 0;
    const maxContagemErro = 6;
    let letrasEscolhidas = [];
    
    // Inicializa o teclado
    function montaLetrasEmTela() {
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
    function selecionaPalavraAleatoria() {
        const categorias = Object.keys(opcoesPalavrasPorCategoria);
        categoriaSelecionada = categorias[Math.floor(Math.random() * categorias.length)];
        const palavras = opcoesPalavrasPorCategoria[categoriaSelecionada];
        palavraSelecionada = palavras[Math.floor(Math.random() * palavras.length)];
        letrasEscolhidas = [];
        contagemErro = 0;
        
        // Atualiza a categoria
        categoryElement.textContent = `Categoria: ${categoriaSelecionada}`;
        
        // Esconde todas as partes do boneco
        hangmanParts.forEach(part => part.style.display = 'none');
        
        // Mostra apenas a base
        document.getElementById('base').style.display = 'block';
        document.getElementById('pole').style.display = 'block';
        document.getElementById('top-bar').style.display = 'block';
        document.getElementById('rope').style.display = 'block';
        
        // Atualiza a exibição da palavra
        atualizaPalavra();
        
        // Limpa a mensagem
        messageElement.textContent = '';
        messageElement.className = '';
        
        // Habilita todos os botões
        document.querySelectorAll('.letter-btn').forEach(btn => {
            btn.disabled = false;
        });
    }
    
    // Atualiza a exibição da palavra
    function atualizaPalavra() {
        wordDisplay.textContent = palavraSelecionada
            .split('')
            .map(letter => letrasEscolhidas.includes(letter) ? letter : '_')
            .join(' ');
    }
    
    // Processa um palpite
    function handleGuess(letter) {
        if (letrasEscolhidas.includes(letter)) return;
        
        letrasEscolhidas.push(letter);
        document.getElementById(`letter-${letter}`).disabled = true;
        
        if (palavraSelecionada.includes(letter)) {
            // Letra correta
            document.getElementById(`letter-${letter}`).style.backgroundColor = '#4CAF50';
            document.getElementById(`letter-${letter}`).style.color = '#FFFFFF';
            atualizaPalavra();
            verificaWin();
        } else {
            // Letra incorreta
            contagemErro++;
            document.getElementById(`letter-${letter}`).style.backgroundColor = '#FF0000';
            document.getElementById(`letter-${letter}`).style.color = '#FFFFFF';  
            adicionaPedacoCorpo();
            verificaGameOver();
        }
    }
    
    // Atualiza o desenho da forca
    function adicionaPedacoCorpo() {
        switch(contagemErro) {
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
    function verificaWin() {
        if (palavraSelecionada.split('').every(letter => letrasEscolhidas.includes(letter))) {
            messageElement.textContent = 'Parabéns! Você ganhou!';
            messageElement.className = 'win';
            bloqueiaTentativas();
        }
    }
    
    // Verifica se o jogador perdeu
    function verificaGameOver() {
        if (contagemErro >= maxContagemErro) {
            messageElement.textContent = `Game Over! A palavra era: ${palavraSelecionada}`;
            messageElement.className = 'lose';
            wordDisplay.textContent = palavraSelecionada.split('').join(' ');
            bloqueiaTentativas();
        }
    }
    
    // Desabilita todos os botões
    function bloqueiaTentativas() {
        document.querySelectorAll('.letter-btn').forEach(btn => {
            btn.disabled = true;
        });
    }
    
    // Event listeners
    resetBtn.addEventListener('click', () => {
        selecionaPalavraAleatoria();
        montaLetrasEmTela();
    });

    startBtn.addEventListener('click', () => {
        startCotainer.style.display = "none";
        gamerContainer.style.opacity = 0.8;
        gamerContainer.classList.add('fade-out');
    });
    
    // Inicializa o jogo
    montaLetrasEmTela();
    selecionaPalavraAleatoria();
    
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