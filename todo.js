//HTML zusammen
//CSS zusammen
//Zuerst array erstellen, input bauen, parent bauen, strict mode verwenden
"use strict";
const arr = [];
const input = document.getElementById("inputText");
const parent = document.getElementById("toDoList");

//Jetzt add-Button mit Event-Listenter
//mertl
const addB = document.getElementById("addButton");
addB.addEventListener("click", function () {
    if (input.value != "") {
        //check ob dieselbe Notiz schon da ist!
        let check = "true";
        arr.forEach(function (arritem) {
            if (arritem.txt == input.value) {
                alert("Gleiche Todo schon vorhanden!");
                check = "false";
            }
        });
        if (check == "true") {
            //Listenanfang bauen zum hinzufügen zum parent
            const liElement = document.createElement("li");
            parent.appendChild(liElement);
            //css Klasse zum Element
            liElement.classList.add("liEl");

            //text einfügen in den bulletpoint + titel
            //Wichtig: man hätte den Text auch direkt in das li-Element einfügen können, aber dann würde der Event-Listener
            //auf den Text zum auswählen die beiden anderen (done,delete) überdecken und wäre im ganzen Bereich statt nur auf dem Text! -> deswegen so gelöst!
            const txt = document.createElement("span"); //Wgn. inline Element
            txt.innerText = input.value;
            txt.title = "Click to switch between selected/not selected";
            liElement.appendChild(txt);

            //Objekt bauen und in Array -> warum soviel? weiter unten nötig bei "load":
            const obj = {
                txt: liElement.innerText,
                deco: "none",
                backG: "white",
                node: liElement
            }
            arr.push(obj);

            //Event-Listener zum auswählen!
            txt.style.cursor = "pointer";
            txt.addEventListener("click", function () { //hintergrund ändern quasi für check
                if (liElement.style.background == "gray") {
                    liElement.style.background = "white";
                    obj.backG = "white";
                } else {
                    liElement.style.background = "gray";
                    obj.backG = "gray";
                }
            });

            //done Button mit dazu
            const doneB = document.createElement("i");
            //an Liste hinzfügen
            liElement.appendChild(doneB);
            //symbol improvisieren + titel
            doneB.innerText = "✔️";
            doneB.title = "Click to switch between done/not done";
            //css Klasse zum Element
            doneB.classList.add("doneB");
            //EventListener dazu 
            doneB.addEventListener("click", function () {
                if (liElement.style.textDecoration == "line-through") {
                    liElement.style.textDecoration = "none";
                    obj.deco = "none";
                } else {
                    liElement.style.textDecoration = "line-through";
                    obj.deco = "line-through";
                }
            });

            //delete Button mit dazu 
            const delB = document.createElement("i");
            //muss an die Liste hinzugefügt werden
            liElement.appendChild(delB);
            //symbol improvisieren + titel
            delB.innerText = "🗑️";
            delB.title = "Delete";
            //css Klasse zum Element
            delB.classList.add("deleB");
            //EventListener dazu
            delB.addEventListener("click", function () {
                parent.removeChild(liElement);
                let index = arr.indexOf(obj);
                arr.splice(index, 1);
            });
        }
        input.value = "";
    }
});


//Jetzt gehts an Drop-Down-Menü:
const changObj = document.getElementById("myList");
changObj.addEventListener("change", function () {
    switch (this.value) {
		//vladimir
        case "showAll":
            arr.forEach(function (item) {
                parent.appendChild(item.node); //fügt man ein Element öfter ein, wird es trotzdem nur 1x da sein! cooles Feature vereinfacht vieles hier
            });
            this.value = "choose";
            break;
        //vladimir
        case "showDone":
            arr.forEach(function (item) {
                if (item.deco == "line-through") {
                    parent.appendChild(item.node);
                } else {
                    try {
                        parent.removeChild(item.node);
                    } catch (e) { }; //der error mit -> item.node ist kein child von parent kommt, ist uns egal soll einfach ignoriert werden                 
                }
            });
            this.value = "choose";
            break;
        //vladimir
        case "showNotDone":
            arr.forEach(function (item) {
                if (item.deco != "line-through") {
                    parent.appendChild(item.node);
                } else {
                    try {
                        parent.removeChild(item.node);
                    } catch (e) { }; //der error mit -> item.node ist kein child von parent kommt, ist uns egal soll einfach ignoriert werden                   
                }
            });
            this.value = "choose";
            break;
        //mertl
        case "setSelDone":
            arr.forEach(function (arritem) {
                if (arritem.backG == "gray") {
                    arritem.node.style.textDecoration = "line-through";
                    arritem.deco = "line-through";
                    arritem.node.style.background = "white";
                    arritem.backG = "white";
                }
            });
            this.value = "choose";
            break;
        //mertl
        case "setSelNotDone":
            arr.forEach(function (arritem) {
                if (arritem.backG == "gray") {
                    arritem.node.style.textDecoration = "none";
                    arritem.deco = "none";
                    arritem.node.style.background = "white";
                    arritem.backG = "white";
                }
            });
            this.value = "choose";
            break;
        //vladimir
        case "setDisplDone":
            let nodes = parent.childNodes;
            arr.forEach(function (arritem) {
                nodes.forEach(function (nodeitem) {
                    if (arritem.node == nodeitem) {
                        arritem.node.style.textDecoration = "line-through";
                        arritem.deco = "line-through";
                    }
                })
            });
            this.value = "choose";
            break;
        //vladimir
        case "setDisplNotDone":
            let nodes2 = parent.childNodes;
            arr.forEach(function (arritem) {
                nodes2.forEach(function (nodeitem) {
                    if (arritem.node == nodeitem) {
                        arritem.node.style.textDecoration = "none";
                        arritem.deco = "none";
                    }
                })
            });
            this.value = "choose";
            break;
        //Beide
        case "save":
            //mit promises
            let s = new Promise(function (resolve, reject) {
                setTimeout(function () {
                    try {
                        localStorage.setItem("myData", JSON.stringify(arr));
                        resolve();
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });

            s.then(function () {
                alert("Erfolgreich gespeichert!");
            }).catch(function (errmessage) {
                alert("Fehler beim Speichern: " + errmessage);
            });
            this.value = "choose";
            break;
        //Beide
        case "load": //jetzt kommt unser objekt richtig zum einsatz mit den gespeicherten Sachen!
            //mit promises 
            let l = new Promise(function (resolve, reject) {
                setTimeout(function () {
                    try {
                        let data = JSON.parse(localStorage.getItem("myData"));
                        resolve(data);
                    } catch (e) {
                        reject(e);
                    }
                }, 1000);
            });

            l.then(function (dataobj) {
                let arr2 = dataobj; //nicht direkt in arr speichern, weil sonst überschreibt man mögliche todos die vorm laden schon reingemacht wurden
                let checkD = "true"; //um später eine Meldung ausgegeben zu können, das gleiche Todos nicht geladen wurden, weil sie schon da sind
                arr2.forEach(function (arritem) {
                    let check2 = "true"; //überprüfen quasi, ob das object schon im arr ist oder nicht! Wenn schon da nicht nochmal extra rein!
                    arr.forEach(function (arritem2) {
                        if (arritem.txt == arritem2.txt) {
                            check2 = "false";
                            checkD = "false";
                        }
                    });
                    if (check2 == "true") {
                        arr.push(arritem);
                        const liElement = document.createElement("li");
                        parent.appendChild(liElement);
                        //css Klasse zum Element
                        liElement.classList.add("liEl");

                        //text einfügen in den bulletpoint
                        //Wichtig: man hätte den Text auch direkt in das li-Element einfügen können, aber dann würde der Event-Listener
                        //auf den Text zum auswählen die beiden anderen (done,delete) überdecken und wäre im ganzen Bereich statt nur auf dem Text! -> deswegen so gelöst!
                        const txt = document.createElement("span"); //Wgn. inline Element
                        txt.innerText = arritem.txt;
                        txt.title = "Click to switch between selected/not selected";
                        liElement.appendChild(txt);

                        //Objekt ersetzen durch das richtige node, das gespeichert wurde nicht mehr richtig zurück gebracht deswegen soviel Aufwand
                        arritem.node = liElement;
                        //Eigenschaften richtig machen!
                        if (arritem.deco == "line-through") {
                            liElement.style.textDecoration = "line-through";
                        }
                        if (arritem.backG == "gray") {
                            liElement.style.background = "gray";
                        }


                        //Event-Listener zum auswählen!
                        txt.style.cursor = "pointer";
                        txt.addEventListener("click", function () { //hintergrund ändern quasi für check
                            if (liElement.style.background == "gray") {
                                liElement.style.background = "white";
                                arritem.backG = "white";
                            } else {
                                liElement.style.background = "gray";
                                arritem.backG = "gray";
                            }
                        });

                        //done Button mit dazu
                        const doneB = document.createElement("i");
                        //an Liste hinzfügen
                        liElement.appendChild(doneB);
                        //symbol improvisieren + titel
                        doneB.innerText = "✔️";
                        doneB.title = "Click to switch between done/not done";
                        //css Klasse zum Element
                        doneB.classList.add("doneB");
                        //EventListener dazu 
                        doneB.addEventListener("click", function () {
                            if (liElement.style.textDecoration == "line-through") {
                                liElement.style.textDecoration = "none";
                                arritem.deco = "none";
                            } else {
                                liElement.style.textDecoration = "line-through";
                                arritem.deco = "line-through";
                            }
                        });

                        //delete Button mit dazu 
                        const delB = document.createElement("i");
                        //muss an die Liste hinzugefügt werden
                        liElement.appendChild(delB);
                        //symbol improvisieren + titel
                        delB.innerText = "🗑️";
                        delB.title = "Delete";
                        //css Klasse zum Element
                        delB.classList.add("deleB");
                        //EventListener dazu
                        delB.addEventListener("click", function () {
                            parent.removeChild(liElement);
                            let index = arr.indexOf(arritem);
                            arr.splice(index, 1);
                        });
                    }
                });
                setTimeout(function () {
                    if (checkD == "false") {
                        alert("Erfolgreich geladen, doppelte Todos gefunden und weggelassen!")
                    } else {
                        alert("Erfolgreich geladen");
                    }
                }, 200);
            }).catch(function (errmessage) {
                alert("Fehler beim Laden: " + errmessage);
            });

            this.value = "choose";
            break;
        default:
            break;
    }
});
