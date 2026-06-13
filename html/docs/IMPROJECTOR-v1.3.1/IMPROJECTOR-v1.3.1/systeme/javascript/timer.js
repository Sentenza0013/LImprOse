// Objet pour gérer une bar de progression d'un caucus

function Caucus() {
	this.timer = null;
	this.caucus = window.opener.document.getElementById('caucus');
	this.caucusBar = window.opener.document.getElementById('caucusBar');

	this.startCaucus = function() {
		this.endCaucus();
		if (checkImproOk == true) { // Si on a validé l'impro
			this.caucusBar.style.width = '100%';
			this.caucus.style.visibility = 'visible';
			this.timer = setInterval(function(v) {
				v.updateCaucus();
			}, 1000, this);
		}
	};

	this.updateCaucus = function() {
		var currentValue = parseInt(this.caucusBar.style.width);
		currentValue -= 5; // On enlève 5% toutes les secondes
		this.caucusBar.style.width = currentValue + '%';
		if (currentValue == 0) {
			this.endCaucus();
		}
	};

	this.endCaucus = function() {
	// arrêt du timer et disparition de la barre.
		if (this.timer !== null) {
			clearInterval(this.timer);
			this.timer = null;
		}
		this.caucus.style.visibility = 'hidden';
	};
}

var caucus = new Caucus();

// Fonctions pour les boutons +/- des minutes et secondes

function incr_impro_min() {
	var minutes = CP.getElementById('durée_impro_min');
	if (minutes.value == "") {
		minutes.value = 1;
	} else {
		minutes.value++;
	}
}

function decr_impro_min() {
	var minutes = CP.getElementById('durée_impro_min');
	if (minutes.value == "" || minutes.value == 0) {
		minutes.value = 0;
	} else {
		minutes.value--;
	}
}

// On avance les secondes de 15 en 15
function incr_impro_sec() {
	var secondes = CP.getElementById('durée_impro_sec');
	if (secondes.value == "") {
		secondes.value = 15;
	} else {
		secondes.value = (parseInt(secondes.value) + 15)%60;
	}
}

function decr_impro_sec() {
	var secondes = CP.getElementById('durée_impro_sec');
	if (secondes.value == "") {
		secondes.value = 45;
	} else {
		secondes.value = (parseInt(secondes.value) + 45)%60;
	}
}


	//----------------------------------------------TIMER IMPRO-------------------------

		function padNombre(nombre, taille) {
		var nombreStr = nombre + "";
		while (nombreStr.length < taille) {
			nombreStr = "0" + nombreStr;
		}
		return nombreStr;
	}



	function startTimerImpro() {
		if (!checkImproOk) {
			alert('Informations manquantes, vérifiez !');
		} else if (timer_impro.isActif()) {
			alert('Le compte-à-rebours est déjà lancé !');
		} else {
			duree_impro_min = parseInt(duree_impro_min);
			duree_impro_sec = parseInt(duree_impro_sec);
			afficheur.getElementById('af_big_timer').style = "-webkit-animation: bounceIn 1s 1"; //animation
			setTimeout(function () {
				afficheur.getElementById('af_big_timer').style = "";
			}, 1200); //on laisse l'animation se terminer et on nettoie
			timer_impro.setDureeSec(duree_impro_min * 60 + duree_impro_sec); //on convertit les valeurs entrées (minutes et secondes) en total de secondes.
			timer_impro.lancer(); //on déclenche le compte-à-rebours
			CP.getElementById('boutonImproGo').disabled = true; //on grise le bouton
		}


	}

	function decompterTimerImpro(secondesTotal) {
		var secondes = padNombre((secondesTotal % 60), 2);
		var minutes = padNombre(Math.floor(secondesTotal / 60), 2);
		if (secondesTotal <= 10) {
			afficheur.getElementById('af_big_timer').className = "cligno";
			afficheur.getElementById('af_big_timer').style.color = "red";
		} else if (secondesTotal <= 30) {
			afficheur.getElementById('af_big_timer').className = "jaune_a_rouge";
		} else if (secondesTotal <= 59) {
			afficheur.getElementById('af_big_timer').style.color = "#fdffb1";
		}
		afficheur.getElementById('af_big_timer').innerHTML = minutes + ":" + secondes; //actualisation fenêtre affichage
		CP.getElementById('af_big_timer').innerHTML = minutes + ":" + secondes; //actualisation aperçu dans panneau de contrôle
	}

	function finirTimerImpro() {
		afficheur.getElementById('af_big_timer').innerHTML = "<div class='effet_elastique'>STOP</div>"; //actualisation fenêtre affichage
		CP.getElementById('af_big_timer').innerHTML = "STOP"; //actualisation aperçu dans panneau de contrôle
		afficheur.getElementById('af_big_timer').style.color = ""; //on réinitialise la couleur de base du timer
		afficheur.getElementById('af_big_timer').className = ""; //on réinitialise la classe de base du timer
		afficheur.getElementById('timer-periode-on-off').style.display=design.timerPeriodeOnOff;//on rétablit l'état (visible ou non) du compte à rebours de période
	}

	function stopTimerImpro() {
		timer_impro.arreter();
	}


//----------------------------------------------TIMER PÉRIODE-------------------------

	function startTimerPeriode() {
		if (timer_periode.isActif()) {
			alert('Le compte-à-rebours est déjà lancé !');
		} else {
			duree_timer_periode = CP.getElementById('durperiod').value; //on récupère la durée choisie par l'utilisateur
			duree_timer_periode = parseInt(duree_timer_periode) * 60; //on convertit les valeurs (minutes) en total de secondes.
			afficheur.getElementById('af_timer_periode').style = 'color: ' + design.couleurInfos + ';' + '-webkit-animation: bounceIn 1s 1;'; //animation sur le chrono
			setTimeout(function () {
				afficheur.getElementById('af_timer_periode').style = 'color: ' + design.couleurInfos + ';';
			}, 1200); //on laisse l'animation se terminer et on nettoie
			num_periode = "Période n°" + CP.getElementById('numperiod').value + ": ";
			CP.getElementById('def_periode').style = "visibility: hidden;"; //on masque les champs qui permettent de définir la durée et le n° de période
			timer_periode.setDureeSec(duree_timer_periode);
			timer_periode.lancer(); //on déclenche le compte-à-rebours
			CP.getElementById('timerStop').disabled = false; //on active le bouton STOP au cas où il ne le serait pas déjà.
		}

	flashSave();

	}

	function decompterTimerPeriode(secondesTotal) {
		var secondes = padNombre((secondesTotal % 60), 2);
		var minutes = padNombre(Math.floor(secondesTotal / 60), 2);
		afficheur.getElementById('af_timer_periode').innerHTML = num_periode + minutes + ":" + secondes; //actualisation fenêtre affichage
		CP.getElementById('af_timer_periode').innerHTML = num_periode + minutes + ":" + secondes; //actualisation aperçu dans panneau de contrôle
	}

	function finirTimerPeriode() {
		afficheur.getElementById('af_timer_periode').innerHTML = "<div class='effet_elastique' style='color: red;'>STOP</div>"; //affiche "STOP" dans fenêtre affichage avec effet elastique
		window.setTimeout(function () {
			afficheur.getElementById('af_timer_periode').innerHTML = "<div class='cligno'>Période terminée !</div>";
		}, 1100); //on attend que l'effet elastique se termine avant de faire clignoter "Période terminée !"
		CP.getElementById('af_timer_periode').innerHTML = "STOP"; //affiche "STOP" dans panneau de contrôle aussi
		CP.getElementById('def_periode').style = "visibility: visible;"; //réaffichage des champs qui permettent de définir la durée et le n° de période
	}

	function stopTimerPeriode() {
		timer_periode.arreter();
		CP.getElementById('timerStop').disabled = true; //on désactive le bouton STOP au cas où il ne le serait pas déjà.
		CP.getElementById('def_periode').style = "visibility: visible;"; //réaffichage des champs qui permettent de définir la durée et le n° de période
	}





/**
 * Timer/temporisation pour la gestion des chronos.
 *
 * @param s_onAvance: fonction de callback à exécuter à chaque décompte/modification du temps restant
 * @param s_onArret: fonction de callback à exécuter lorsque le timer arrive à sa fin
 */
function creerTimer(s_onAvance, s_onArret) {

	var actif = false; // Booléen timer actif ou non
	var dureeSec = 0; // Temps restant en secondes du timer
	var dureeSecInitiale = 0; // Durée initiale en secondes du timer (initialisation via setDureeSec)
	var idTimeout = null; // Identifiant du timeout de décompte du timer (pour arrêter les appels différés)
	var intervalleMsec = 1000; // Intervalle de millisecondes souhaité entre chaque décompte
	var nbrTics = 0; // Nombre d'unités décomptées depuis le lancement du timer
	var timestampLancement = Date.now(); // Timestamp du dernier lancement/reprise du timer
	var variation = 0; // Différence entre l'heure effective de l'exécution et l'heure souhaitée pour le décompte

	this.onAvance = s_onAvance;
	this.onArret = s_onArret;

	/**
	 * Initialiser la durée du timer.
	 * @param s_dureeSec
	 */
	this.setDureeSec = function (s_dureeSec) {
		dureeSec = s_dureeSec;
		dureeSecInitiale = s_dureeSec;
		this.onAvance(dureeSec);
	}

	/**
	 * Décompte précis d'une unité, prise en compte des décalages temporels dans l'exécution temporisée.
	 * Méthode privée.
	 */
	var avancer = function () {
		if (actif) {
			if (--dureeSec >= 1) {
				nbrTics++;
				this.onAvance(dureeSec);
				var timestamp = Date.now();
				variation = (timestamp - (timestampLancement + nbrTics * intervalleMsec));
				idTimeout = window.setTimeout(avancer.bind(this), Math.max(25, (intervalleMsec - variation)));
			} else {
				this.arreter();
			}
		}
	}

	/**
	 * Lancer/reprendre le décompte du timer.
	 * @returns {boolean}
	 */
	this.lancer = function () {
		var resultat = false;
		if (!actif && idTimeout === null) {
			nbrTics = 0;
			timestampLancement = Date.now();
			idTimeout = window.setTimeout(avancer.bind(this), intervalleMsec);
			actif = true;
			resultat = true;
		}
		return resultat;
	}

	/**
	 * Mettre en pause le décompte.
	 * @returns {boolean}
	 */
	this.interrompre = function () {
		var resultat = false;
		if (actif) {
			window.clearTimeout(idTimeout);
			idTimeout = null;
			actif = false;
			resultat = true;
		}
		return resultat;
	}

	/**
	 * Mettre fin à la période du timer.
	 * @returns {boolean}
	 */
	this.arreter = function () {
		var resultat = false;
		if (this.interrompre()) {
			this.onArret();
			resultat = true;
		}
		return resultat;
	}

	/**
	 * Mettre le timer en pause à sa valeur initiale.
	 */
	this.reinitialiser = function () {
		this.interrompre();
		if (dureeSec !== dureeSecInitiale) {
			dureeSec = dureeSecInitiale;
			this.onAvance(dureeSec);
		}
	}

	/**
	 * Savoir si le timer est actif.
	 * @returns {boolean}
	 */
	this.isActif = function () {
		return actif;
	}
}
