let zombie = null;
let totalDoors = 0;
let formulaAnswer = 0;
let gameActive = false;
let maxDoors = 5; // Det maximala antalet dörrar

// Funktion för att skapa dörrknappar
function skapaDörrar(antalDörrar) {
  totalDoors = antalDörrar;
  const doorsContainer = document.getElementById("doors");
  doorsContainer.innerHTML = ""; // Rensa gamla dörrar

  // Skapa knappar för varje dörr
  for (let i = 1; i <= antalDörrar; i++) {
    const doorButton = document.createElement("button");
    doorButton.classList.add("door");
    // doorButton.innerText = `Dörr ${i}`;
    doorButton.onclick = () => väljDörr(i);
    doorButton.disabled = false; // Dörren är aktiv och kan klickas på
    doorsContainer.appendChild(doorButton);
  }

  // Välj en slumpmässig dörr för zombien
  zombie = Math.floor(Math.random() * antalDörrar) + 1;
  gameActive = true; // Spelet är aktivt efter att dörrarna skapats
}

// Funktion som körs när en dörr väljs
function väljDörr(dörrNummer) {
  const status = document.getElementById("status");

  if (dörrNummer === zombie) {
    status.innerText = "Du hittade zombien! Spelet är slut.";
    taBortDörrar(); // Ta bort alla dörrar när spelet är slut
    inaktiveraDörrar(); // Inaktivera alla dörrar
    visaOmstartsknapp(); // Visa omstartsknapp
    maxDoors = 5;
    visaOmstartsknapp();
  } else {
    // Ta bort dörren från spelet
    taBortDörr(dörrNummer);

    totalDoors--;
    maxDoors = totalDoors;

    // Om bara en dörr återstår → spelaren vinner
    if (totalDoors === 1) {
      status.innerText =
        "Grattis! Du har överlevt och hittat den sista dörren!";
      taBortDörrar();
      inaktiveraDörrar(); // Inaktivera alla dörrar
      visaOmstartsknapp(); // Visa omstartsknapp
      maxDoors = 5;
    } else {
      status.innerText = `Bra jobbat! Men zombien gömmer sig fortfarande...`;
      // Vi skippar att skapa dörrar igen, då antalet dörrar redan är hanterat
    }
  }
  document.getElementById("doors").style.display = "none";
  ställFråga();
}

// Funktion för att ta bort alla dörrar
function taBortDörrar() {
  const doorsContainer = document.getElementById("doors");
  doorsContainer.innerHTML = ""; // Rensa alla dörrar
}

// Funktion för att ta bort en specifik dörr
function taBortDörr(dörrNummer) {
  const doorsContainer = document.getElementById("doors");
  const dörrKnapp = doorsContainer.querySelector(
    `button:nth-child(${dörrNummer})`
  );
  if (dörrKnapp) dörrKnapp.remove();
}

// Funktion för att inaktivera dörrar
function inaktiveraDörrar() {
  const doors = document.querySelectorAll(".door");
  doors.forEach((door) => (door.disabled = true));
}

// Funktion för att kontrollera användarens svar på mattefrågan
function submitAnswer() {
  const userAnswer = parseInt(document.getElementById("answerInput").value, 10);
  const status = document.getElementById("status");
  document.getElementById("doors").style.display = "block";

  if (userAnswer === formulaAnswer) {
    status.innerText = "✅ Rätt svar! Välj en dörr.";
    document.getElementById("answerInput").value = ""; // Rensa inputfältet
    skapaDörrar(maxDoors); // Skapa dörrarna med det maximala antalet
  } else {
    status.innerText = "❌ Fel svar. Försök igen!";
    taBortDörrar(); // Ta bort alla dörrar när spelet är slut
    inaktiveraDörrar(); // Inaktivera alla dörrar
    visaOmstartsknapp(); // Visa omstartsknapp
    maxDoors = 5;
  }
}

// Ställ en mattefråga till spelaren
function ställFråga() {
  const tal = Math.floor(Math.random() * 10) + 1;
  const tabell = Math.floor(Math.random() * 10) + 1;

  formulaAnswer = tal * tabell;
  document.getElementById("formula").innerText = `Vad är: ${tal} * ${tabell}?`;

  // Återställ input och fokusera på fältet
  const answerInput = document.getElementById("answerInput");
  answerInput.value = "";
  answerInput.focus();

  // Lägg till eventlistener igen för att hantera "Enter" (för säkerhets skull)
  answerInput.removeEventListener("keydown", enterHandler);
  answerInput.addEventListener("keydown", enterHandler);
}

// Fungerar när man trycker på Enter
function enterHandler(event) {
  if (event.key === "Enter") {
    submitAnswer();
  }
}

// Funktion för att starta spelet
function startGame() {
  gameActive = false; // Se till att spelet inte körs direkt
  document.getElementById("status").innerText = "";
  document.getElementById("answerInput").value = ""; // Rensa fältet
  document.getElementById("doors").innerHTML = ""; // Rensa dörrarna

  document.getElementById("welcomeText").innerText =
    "Efter varje mattefråga får du välja en dörr. Hittar du zombien är spelet slut.";

  ställFråga(); // Starta med en mattefråga
}
document.addEventListener("DOMContentLoaded", function () {
  const startScreen = document.getElementById("startScreen");
  const gameScreen = document.getElementById("gameScreen");
  const playerNameInput = document.getElementById("playerName");
  const operationSelect = document.getElementById("operation");
  const multiplicationSettings = document.getElementById(
    "multiplicationSettings"
  );
  const maxNumeratorInput = document.getElementById("maxNumerator");
  const maxDenominatorInput = document.getElementById("maxDenominator");
  const startGameButton = document.getElementById("startGame");

  let playerName = "";
  let selectedOperation = "addition";
  let maxNumerator = 10;
  let maxDenominator = 10;

  // Visa/dölj multiplikationsinställningar baserat på val
  operationSelect.addEventListener("change", function () {
    if (operationSelect.value === "multiplication") {
      multiplicationSettings.style.display = "block";
    } else {
      multiplicationSettings.style.display = "none";
    }
  });

  // Starta spelet när spelaren klickar på "Starta spelet"
  startGameButton.addEventListener("click", function () {
    playerName = playerNameInput.value.trim();
    selectedOperation = operationSelect.value;
    maxNumerator = parseInt(maxNumeratorInput.value);
    maxDenominator = parseInt(maxDenominatorInput.value);

    if (playerName === "") {
      alert("Skriv ditt namn innan du börjar!");
      return;
    }

    // Spara valen och gå till spelet
    startScreen.style.display = "none";
    gameScreen.style.display = "block";

    startMathGame(playerName, selectedOperation, maxNumerator, maxDenominator);
  });

  function startMathGame(name, operation, maxNum, maxDen) {
    console.log(`Spelare: ${name}`);
    console.log(`Räknesätt: ${operation}`);
    if (operation === "multiplication") {
      console.log(`Max täljare: ${maxNum}, Max nämnare: ${maxDen}`);
    }
    // Här kan du starta spelets funktionalitet
  }
});

function startaOm() {
  document.getElementById("restartButton").style.display = "none"; // Dölj knappen
  document.getElementById("status").innerText = ""; // Nollställ status

  // Återställ spelets logik
  maxDoors = 5;
  zombie = Math.floor(Math.random() * maxDoors) + 1;
  // ställa ny fråga
  ställFråga();
}

function visaOmstartsknapp() {
  let restartButton = document.getElementById("restartButton");

  // Om knappen inte finns, skapa den
  if (!restartButton) {
    restartButton = document.createElement("button");
    restartButton.id = "restartButton";
    restartButton.innerText = "Spela igen"; // Texten sätts här
    restartButton.onclick = startaOm;
    document.getElementById("reset").appendChild(restartButton); // Lägg till knappen i reset-diven
  }

  // Visa knappen
  restartButton.style.display = "block";
}

// Ladda spelet när sidan öppnas
window.onload = startGame;
