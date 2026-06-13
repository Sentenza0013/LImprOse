
function dataURIToBlob(dataURI, callback) {//fonction générique pour transformer en objet blob les données qui seront incluses dans le fichier exporté

  var binStr = atob(dataURI.split(',')[1]),
    len = binStr.length,
    arr = new Uint8Array(len),
    mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  for (var i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }

  return new Blob([arr], {
    type: mimeString
  });

}


// -------------- SYSTEME DE SAUVEGARDE / CHARGEMENT EXTERNE MATCH --------------------------		



function exportMatch() {
	
	if (navigator.userAgent.indexOf('Edge') >= 0){alert('Votre navigateur est incompatible avec cette fonctionnalité...');return;}
	
	majInfosMatch();//on met à jour les objets match (equipegauche et equipedroite) à partir des réglages du panneau de contrôle
	
	var nomfichier="Reglages_du_match_"+equipegauche.nom+"_vs_"+equipedroite.nom+".imp";
		
	    var param1=equipegauche,
        param2=equipedroite,
		param3=styleCartons,
		param4=styleMaillots,
        data=JSON.stringify({matchEquipeGauche:param1,matchEquipeDroite:param2,matchCartons:param3,matchMaillots:param4});
	
		var blob = new Blob(["\ufeff", data], {type: 'application/octet-binary'});
		var url = URL.createObjectURL(blob);
	
	var a = document.body.appendChild(
        document.createElement("a")
    );
    a.download = nomfichier;
	a.href = url;
    //a.href = "data:text/csv;charset=ISO-8859-1;base64,"+btoa(data);
    a.click();

	
	flashSave();
	}




function importMatch(input) {//import des réglages de match depuis un fichier
    
	if (navigator.userAgent.indexOf('Edge') >= 0){alert('Votre navigateur est incompatible avec cette fonctionnalité...');return;}
	
	var reader=new FileReader();
    reader.onload=function() {
        var data=JSON.parse(reader.result);
        if (data.matchEquipeGauche == null) {alert('Ce fichier ne contient pas de réglages de match. Il s\'agit peut-être d\'un fichier contenant vos paramètres de design ou vos diaporamas !'); return;}
		equipegauche=data.matchEquipeGauche;
        equipedroite=data.matchEquipeDroite;//on récupère les contenus de match sauvés dans les données "matchEquipeGauche" et "matchEquipeDroite" du fichier de sauvegarde et on applique les valeurs aux objets match en cours
		styleCartons=data.matchCartons;//idem pour les cartons et maillots
		styleMaillots=data.matchMaillots;
				
		AffCPInfosMatch(); //on met à jour le panneau de contrôle à partir des objets match en cours
		AffInfosMatch(); //rafraichissement tableau d'affichage
		
		equipegauche.score=Number(CP.getElementById('af_scoreGaucheCP').innerHTML);//le score fait partie des données qui ont été sauvegardées (à travers l'objet equipe) mais pas de celles qui doivent être réimportées. On rétablit le score en cours.
		equipedroite.score=Number(CP.getElementById('af_scoreDroiteCP').innerHTML);
		};
		
    reader.readAsText(input.files[0], 'ISO-8859-1');
	
	
	flashSave();
}


// -------------- SYSTEME DE SAUVEGARDE / CHARGEMENT EXTERNE DIAPORAMA --------------------------		


function exportDiapowait(){
	
	if (navigator.userAgent.indexOf('Edge') >= 0){alert('Votre navigateur est incompatible avec cette fonctionnalité...');return;}
	
	CP.getElementById('diapoexport').style.display="none";//affichage du picto et texte d'attente à la place du bouton...
	CP.getElementById('diapoexportwait').style.display="inline";
	window.setTimeout(function () {exportDiapo();//puis on passe à l'exportation après 1/4 de seconde (sinon le picto et le texte d'attente n'ont pas le temps de s'afficher)
	}, 250);
	
}

function exportDiapo() {//export des diaporamas et réglages dans un fichier
	
		
	var nomfichier="Diapo_improjector.imp";// on définit le nom par défaut du fichier de sortie
	
	diapo.duree=(CP.getElementById('duree_diapo').value*1000);//on met à jour la variable durée de diapo
	
    var param1=diapo,
        param2=CP.getElementById('miniatures').innerHTML,
		param3=CP.getElementById('autominiatures').innerHTML,
        data=JSON.stringify({diapo:param1,diapomanu:param2,diapoauto:param3});
    
	var blob = new Blob(["\ufeff", data], {type: 'application/octet-binary'});
	var url = URL.createObjectURL(blob);
	
	var a = document.body.appendChild(
        document.createElement("a")
    );
    a.download = nomfichier;
    
	a.href = url;
	//a.href = "data:text/csv;charset=ISO-8859-1;base64,"+btoa(data);
    a.click();
	
	flashSave();
	
	CP.getElementById('diapoexport').style.display="inline";
	CP.getElementById('diapoexportwait').style.display="none";//retour du bouton et disparition du picto et texte d'attente...
}



function importDiapo(input) {//import des diaporamas et réglages dans un fichier

	if (navigator.userAgent.indexOf('Edge') >= 0){alert('Votre navigateur est incompatible avec cette fonctionnalité...');return;}
	
    var reader=new FileReader();
    reader.onload=function() {
        var data=JSON.parse(reader.result);
		if (data.diapo == null) {alert('Ce fichier ne contient pas de réglages de diaporama. Il s\'agit peut-être d\'un fichier contenant vos paramètres de design ou de match !'); return;}
		var diapo=data.diapo;
        CP.getElementById('miniatures').innerHTML=data.diapomanu;//on récupère les diapos sauvées dans les données "diapomanu" et "diapoauto" du fichier de sauvegarde et on colle ça à l'endroit prévu
		CP.getElementById('autominiatures').innerHTML=data.diapoauto;
		CP.getElementById('duree_diapo').value=(diapo.duree/1000);
		};
		
    reader.readAsText(input.files[0], 'ISO-8859-1');
		

	flashSave();
}



// -------------- SYSTEME DE SAUVEGARDE / CHARGEMENT EXTERNE DESIGN --------------------------		


function exportDesign() {//export du design dans un fichier

	if (navigator.userAgent.indexOf('Edge') >= 0){alert('Votre navigateur est incompatible avec cette fonctionnalité...');return;}

	majParamDesign();//on met à jour l'objet design à partir des réglages du panneau de contrôle

	var nomfichier="Design_improjector.imp";
	
    var param1="Sauvegarde design Improjector",
        param2=design,
        data=JSON.stringify({p1:param1,design:param2});
    
	var blob = new Blob(["\ufeff", data], {type: 'application/octet-binary'});
	var url = URL.createObjectURL(blob);
	
	var a = document.body.appendChild(
        document.createElement("a")
    );
    a.download = nomfichier;
    a.href = url;
	//a.href = "data:text/csv;charset=ISO-8859-1;base64,"+btoa(data);
    a.click();
	
	flashSave();
}


function importDesign(input) {//import du design depuis un fichier

	if (navigator.userAgent.indexOf('Edge') >= 0){alert('Votre navigateur est incompatible avec cette fonctionnalité...');return;}

    var reader=new FileReader();
    reader.onload=function() {
        var data=JSON.parse(reader.result);
		if (data.design == null) {alert('Ce fichier ne contient pas de réglages de design. Il s\'agit peut-être d\'un fichier contenant vos réglages de match ou vos diaporamas !'); return;}
        var blabla=data.p1;
        design=data.design;//on récupère le contenu de design sauvé dans les données "design" du fichier de sauvegarde et on applique les valeurs à l'objet design en cours
		
		aplikDesign(); //on met à jour le panneau de contrôle à partir de l'objet design en cours
		majDesign(); //on affiche dans l'écran public !
		};
		
    reader.readAsText(input.files[0], 'ISO-8859-1');
		

	flashSave();
}

// -------------- SYSTEME DE SAUVEGARDE / CHARGEMENT EXTERNE DE TOUT --------------------------	

function exportToutwait(){
	
	if (navigator.userAgent.indexOf('Edge') >= 0){alert('Votre navigateur est incompatible avec cette fonctionnalité...');return;}
	
	CP.getElementById('globalexport').style.display="none";//affichage du picto et texte d'attente à la place du bouton...
	CP.getElementById('globalexportwait').style.display="inline";
	window.setTimeout(function () {exportTout();//puis on passe à l'exportation après 1/4 de seconde (sinon le picto et le texte d'attente n'ont pas le temps de s'afficher)
	}, 250);
}


function exportTout() {//export des réglages du match+design+diapo dans un fichier
	
	majInfosMatch();//on met à jour les objets match (equipegauche et equipedroite) à partir des réglages du panneau de contrôle
	majParamDesign();//on met à jour l'objet design à partir des réglages du panneau de contrôle
	
	diapo.duree=(CP.getElementById('duree_diapo').value*1000);//on met à jour la variable durée de diapo
		
	var nomfichier="Reglages_complets_improjector.imp";
	
	    var param1=equipegauche,
        param2=equipedroite,
		param3=styleCartons,
		param4=styleMaillots,
		param5=design,
		param6=diapo,
        param7=CP.getElementById('miniatures').innerHTML,
		param8=CP.getElementById('autominiatures').innerHTML,
		
		data=JSON.stringify({matchEquipeGauche:param1,matchEquipeDroite:param2,matchCartons:param3,matchMaillots:param4,design:param5,diapo:param6,diapomanu:param7,diapoauto:param8});
	
	var blob = new Blob(["\ufeff", data], {type: 'application/octet-binary'});
	var url = URL.createObjectURL(blob);
	
	var a = document.body.appendChild(
        document.createElement("a")
    );
    a.download = nomfichier;
    a.href = url;
	//a.href = "data:text/csv;charset=ISO-8859-1;base64,"+btoa(data);
    a.click();
	
	flashSave();
	
	CP.getElementById('globalexport').style.display="inline";//affichage du picto et texte d'attente à la place du bouton...
	CP.getElementById('globalexportwait').style.display="none";
}


function importTout(input) {//import des réglages match+design+diap

	if (navigator.userAgent.indexOf('Edge') >= 0){alert('Votre navigateur est incompatible avec cette fonctionnalité...');return;}
   
   var reader=new FileReader();
    reader.onload=function() {
        var data=JSON.parse(reader.result);
        
		if (data.matchEquipeGauche != null) {// cette fonction peut servir à importer des fichiers générés avec export match et export design, on teste donc l'existence d'un contenu de type match avant d'appliquer quoi que ce soit
		equipegauche=data.matchEquipeGauche;//on applique : mise à jour des variables globales à partir des paramètres récupérés dans le fichier
        equipedroite=data.matchEquipeDroite;
		styleCartons=data.matchCartons;
		styleMaillots=data.matchMaillots;}
		if (data.design != null) {// test d'un contenu de type design
		design=data.design;}//application
		if (data.diapo != null) {// test d'un contenu de type diapo
		diapo=data.diapo;
		CP.getElementById('miniatures').innerHTML=data.diapomanu;//on récupère les diapos sauvées dans les données "diapomanu" et "diapoauto" du fichier de sauvegarde et on colle ça à l'endroit prévu
		CP.getElementById('autominiatures').innerHTML=data.diapoauto;
		CP.getElementById('duree_diapo').value=(diapo.duree/1000);
		}
		
		AffCPInfosMatch(); //on met à jour le panneau de contrôle à partir des objets match en cours
		AffInfosMatch(); //rafraichissement tableau d'affichage
		aplikDesign(); //on met à jour le panneau de contrôle à partir de l'objet design en cours
		majDesign(); //on affiche dans l'écran public !
		
		equipegauche.score=Number(CP.getElementById('af_scoreGaucheCP').innerHTML);//le score fait partie des données qui ont été sauvegardées (à travers l'objet equipe) mais pas de celles qui doivent être réimportées. On rétablit le score en cours.
		equipedroite.score=Number(CP.getElementById('af_scoreDroiteCP').innerHTML);
				
		};
		
    reader.readAsText(input.files[0], 'ISO-8859-1');
	
	flashSave();
}

