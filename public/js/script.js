// Funkcja rozwijająca pasek wyszukiwania
function toggleSearch() {
    const searchBar = document.getElementById("searchBar");
    const isVisible = searchBar.classList.contains("visible");

    if (isVisible) {
        searchBar.classList.remove("visible");
    } else {
        searchBar.classList.add("visible");
    }
}

// Funkcja do zamknięcia paska wyszukiwania po kliknięciu w krzyżyk
function closeSearchBar() {
    const searchBar = document.getElementById("searchBar");
    searchBar.classList.remove("visible");
}

// Przypisanie event listenerów
document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.querySelector(".searchBtn");
    const closeBtn = document.getElementById("closeSearchBar");

    if (searchBtn) {
        searchBtn.addEventListener("click", toggleSearch); //Przyciski otwierania
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeSearchBar); //Krzyżyk do zamknięcia
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const dropbtn = document.querySelector(".dropbtn");
    const dropdown = document.querySelector(".dropdown-content");

    dropbtn.addEventListener("click", function (event) {
        event.preventDefault();
        const isVisible = dropdown.style.visibility === "visible";
        
        dropdown.style.visibility = isVisible ? "hidden" : "visible";
        dropdown.style.opacity = isVisible ? "0" : "1";
    });

    // Zamknięcie menu po kliknięciu poza nim
    document.addEventListener("click", function (event) {
        if (!dropbtn.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.visibility = "hidden";
            dropdown.style.opacity = "0";
        }
    });
});

//pop ups
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');

if (msg === 'loggedIn') {
  alert('Zalogowano pomyślnie!');

  // Delete msg
  const newUrl = window.location.origin + window.location.pathname;
  window.history.replaceState(null, "", newUrl);
}
if (msg === 'loggedOut') {
    alert('Wylogowano pomyślnie!');
  
    // Delete msg
    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }

  if (msg === 'errorLogin') {
    alert('Błąd! Nieprawidłowe dane logowania.');
  
    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }