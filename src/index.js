firebase.initializeApp({
    apiKey: "AIzaSyDOjguqVAsE00zAjmLbRdHWE2qh-4N45Hw",
    databaseURL: "https://business-trip-app.firebaseio.com",
    storageBucket: "business-trip-app.appspot.com",
    authDomain: "business-trip-app.firebaseapp.com",
    messagingSenderId: "477984551823",
    projectId: "business-trip-app"
});

let database = new Promise((resolve, reject) => {
    resolve(firebase.database().ref('/users').once('value'))
})
let ourTeam;
let ourTeamPlus = [
    {
        Id: 0,
        Selected: true
    }
];

const app = () => {
    database
        .then((snapshot) => {
            rightside.innerHTML = "";
            const team = [
                ...snapshot.val(),
                ourTeamPlus[0]
            ];
            ourTeam = team;
            return ourTeam;
        })
        .then((ourTeam) => {
            return (appinit());
        })
        .catch((e) => { console.log(e) })
}
let selectedIndex = 0;
const menunav = (item) => {
    const home = document.createElement('a');
    const homeText = document.createTextNode("IZVJEŠTAJI");
    home.setAttribute('class', 'navbar-brand');
    home.appendChild(homeText);
    item.appendChild(home);
}

const container = document.getElementById('con');
const rightside = document.createElement('div');

const appinit = () => {
    container.innerHTML = "";
    container.setAttribute('class', 'container-start row');
    rightside.setAttribute('class', 'rightside');
    const navbar = document.createElement('div');

    navbar.setAttribute('class', ' navigator');
    container.appendChild(navbar);
    menunav(navbar);
    // window.location.hash="no-back-button";
    container.appendChild(rightside);
    let i = 0
    // ourTeam.map(item => {
    //     for (i; i < ourTeam.length - 1; i++) {
    //         if (item.Id != 0)
    //             item.Id = i + 1;
    //         console.log(`I je : ${i} a item je : ${item.Id}`);
    //     }
    // })
    ourTeam.filter(item => item.Selected === true)
        .map(item => {
            render(item);
        })
}

const render = (person) => {
    const card = document.createElement('div');
    card.setAttribute('class', 'card');
    if (person.Id != 0) {
        const cardImage = document.createElement('div');
        cardImage.setAttribute('class', 'cardImage');
        // card.getElementsByClassName('cardImage')= ImageUrl;
        card.appendChild(cardImage);

        const cardName = document.createElement('div');
        cardName.setAttribute('class', 'cardname');
        const name = document.createTextNode(`${person.FirstName} ${person.LastName} `);
        cardName.appendChild(name);
        const position = document.createTextNode(` ( ${person.Position} )`);
        cardName.appendChild(position);
        card.appendChild(cardName);
        rightside.appendChild(card);
        window.onbeforeunload = () => {
            return "You will leave this page";
        };
        card.addEventListener('click', (event) => {
            history.pushState({}, `${person.FirstName} ${person.LastName}`, `${person.FirstName}-${person.LastName}`);
            person.Selected = true;
            selectedIndex = person.Id;
            ourTeam.map(item => {
                if (item.Id != selectedIndex) {
                    item.Selected = false;
                }
            })
            rightside.innerHTML = "";
            renderPerson();
        });
        window.onpopstate = (event) => {
            rightside.innerHTML = "";
            database
                .then((snapshot) => {
                    const team = [
                        ...snapshot.val(),
                        ourTeamPlus[0]
                    ];
                    ourTeam = team;
                    return ourTeam;
                })
            ourTeam.map(item => {
                item.Selected = true
            });
            appinit();
        }
    }
    //after this is plus on end of array
    else {
        const plus = document.createElement('div');
        plus.innerHTML = "+";
        plus.setAttribute('class', 'cardImagePlus');
        card.appendChild(plus);
        rightside.appendChild(card);
        plus.addEventListener('click', (event) => {
            history.pushState({}, `add person`, `add-person`);
            addUser();

        })
        // window.onpopstate = (event) => {
        //     rightside.innerHTML = "";
        //     database = firebase.database().ref('/users').once('value')
        //     database.then((snapshot) => {
        //         const team = [
        //             ...snapshot.val(),
        //             ourTeamPlus[0]
        //         ];
        //         ourTeam = team;
        //     })
        //     appinit();
        // }
    }

}

const addUser = () => {
    rightside.innerHTML = "";
    rightside.setAttribute('class', 'rightside-add');
    //create form here 
    const createform = document.createElement('form'); // Create New Element Form
    // createform.setAttribute("action", "");
    createform.setAttribute("method", "post");
    createform.setAttribute("onsubmit", "event.preventDefault(); return addInDatabase(document.getElementById(\"firstname\").value, document.getElementById(\"lastname\").value, document.getElementById(\"position\").value, document.getElementById(\"description\").value )");
    createform.setAttribute("class", "contactForm");

    const date1 = document.createElement('label');
    date1.innerHTML = "Ime : ";
    createform.appendChild(date1);

    const date1Element = document.createElement('input'); // Create Input Field for FirstName
    date1Element.setAttribute("type", "text");
    date1Element.setAttribute("Id", "firstname");
    date1Element.setAttribute("required", "");
    createform.appendChild(date1Element);

    var linebreak = document.createElement('br');
    createform.appendChild(linebreak);

    const dataLabel = document.createElement('label');
    dataLabel.innerHTML = "Prezime : ";
    createform.appendChild(dataLabel);

    const dataElement = document.createElement('input'); // Create Input Field LastName
    dataElement.setAttribute("type", "text");
    dataElement.setAttribute("Id", "lastname");
    dataElement.setAttribute("required", "");
    createform.appendChild(dataElement);

    const emailbreak = document.createElement('br');
    createform.appendChild(emailbreak);

    const positionLabel = document.createElement('label');
    positionLabel.innerHTML = "Pozicija : ";
    createform.appendChild(positionLabel);

    const positionElement = document.createElement('input'); // Create Input Field for FirstName
    positionElement.setAttribute("type", "text");
    positionElement.setAttribute("Id", "position");
    positionElement.setAttribute("required", "");

    createform.appendChild(positionElement);

    var linebreak = document.createElement('br');
    createform.appendChild(linebreak);

    const descriptionLabel = document.createElement('label'); // Append Description
    descriptionLabel.innerHTML = "Deskripcija : ";
    createform.appendChild(descriptionLabel);

    const descriptionElement = document.createElement('textarea');
    descriptionElement.setAttribute("Id", "description");
    descriptionElement.setAttribute("required", "");
    createform.appendChild(descriptionElement);

    const messagebreak = document.createElement('br');
    createform.appendChild(messagebreak);

    const submitElement = document.createElement('input'); // Append Submit Button
    submitElement.setAttribute("type", "submit");
    submitElement.setAttribute("name", "submit");
    submitElement.setAttribute("value", "Dodaj novu osobu");
    createform.appendChild(submitElement);
    rightside.appendChild(createform);
}

const addInDatabase = (firstname, lastname, position, description) => {
    let maxId = 0;
    for (let j = 0; j < ourTeam.length; j++) {
        if (ourTeam[j].Id > maxId) maxId = ourTeam[j].Id;
    }
    const id = maxId + 1;
    const reports = ["Putni nalog"];
    let pomTeam = [
        ...ourTeam, {
            Description: description,
            FirstName: firstname,
            Id: id,
            LastName: lastname,
            Position: position,
            Reports: reports,
            Selected: true
        }];
    ourTeam = pomTeam.filter(item => item.Id != 0);
    console.log(ourTeam);
    firebase.database().ref('/users').set(ourTeam);

    rightside.innerHTML = "";
    database = firebase.database().ref('/users').once('value')
    database.then((snapshot) => {
        const team = [
            ...snapshot.val(),
            ourTeamPlus[0]
        ];
        ourTeam = team;
    })
    history.back();
    appinit();
}

renderPerson = () => {
    rightside.innerHTML = "";
    rightside.setAttribute('class', 'rightsideSecond');
    ourTeam.filter(item => item.Selected === true)
        .map(item => {

            const card = document.createElement('div');
            card.setAttribute('class', 'cardSecond');
            const cardImage = document.createElement('div');
            cardImage.setAttribute('class', 'cardImage');
            card.appendChild(cardImage);

            const cardName = document.createElement('div');
            cardName.setAttribute('class', 'cardnameSecond');
            const name = document.createTextNode(`${item.FirstName} ${item.LastName} `);
            cardName.appendChild(name);
            const position = document.createTextNode(` ( ${item.Position} )`);
            cardName.appendChild(position);
            card.appendChild(cardName);

            const description = document.createElement('div');
            description.setAttribute('class', 'cardDescription');
            const descriptionText = document.createTextNode(`${item.Description}`);
            description.appendChild(descriptionText);
            card.appendChild(description);

            const cardReports = document.createElement('div');

            item.Reports.map(item => {
                const divReport = document.createElement('div');
                divReport.setAttribute('class', 'personReports');
                const cardReportsText = document.createTextNode(`${item} `);
                divReport.appendChild(cardReportsText);
                cardReports.appendChild(divReport);
            })
            cardReports.setAttribute('class', 'cardReports');
            card.appendChild(cardReports);

            rightside.appendChild(card);

            const field = document.createElement('div');
            rightside.appendChild(field);
            field.setAttribute('class', 'field');
            field.setAttribute('Id', 'field');
            const buttonAddDiv = document.createElement('div');
            const buttonAdd = document.createElement("button");
            buttonAdd.setAttribute('class', 'buttonAdd');
            buttonAdd.innerHTML = "+";
            buttonAddDiv.appendChild(buttonAdd);
            field.appendChild(buttonAdd);
            buttonAdd.addEventListener('click', (event) => {
                history.pushState({}, `new report`, `new-report`);
                newReport();

            })
            const view = document.createElement('div');
            view.setAttribute('class', 'view');
            field.appendChild(view);
        })
}

const newReport = () => {
    field.innerHTML = "";
    //create form here 
    const createform = document.createElement('form'); // Create New Element Form
    // createform.setAttribute("action", "");
    createform.setAttribute("method", "post");
    createform.setAttribute("class", "form-newReport");
    // createform.setAttribute("onsubmit", "event.preventDefault(); return addInDatabase(document.getElementById(\"firstname\").value, document.getElementById(\"lastname\").value, document.getElementById(\"position\").value, document.getElementById(\"description\").value )");

    const rowDate = document.createElement('div');
    rowDate.setAttribute("class", "rowDate");
    createform.appendChild(rowDate);

    const date1 = document.createElement('label');
    date1.innerHTML = "Datum polaska: ";
    rowDate.appendChild(date1);

    const date1Element = document.createElement('input'); // Create Input Field for FirstName
    date1Element.setAttribute("type", "date");
    date1Element.setAttribute("value", "2018-01-01");
    date1Element.setAttribute("Id", "date");
    rowDate.appendChild(date1Element);

    const date2 = document.createElement('label');
    date2.innerHTML = "Datum dolaska: ";
    rowDate.appendChild(date2);

    const date2Element = document.createElement('input'); // Create Input Field for FirstName
    date2Element.setAttribute("type", "date");
    date2Element.setAttribute("Id", "date");
    rowDate.appendChild(date2Element);

    let br = document.createElement('br');
    createform.appendChild(br);

    const ch1Label = document.createElement('label')
    ch1Label.innerHTML = "Domaća";
    createform.appendChild(ch1Label);

    const ch1 = document.createElement('input');
    ch1.type = "checkbox";
    ch1.name = "ch1";
    ch1.value = "EX-YU";
    ch1.id = "id";

    createform.appendChild(br);

    const costsLabel = document.createElement('label');
    costsLabel.innerHTML = "Troškove snosi : ";
    createform.appendChild(costsLabel);

    //Dropdown list costs
    const dropdown = document.createElement('buttom');
    createform.appendChild(dropdown);
    dropdown.setAttribute("class", "buttom-costs");
    const dropdownMenu = document.createElement('select');
    dropdown.appendChild(dropdownMenu);
    // dropdownMenu.setAttribute("class", "dropdown-select");
    const a1 = document.createElement('option');
    a1.value = "kompanija";
    a1.innerHTML = "Kompanija";
    const a2 = document.createElement('option');
    a2.value = "zaposleni";
    a2.innerHTML = "Zaposleni";
    dropdownMenu.appendChild(a1);
    dropdownMenu.appendChild(a2);

    // dropdown.innerHTML='
    //         <a href="#">Link 1</a>
    //         <a href="#">Link 2</a>
    const positionLabel = document.createElement('label');
    positionLabel.innerHTML = "Lokacija : ";
    createform.appendChild(positionLabel);

    const positionElement = document.createElement('input'); // Create Input Field for FirstName
    positionElement.setAttribute("type", "text");
    positionElement.setAttribute("Id", "mapsearch");
    createform.appendChild(positionElement);

    const buttonMap = document.createElement('button');
    buttonMap.setAttribute("class", "addLocation");
    buttonMap.setAttribute("Id", "end");
    buttonMap.addEventListener("click", initMap);
    createform.appendChild(buttonMap);

    const mapElement = document.createElement('div'); //create map
    mapElement.setAttribute("Id", "map");
    createform.appendChild(mapElement);

    // function initMap() {
    //     var directionsService = new google.maps.DirectionsService;
    //     var directionsDisplay = new google.maps.DirectionsRenderer;
    //     var map = new google.maps.Map(document.getElementById('map'), {
    //         zoom: 7,
    //         center: { lat: 44.77583, lng: 17.18556 }
    //     });
    //     directionsDisplay.setMap(map);

    //     var onChangeHandler = () => {
    //         calculateAndDisplayRoute(directionsService, directionsDisplay);
    //     };
    //     document.getElementById('end').addEventListener('change', onChangeHandler);
    // }

    // function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    //     directionsService.route({
    //         origin: { lat: 44.77583, lng: 17.18556 },
    //         destination: document.getElementById('end').value,
    //         travelMode: 'DRIVING'
    //     }, function (response, status) {
    //         if (status === 'OK') {
    //             directionsDisplay.setDirections(response);
    //         } else {
    //             window.alert('Directions request failed due to ' + status);
    //         }
    //     });
    // }

    //map
    function initMap (){
        mapElement.innerHTML = "";
        //Map options
        const options = {
            zoom: 8,
            center: { lat: 44.77583, lng: 17.18556 }
        }
        //New map
        const map = new google.maps.Map(document.getElementById('map'), options);
        //Add marker
        const marker = new google.maps.Marker({
            position: { lat: 44.77583, lng: 17.18556 },
            map: map
        });
        //New infoWindow
        // const infoWindow = new google.maps.infoWindow({
        //     content: '<h1>Grad</h1>'
        // });

        // marker.addListener("click", () => {
        //     infoWindow.open(map, marker);
        // });

    }

    var linebreak = document.createElement('br');
    createform.appendChild(linebreak);

    const transportLabel = document.createElement('label');
    transportLabel.innerHTML = "Vrsta prevoza : ";
    createform.appendChild(transportLabel);

    //Dropdown list type of transport
    const dropdown2 = document.createElement('buttom');
    createform.appendChild(dropdown2);
    dropdown2.setAttribute("class", "buttom-costs");
    const dropdownMenu2 = document.createElement('select');
    dropdown2.appendChild(dropdownMenu2);
    const a1second = document.createElement('option');
    a1second.value = "sluzbeno vozilo";
    a1second.innerHTML = "Službeno vozilo";
    const a2second = document.createElement('option');
    a2second.value = "licno vozilo";
    a2second.innerHTML = "Lično vozilo";
    dropdownMenu2.appendChild(a1second);
    dropdownMenu2.appendChild(a2second);

    const messagebreak = document.createElement('br');
    createform.appendChild(messagebreak);

    const submitElement = document.createElement('buttom'); // Append Submit Button
    submitElement.setAttribute("type", "submit");
    submitElement.setAttribute("name", "submit");
    submitElement.setAttribute("class", "submit");
    submitElement.innerHTML="ZAVRŠI";
    createform.appendChild(submitElement);
    field.appendChild(createform);
}