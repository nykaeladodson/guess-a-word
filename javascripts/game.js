document.addEventListener('DOMContentLoaded', event => {
  const message = document.querySelector("#message");
  const letters = document.querySelector("#spaces");
  const guesses = document.querySelector("#guesses");
  const apples = document.querySelector("#apples");
  const replay = document.querySelector("#replay");

  randomWord = function() {
    let words = ['apple', 'banana', 'orange', 'pear'];
  
    return function() {
      let index = Math.floor(Math.random() * words.length);
      let chosenWord = words[index];
      words.splice(index, 1);
      return chosenWord;
    }
  }();

  class Game {
    constructor() {
      this.incorrect = 0;
      this.lettersGuessed = [];
      this.correctLetters = 0;

      this.word = randomWord();
      if (!this.word) {
        this.displayMessage("Sorry, I've run out of words!");
        return this;
      }
      this.word = this.word.split("");

      this.createBlanks();
      this.bind();
      this.resetGuesses();
      this.setClass();
    }

    createBlanks() {
      let spaces = (new Array(this.word.length + 1)).join("<span></span>");

      let spans = letters.querySelectorAll("span");
      spans.forEach(span => {
        span.parentNode.removeChild(span);
      });
      letters.insertAdjacentHTML('beforeend', spaces);
      this.spaces = document.querySelectorAll("#spaces span");
    }

    processGuess(e) {
      let letter = e.key;

      if (this.lettersGuessed.includes(letter) || !this.validLetter(letter)) {
        return;
      } else {
        this.lettersGuessed.push(letter);
      }

      this.addGuess(letter);

      if (this.word.includes(letter)) {
        this.addLetters(letter);
      } else {
        this.incorrect += 1;
        this.setClass();
        if (this.incorrect >= 6) { this.lose() }
      }

      if (this.correctLetters === this.word.length) {
        this.win();
      }
    }

    setClass() {
      apples.classList.remove(...apples.classList);
      apples.classList.add("guess_" + this.incorrect);
    }

    addGuess(letter) {
      let guessContainer = document.querySelector('#guesses h2');
      guessContainer.textContent += ` ${letter.toUpperCase()} `
    }

    addLetters(letter) {
      let idxes = this.findAllIndexes(letter);
      let spans = Array.prototype.slice.call(document.querySelectorAll('span'));
      spans.forEach((span, idx) => {
        if (idxes.includes(idx)) {
          span.textContent = letter;
        }
      });

      this.correctLetters += idxes.length;
    }

    findAllIndexes(letter) {
      let idxes = [];
      this.word.forEach((currentLet, idx) => {
        if (currentLet === letter) {
          idxes.push(idx);
        }
      });

      return idxes;
    }

    validLetter(letter) {
      return letter >= 'a' && letter <= 'z';
    }

    resetGuesses() {
      let guessContainer = document.querySelector('#guesses h2');
      guessContainer.textContent = 'Guesses:'
    }

    bind() {
      this.processGuessHandler = (e) => this.processGuess(e);
      document.addEventListener('keyup', this.processGuessHandler);
    }

    unbind() {
      document.removeEventListener('keyup', this.processGuessHandler);
    }

    win() {
      let message = 'Congratulations! You won!'
      let p = document.querySelector('#message');
      p.textContent = message;
      this.unbind();
    }

    lose() {
      let message = `Uh-oh! You're out of guesses! The word is ${this.word.join('')}.`;
      let p = document.querySelector('#message');
      p.textContent = message;
      this.unbind();
    }
  }

  new Game(); 

  document.querySelector('#replay').addEventListener('click', e => {
    e.preventDefault();
    new Game();
  });
});








