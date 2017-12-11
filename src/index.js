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
    const homeText = document.createTextNode("Reports");
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
    //create form here 
    const createform = document.createElement('form'); // Create New Element Form
    // createform.setAttribute("action", "");
    createform.setAttribute("method", "post");
    createform.setAttribute("onsubmit", "event.preventDefault(); return addInDatabase(document.getElementById(\"firstname\").value, document.getElementById(\"lastname\").value, document.getElementById(\"position\").value, document.getElementById(\"description\").value )");

    const firstNameLabel = document.createElement('label');
    firstNameLabel.innerHTML = "FirstName : ";
    createform.appendChild(firstNameLabel);

    var firstNameElement = document.createElement('input'); // Create Input Field for FirstName
    firstNameElement.setAttribute("type", "text");
    firstNameElement.setAttribute("Id", "firstname");
    createform.appendChild(firstNameElement);

    var linebreak = document.createElement('br');
    createform.appendChild(linebreak);

    var lastNameLabel = document.createElement('label');
    lastNameLabel.innerHTML = "Last Name : ";
    createform.appendChild(lastNameLabel);

    var lastNameElement = document.createElement('input'); // Create Input Field LastName
    lastNameElement.setAttribute("type", "text");
    lastNameElement.setAttribute("Id", "lastname");
    createform.appendChild(lastNameElement);

    var emailbreak = document.createElement('br');
    createform.appendChild(emailbreak);

    const positionLabel = document.createElement('label');
    positionLabel.innerHTML = "Position : ";
    createform.appendChild(positionLabel);

    var positionElement = document.createElement('input'); // Create Input Field for FirstName
    positionElement.setAttribute("type", "text");
    positionElement.setAttribute("Id", "position");
    createform.appendChild(positionElement);

    var linebreak = document.createElement('br');
    createform.appendChild(linebreak);

    const descriptionLabel = document.createElement('label'); // Append Description
    descriptionLabel.innerHTML = "Description : ";
    createform.appendChild(descriptionLabel);

    const descriptionElement = document.createElement('textarea');
    descriptionElement.setAttribute("Id", "description");
    createform.appendChild(descriptionElement);

    const messagebreak = document.createElement('br');
    createform.appendChild(messagebreak);

    const submitElement = document.createElement('input'); // Append Submit Button
    submitElement.setAttribute("type", "submit");
    submitElement.setAttribute("name", "submit");
    submitElement.setAttribute("value", "Submit");
    createform.appendChild(submitElement);
    rightside.appendChild(createform);
}

const addInDatabase = (firstname, lastname, position, description) => {
    let maxId = 0;
    for (let j = 0; j < ourTeam.length; j++) {
        if (ourTeam[j].Id > maxId) maxId = ourTeam[j].Id;
    }
    const id = maxId + 1;
    const reports = ["report"];
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
    //create form 
    
    //x add to field

}