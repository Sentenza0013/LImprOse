//ajout afin de pouvoir stocker des objets dans le local storage :
	
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}	

// fin ajout

function flashRestore() { //recharge les derniers paramètres connus.
	
	try {
		if (localStorage.getObject('FRequipedroite') != null &&
			localStorage.getObject('FRequipegauche') != null &&
			localStorage.getItem('FRstyleCartons') != null &&
			localStorage.getItem('FRstyleMaillots') != null &&
			localStorage.getObject('FRdesign') != null &&
			localStorage.getObject('FRpenoGD') != null &&
			localStorage.getItem('FRjournal') != null &&
			localStorage.getObject('FRdiapos') != null &&
			localStorage.getItem('FRnumperiod') != null &&
			localStorage.getItem('FRdurperiod') != null) {
			// si on a bien tout ce qu'il faut dans le localstorage...
			// on met à jour toutes les variables en cours à partir de celles
			// stockées dans le localstorage (sauf le journal, qu'on fera en dernier)

			equipedroite=localStorage.getObject('FRequipedroite');
			equipegauche=localStorage.getObject('FRequipegauche');
			styleCartons=localStorage.getItem('FRstyleCartons');
			styleMaillots=localStorage.getItem('FRstyleMaillots');
			design=localStorage.getObject('FRdesign');
		
			var penoGD=localStorage.getObject('FRpenoGD');
			var paramDiapos=localStorage.getObject('FRdiapos');
			var tempJournalMatch=localStorage.getItem('FRjournal');
			// le journal de match est gardé dans une variable temporaire
			// puisqu'il va être impacté par les opérations qui suivent...
		
			//on a mis à jour , on va maintenant appliquer les effets :
		
			// restauration des infos contenues dans les champs de période
			CP.getElementById('numperiod').value = localStorage.getItem('FRnumperiod');
			CP.getElementById('durperiod').value = localStorage.getItem('FRdurperiod');
		
			CP.getElementById('peno_1_gauche').checked = penoGD.peno1G; // puis les scores et pénalités
			CP.getElementById('peno_2_gauche').checked = penoGD.peno2G;
			CP.getElementById('peno_3_gauche').checked = penoGD.peno3G;
			CP.getElementById('peno_1_droite').checked = penoGD.peno1D;
			CP.getElementById('peno_2_droite').checked = penoGD.peno2D;
			CP.getElementById('peno_3_droite').checked = penoGD.peno3D;
			penoG();
			penoD();
			afficheur.getElementById('af_score_G').innerHTML = equipegauche.score;
			afficheur.getElementById('af_score_D').innerHTML = equipedroite.score;
			CP.getElementById('af_scoreGaucheCP').innerHTML = equipegauche.score;
			CP.getElementById('af_scoreDroiteCP').innerHTML = equipedroite.score;
		
			CP.getElementById('duree_diapo').value = paramDiapos.duree;
		
			CP.getElementById('nbchaussons').value = design.cptchaussons; // le nombre de chaussons
		
			aplikDesign(); // puis le design
			majDesign();
		
			AffCPInfosMatch();
			AffInfosMatch(); // puis les données de match
						
			wait();
		
			journalMatch="";
			// on remet le journal à zéro (car les fonctions du genre penoG et penoD viennent d'écrire dedans).
			journalMatch=tempJournalMatch; // et enfin on recharge le journal depuis la variable temporaire, qui contenait les journal mémorisé lors de la précédente session !
			journalMatchImproWrite();
		
			//on se place sur l'écran d'attente...
	
		} //fin du if
		else {
			alert('Aucune donnée mémorisée, ou données incomplètes !');//sinon, ouverture normale...
			majInfosMatch();
			majDesign();
			AffCPInfosMatch();
			affichTxtAccueil();
		}
	} catch (e) {
		majInfosMatch();
		majDesign();
		AffCPInfosMatch();
		affichTxtAccueil();
	}
}

function flashSave() {
	
	if (navigator.userAgent.indexOf('Edge') >= 0) { //pas de localstorage pour Edge
	    return;
	}
	
	if(typeof(Storage) !== "undefined") { //si le stockage local (localstorage) est pris en charge par le navigateur :
  		try {
			localStorage.setObject('FRequipedroite',equipedroite);
			localStorage.setObject('FRequipegauche',equipegauche);
			localStorage.setItem("FRstyleCartons",styleCartons);	
			localStorage.setItem("FRstyleMaillots",styleMaillots);
			localStorage.setItem("FRnumperiod",CP.getElementById('numperiod').value);
			localStorage.setItem("FRdurperiod",CP.getElementById('durperiod').value);
			localStorage.setObject('FRdesign',design);
			var penoGD = {
				peno1G: CP.getElementById('peno_1_gauche').checked,
				peno2G: CP.getElementById('peno_2_gauche').checked,
				peno3G: CP.getElementById('peno_3_gauche').checked,
				peno1D: CP.getElementById('peno_1_droite').checked,
				peno2D: CP.getElementById('peno_2_droite').checked,
				peno3D: CP.getElementById('peno_3_droite').checked,
			};
			localStorage.setObject('FRpenoGD',penoGD);
			localStorage.setItem('FRjournal',journalMatch);
			var paramDiapos = {
				duree: CP.getElementById('duree_diapo').value,
			};
			localStorage.setObject('FRdiapos',paramDiapos);
		} catch (e) {
			return; // si localstorage est désactivé, on ne fait rien...
		}
	} else {
		return; // si localstorage n'est pas pris en charge, on ne fait rien...
	}
}

// -------------- SYSTEME DE SAUVEGARDE / CHARGEMENT INTERNE MATCH --------------------------		

function sauver() {	//fonction qui mémorise les réglages Match de l'utilisateur dans le local storage
	if (navigator.userAgent.indexOf('Edge') >= 0) {
		alert('Votre navigateur est incompatible avec cette fonctionnalité...');
		return;
	}

	if (typeof(Storage) !== "undefined") {
		// si le stockage local (localstorage) est pris en charge par le navigateur :
		try {
			//équipe de gauche :
			localStorage.setObject('equipegauche',equipegauche); 
			// définit dans le localStorage (cache du navigateur) un objet equipegauche
			// dont les propriétés sont les mêmes que l'objet local
	
			//équipe de droite :
			localStorage.setObject('equipedroite',equipedroite);
	
			//commun aux deux équipes (affichage des cartons et maillots oui/non) :
			localStorage.setItem("styleCartons",styleCartons);	
			localStorage.setItem("styleMaillots",styleMaillots);
		} catch (e) {
			alert('Votre navigateur ne prend pas en charge le stockage local de données, vérifiez ses réglages.');
		}
  } else { //sinon...
	alert('Votre navigateur ne prend pas en charge le stockage local de données, vérifiez ses réglages.');	  
  }
}

function charger() { //fonction qui charge les réglages de l'utilisateur mémorisés dans le local storage
	
	if (navigator.userAgent.indexOf('Edge') >= 0) {
		alert('Votre navigateur est incompatible avec cette fonctionnalité...');
		return;
	}

	try {	
		if (localStorage.getObject('equipegauche') != null &&
			localStorage.getObject('equipegauche') != null &&
			localStorage.getItem('styleCartons') != null &&
			localStorage.getItem('styleMaillots') != null) {
			// si tous les réglages mémorisés sont présents

			equipegauche = localStorage.getObject('equipegauche');	
			equipedroite = localStorage.getObject('equipedroite');	

			//commun aux deux équipes (affichage des cartons et maillots oui/non) :
			styleCartons=localStorage.getItem("styleCartons");	
			styleMaillots=localStorage.getItem("styleMaillots");
	
			AffInfosMatch(); //rafraichissement tableau d'affichage
			AffCPInfosMatch(); //rafraichissement Panneau de contrôle
		} else {//sinon (si un de ces paramètres manquants)...
			alert('Erreur : aucun réglage n\'est mémorisé, ou des informations sont manquantes !');
			return;
		}
	} catch (e) {
		alert('Erreur : aucun réglage n\'est mémorisé, ou des informations sont manquantes !');
		return;
	}
}

function effacerInfosMatch(){
	
	if (navigator.userAgent.indexOf('Edge') >= 0) {
		alert('Votre navigateur est incompatible avec cette fonctionnalité...');
		return;
	}
	try {
		localStorage.removeItem("equipegauche");
		localStorage.removeItem("equipedroite");
		localStorage.removeItem("styleCartons");
		localStorage.removeItem("styleMaillots");
	} catch (e) {
		return;
	}
	
}
	
	
// -------------- SYSTEME DE SAUVEGARDE / CHARGEMENT INTERNE DESIGN --------------------------			

function sauvDesign() { //fonction qui mémorise les réglages Design de l'utilisateur dans le local storage
	if (navigator.userAgent.indexOf('Edge') >= 0) {
		alert('Votre navigateur est incompatible avec cette fonctionnalité...');
		return;
	}

	majParamDesign();//mise à jour des variables design à partir des champs du CP

	if (typeof(Storage) !== "undefined") { //si le stockage local (localstorage) est pris en charge par le navigateur :
		try {
			localStorage.setObject('design',design);
			//on stocke le contenu de l'objet design dans un objet desig équivalent du local storage
		} catch (e) {
			alert('Votre navigateur ne prend pas en charge le stockage local de données, vérifiez ses réglages.');
		}
	} else { //sinon...
		alert('Votre navigateur ne prend pas en charge le stockage local de données, vérifiez ses réglages.');	 
	}	
}
	
function effacerInfosDesign() {
	if (navigator.userAgent.indexOf('Edge') >= 0){
		alert('Votre navigateur est incompatible avec cette fonctionnalité...');
		return;
	}
	try {
		localStorage.removeItem("design");
	} catch (e) {
		return;
	}
}
	
function loadDesign() { //fonction qui charge les réglages Design de l'utilisateur mémorisés dans le local storage
	if (navigator.userAgent.indexOf('Edge') >= 0){
		alert('Votre navigateur est incompatible avec cette fonctionnalité...');
		return;
	}
	try {		
		if (localStorage.getObject('design') != null) { // si un réglage mémorisé est présent
			design = localStorage.getObject('design'); 
			// on remplace les variables par leurs valeurs issues du local storage
			
			aplikDesign();
			// on met à jour le panneau de contrôle à partir de l'objet design en cours
	
			majDesign(); // on affiche dans l'écran public !
		} else { // sinon...
			alert ('Aucun design mémorisé !');
			return;	
		}
	} catch (e) {
		alert ('Aucun design mémorisé !');
		return;	
	}
}
