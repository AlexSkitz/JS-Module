const myVariables = {
    paginationPages: 0,
    currentPaginationPage: 1,
    itemOnPage: 10,
    loading: 0,
    filter: {
        lang: "Lang",
        genre: "Genre",
    }
}

const myStorage = window.localStorage;

const filmData = (page) => {
    fetch(`https://api.tvmaze.com/shows?page=${page}`)
        .then(response => response.json())
        .then((jsonData) => {
            if (jsonData.length > 0) {
                let filter = document.querySelector(".filter");
                filter.classList.remove("hide");

                createFilter(jsonData);
                createResultList(jsonData);
            }
        });
}

const filmsSearch = () => {
    let searchField = document.getElementById("main-search");
    if (searchField.value.length < 0) {
        return;
    }

    const url = `http://api.tvmaze.com/search/shows?q=${searchField.value}`;
    
    searchField.value = '';

    fetch(url)
        .then(response => response.json())
        .then((jsonData) => {
            if (jsonData.length > 0) {
                let filter = document.querySelector(".filter");
                filter.classList.add("hide");
                let convertData = [];
                convertData = jsonData.map(elem => elem.show);
                createResultList(convertData);
            }
        });
}

const createFilter = (jsonData) => {
    let langFilter = {};
    let genreFilter = {};
    jsonData.map(element => {
        if (element.language) {
            langFilter[element.language] = element.language;
        }
        if (element.genres) {
            element.genres.map(el => genreFilter[el] = el);
        }
    });
    let langFilterList = document.getElementById("language-filter");
    let genreFilterList = document.getElementById("genre-filter");

    langFilterList.innerHTML = '<li class="filter_li_ti">Language</li>';
    for (let key in langFilter) {
        let li = document.createElement('li');
        li.innerText = langFilter[key];
        langFilterList.append(li);
    };
    genreFilterList.innerHTML = '<li class ="filter_li_ti"> Genre</li>';
    for(let key in genreFilter){
        let li = document.createElement('li');
        li.innerText = genreFilter[key];
        genreFilterList.append(li);
    }
}

const createResultList = (jsonData) => {
    let target = document.querySelector(".films-list-inner");
    target.innerHTML = "";

    if (jsonData.length === 0) {
        myVariables.currentPaginationPage = 0;
        myVariables.paginationPages = 0;
        document.getElementById("pagination-list").innerHTML = "";
        document.getElementById("pagination-page").innerText = myVariables.currentPaginationPage;
        document.getElementById("pagination-pages").innerText = myVariables.paginationPages;
        return;
    }
    let windowAmount = 0;
    if ((jsonData.length % myVariables.itemOnPage) > 0) {
        windowAmount = ~~(jsonData.length / myVariables.itemOnPage) + 1;
    } else {
        windowAmount = ~~(jsonData.length / myVariables.itemOnPage);
    }

    myVariables.currentPaginationPage = 1;
    myVariables.paginationPages = windowAmount;
    document.getElementById("pagination-page").innerText = myVariables.currentPaginationPage;
    document.getElementById("pagination-pages").innerText = myVariables.paginationPages;

    let firstElem = 0;
    let lastElem = 0;
    if (jsonData.length <= myVariables.itemOnPage) {
        lastElem = jsonData.length;
    } else {
        lastElem = myVariables.itemOnPage;
    }

    for (let showWindow = 1; showWindow < windowAmount + 1; showWindow++) {

        let domWindow = document.createElement("div");
        domWindow.className = "hide result-window";
        domWindow.setAttribute("data", showWindow);
        if (showWindow === 1) {
            domWindow.classList.remove("hide");
        }
        let domRow = document.createElement("div");
        domRow.className = "row";

        for (let elem = firstElem; elem < lastElem; elem++) {
            let domCol = document.createElement("div");
            domCol.className = "col";
            let domElem = document.createElement("div");
            domElem.className = "result-elem";
            let domFavorite = document.createElement("div");
            domFavorite.className = "favorite-elem";
            domFavorite.setAttribute('id_film', jsonData[elem].id);
            if (myStorage.getItem(`id=${domFavorite.getAttribute('id_film')}`)) {
                domFavorite.classList.add("save");
            }
            let domWindowInfo = document.createElement("div");
            domWindowInfo.className = "film-info hide";

            if (jsonData[elem].image) {
                domElem.innerHTML = `
                    <div class="result-image"
                    style="background: url(${jsonData[elem].image["medium"] || jsonData[elem].image["original"]}) no-repeat center; background-size: contain;"
                    data_name="${jsonData[elem].name}"
                    data_genre="${jsonData[elem].genres.join(', ')}"
                    data_lang="${jsonData[elem].language}"
                    data_img="${jsonData[elem].image["original"] || jsonData[elem].image["medium"]}"
                    >`;
            } else {
                domElem.innerHTML = `
                    <div class="result-image"
                    data_name="${jsonData[elem].name}"
                    data_genre="${jsonData[elem].genres.join(', ')}"
                    data_lang="${jsonData[elem].language}"
                    data_img =""
                    >`;
            }
            domWindowInfo.innerHTML = jsonData[elem].summary;
            domElem.append(domFavorite);
            domElem.append(domWindowInfo);
            domCol.append(domElem);
            domRow.append(domCol);
        }
        firstElem = lastElem;
        if ((jsonData.length - lastElem) > myVariables.itemOnPage) {
            lastElem += myVariables.itemOnPage;
        } else {
            lastElem += jsonData.length - lastElem;
        }
        domWindow.append(domRow);
        target.append(domWindow);
    }

    let windowList = document.getElementById("pagination-list");
    windowList.innerHTML = "";

    for (let windowListElem = 1; windowListElem < windowAmount + 1; windowListElem++) {
        let windowListItem = document.createElement("li");
        windowListItem.innerText = windowListElem;
        windowList.append(windowListItem);
    }
}

const getFilmsPage = (page, filter = { lang: false, genre: false }) => {
    fetch(`https://api.tvmaze.com/shows?page=${page}`)
        .then(response => response.json())
        .then(jsonData => {
            let langFilter = myVariables.filter.lang;
            let genreFilter = myVariables.filter.genre;
            let filteredLang;
            let filteredObj;

            if (langFilter !== 'Lang') {
                filteredLang = jsonData.filter(elem => elem.language === langFilter);
            } else {
                filteredLang = jsonData;
            }

            if (genreFilter !== 'Genre') {
                filteredObj = filteredLang.filter(elem => elem.genres.includes(genreFilter));
            } else {
                filteredObj = filteredLang;
            }
            createResultList(filteredObj);
        })
}

const setFilter = (event, id) => {
    let target = event.target;
    if (target.tagName != 'LI') return;
    document.getElementById(id).innerText = target.innerText;
    myVariables.filter = {
        lang: document.getElementById("language-filter__button").innerText,
        genre: document.getElementById("genre-filter__button").innerText
    }
    getFilmsPage(myVariables.loading);
}

const setItemsPerPage = (event) => {
    let target = event.target;
    if (target.tagName != 'LI') return;
    myVariables.itemOnPage = +target.getAttribute("data");
    document.getElementById("per-page-filter__button").innerText = `${myVariables.itemOnPage} per page`;

    getFilmsPage(myVariables.loading);
}

const setWindowByInc = (inc) => {
    if ((myVariables.currentPaginationPage + inc) < 1) {
        return;
    }
    if ((myVariables.currentPaginationPage + inc) > (myVariables.paginationPages)) {
        return;
    }

    let currentPage = myVariables.currentPaginationPage;
    myVariables.currentPaginationPage += inc;
    let newPage = myVariables.currentPaginationPage;

    setWindow(currentPage, newPage);
}

const setWindowByPage = (event) => {
    let target = event.target;
    if (target.tagName != 'LI') return;

    let currentPage = myVariables.currentPaginationPage;
    myVariables.currentPaginationPage = +target.innerText;
    let newPage = +target.innerText;

    setWindow(currentPage, newPage);
}

const setWindow = (currentPage, newPage) => {

    let thisWindow = document.querySelector(`.result-window[data="${currentPage}"]`);
    let showedWindow = document.querySelector(`.result-window[data="${newPage}"]`);
    thisWindow.classList.add("hide");
    showedWindow.classList.remove("hide");
    document.getElementById("pagination-page").innerText = newPage;
}

document.getElementById("genre-filter").onclick = (event) => setFilter(event, "genre-filter__button");
document.getElementById("language-filter").onclick = (event) => setFilter(event, "language-filter__button");
document.getElementById("per-page-filter").onclick = (event) => setItemsPerPage(event);
document.getElementById("pagination-prev-button").onclick = () => setWindowByInc(-1);
document.getElementById("pagination-next-button").onclick = () => setWindowByInc(1);
document.getElementById("pagination-bar").onclick = () => {
    document.getElementById("pagination-list").classList.toggle("hide");
};
document.getElementById("pagination-list").onclick = (event) => setWindowByPage(event);
document.getElementById("search__button").onclick = () => filmsSearch();
document.getElementById("films").onclick = () => filmData(myVariables.loading);
document.querySelector(".modal-close").onclick = () => {
    let modalWindowSection = document.querySelector(".modal-window-section");
    let modalWindow = document.querySelector(".modal-window");
    modalWindowSection.classList.add("fadeOut");
    modalWindow.classList.add("fadeOut");
    modalWindowSection.classList.remove("fadeIn");
    modalWindow.classList.remove("fadeIn");

    document.body.classList.remove("fixed");
}
document.querySelector(".films-list").onclick = (event) => {
    let target = event.target;
    if(target.classList.contains("result-image")){
        let modalWindowSection = document.querySelector(".modal-window-section");
        let modalWindow = document.querySelector(".modal-window");

        document.getElementById("modal-film-name").innerText = target.getAttribute("data_name");
        document.getElementById("modal-film-genre").innerText = target.getAttribute("data_genre");
        document.getElementById("modal-film-language").innerText = target.getAttribute("data_lang");
        document.getElementById("modal-film-description").innerHTML = target.parentNode.querySelector(".film-info p").innerHTML;
        document.querySelector(".modal-image").setAttribute("style", `background: url(${target.getAttribute("data_img")}) no-repeat center; background-size: cover;`);
        modalWindowSection.classList.remove("fadeOut");
        modalWindow.classList.remove("fadeOut");
        modalWindowSection.classList.add("fadeIn");
        modalWindow.classList.add("fadeIn");
        document.body.classList.add("fixed");
        document.querySelector(".modal-title-outer").scrollTop = 0;
    }
    if(target.classList.contains("favorite-elem")){
        let id = target.getAttribute("id_film");
        if(target.classList.contains("save")){
            myStorage.removeItem(`id=${id}`);
            target.classList.remove("save");
        } else {
            myStorage.setItem(`id=${id}`,"" + id);
            target.classList.add("save");
        }
    }
};

document.getElementById("favorite").onclick = () => {
    if(myStorage.length === 0) {
        return;
    }

    let favoritesArr = [];
    let favoriteFilms = [];
    let favoriteRes = [];
    const url =  "https://api.tvmaze.com/shows/";

    for(let i=0; i<localStorage.length; i++) {
        let localKey = localStorage.key(i);
        favoritesArr.push(localStorage.getItem(localKey));
    }

    favoriteFilms = favoritesArr.map( el => fetch(url + el).then(response => response.json()).then(el => favoriteRes.push(el)));

    Promise.all(favoriteFilms).then(() => {
        let filter = document.querySelector(".filter");
            filter.classList.add("hide");
            createResultList(favoriteRes);
    });

};

window.onload = () => {
    filmData(myVariables.loading);
}