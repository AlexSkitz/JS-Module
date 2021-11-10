function filterDropdownGenre() {
    document.getElementById("myDropdownGenre").classList.toggle("showGenre");
}
window.onclick = function(event) {
  if (!event.target.matches('.dropbtngenre')) {

    let dropdowns = document.getElementsByClassName("dropdown-content-genre");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('showGenre')) {
        openDropdown.classList.remove('showGenre');
      }
    }
  }
}
///////
function filterDropdownLanguage() {
    document.getElementById("myDropdownLanguage").classList.toggle("showLanguage");
}
window.onclick = function(event) {
  if (!event.target.matches('.dropbtnlanguage')) {

    let dropdowns = document.getElementsByClassName("dropdown-content-language");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('showLanguage')) {
        openDropdown.classList.remove('showLanguage');
      }
    }
  }
}
///////