

//-------------------------------------extinction de l'écran de match-----------------------------------

function ecranOnOff(){//permet d'allumer ou éteindre l'afficheur (en fait d'afficher ou masquer la div ecranPublic qui contient tout le reste)
	
	
	stopDiapo();//quelle que soit la situation on stoppe d'abord le diaporama automatique au cas où il bouclerait en tâche de fond
	
	var ecranPublic = afficheur.getElementById('ecranPublic');
	if (ecranPublic.className == "allume") { //si l'écran n'est pas "éteint"
		ecranPublic.className = "eteint"; //on masque le body
				
		CP.getElementById('masquage').innerHTML="<i class='fas fa-power-off'></i>&nbsp;&nbsp;Rallumer écran de match"; CP.getElementById('masquage').style="background-color: #01cb01;";//on change l'intitulé et l'apparence du bouton
	} else { //sinon l'inverse !
		afficheur.getElementById('diapo').className = "diapo_off"; //mais on masque le diaporama au cas où il serait resté allumé
		CP.getElementById('diapo_on_off').innerHTML = '<i class="fas fa-eye"></i>&nbsp;&nbsp;Afficher le diaporama';//et on actualise l'intitulé du bouton en conséquence
		ecranPublic.className = "allume";
		CP.getElementById('masquage').innerHTML="<i class='fas fa-power-off'></i>&nbsp;&nbsp;Éteindre écran de match"; CP.getElementById('masquage').style="background-color: red;";
	}
	
	flashSave();
}

    

//------------------------------------------FONCTIONS COMMUNES AUX DEUX DIAPORAMAS-------------------------------------------	
	
function rundragula(){//active la fonction qui permet le glisser-déplacer des miniatures
	
	dragula([CP.getElementById('miniatures')], {moves: function (el, container, handle) {return handle.classList.contains('handle');} });
	dragula([CP.getElementById('autominiatures')]);
	}

	
Element.prototype.remove = function() {//fontion-type qui va permettre de supprimer les div correspondant aux diapos que l'utilisateur veut enlever
    this.parentElement.removeChild(this);
	}
	NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}	
	
	
//------------------------------------------DIAPORAMA MANUEL-------------------------------------------	
	
	
		//---------------Réindexation des diapos en live à chaque changement--------------
	
	
function runindex(){//démarre la fonction qui réindexe les miniatures à chaque changement
						
	diapoobserver.observe(diapotargetNode, diapoconfig);// On commence à observer le noeud cible pour les mutations précédemment configurées (bref, on surveille les changements dans les miniatures, afin de réindexer en live)	
	
	}
	
	var diapotargetNode = CP.getElementById('miniatures');// Selectionne le noeud dont les mutations seront observées (en l'occurence 'miniatures')

	var diapoconfig = {childList: true, attributes: true, subtree: true};// Options de l'observateur (type de mutations à observer)

	var diapocallback = function(diapomutationsList) {// Fonction callback à éxécuter quand une mutation est observée
    
	for(var mutation of diapomutationsList) {//pour chaque mutation
	
	indexation();//on lance le processus d'indexation
				
	}
		
};

var diapoobserver = new MutationObserver(diapocallback);	// Créé une instance de l'observateur lié à la fonction de callback


function indexation(){//renumérote les diapos et leurs div de manière à ne pas avoir de trous si certaines ont été supprimées
	
	diapoobserver.disconnect();//on déconnecte la surveillance le temps de faire les changements (sinon la fonction va s'autoappeler de manière exponentielle !)
	
	indexdiv=1;//la numérotation à attribuer part de 1
	var els = CP.getElementsByClassName("apdiapo");//on cible les éléments dont la classe est "apdiapo" (toutes les div d'images miniatures, quoi)
	Array.prototype.forEach.call(els, function(el) {//pour chacun de ces éléments...
    el.id="div"+indexdiv;//on définit le n°
	indexdiv=indexdiv+1;});//on incrémente (+1 pour le prochain n° attribué) avant de recommencer le cycle
				
	indeximg=1;
	var els = CP.getElementsByClassName("thumb");//même principe pour les images...
	Array.prototype.forEach.call(els, function(el) {
    if (el.style.borderColor != ""){diapo.active=indeximg;}
	el.id="diapo"+indeximg;
	indeximg=indeximg+1;});
	
	indexlink=1;
	var els = CP.getElementsByClassName("lienaff");//pour le lien d'affichage...
	Array.prototype.forEach.call(els, function(el) {
    el.setAttribute( "onClick", "affDiap("+indexlink+")");
	el.setAttribute( "href", "#"+indexlink);
	indexlink=indexlink+1;});
		
	indexsuppr=1;
	var els = CP.getElementsByClassName("liensuppr");//et pour le lien de suppression.
	Array.prototype.forEach.call(els, function(el) {
    el.setAttribute( "onClick", "supDiap("+indexsuppr+")" );
	el.setAttribute( "href", "#"+(indexsuppr+1));//on fait pointer le lien de suppression vers l'ancre de la diapo d'après (qui logiquement prendra la place de celle supprimée)
	indexsuppr=indexsuppr+1;});
	
	diapo.nb=indexdiv-1;//le nombre de diapo = nombre de boucles effectuées -1 (car on est parti de 1)
	
	if (!CP.getElementById('diapo1')){diapo.nb=0;}//si à l'issue de la réindexation, la diapo 1 n'existe pas, c'est qu'il n'y en a plus. On met le compteur à zéro.
	
	refreshCompteurDiap();
	
	if (diapo.nb==0)//si pas de diapo, masquage des boutons non pertinents
	{CP.getElementById('spoilerDiapoManu').style.display="none";CP.getElementById('diapo_manu_control').style.display="none";CP.getElementById('supprDiapo').style.display="none";}
	else//sinon le contraire
	{CP.getElementById('spoilerDiapoManu').style.display="block";CP.getElementById('diapo_manu_control').style.display="inline";CP.getElementById('supprDiapo').style.display="inline";}
	
	runindex();//on rebranche la surveillance maintenant que les changements sont faits
	
	}

	
		//---------------Importation des fichiers--------------
	
	
	function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

	var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // crée les miniatures.
          diapo.nb=diapo.nb+1;
		  diapo.index=diapo.index+1;
		  //nom=escape(theFile.name);
		  //nom=nom.substring(0,nom.length-4);//on enlève l'extension dans la variable qui affiche le nom de fichier
		  //nom=nom.substring(0,10);//on tronque le nom à 10 carractères max
		  //nom='<div class="nomFichier">'+nom+'</div>';//on ajoute le style
		  nom='<div class="nomFichier handle" title="Déplacer"><i class="fas fa-arrows-alt-h handle"></i></div>';
		  
		  var span = CP.createElement('span');
          span.innerHTML = '<div class="apdiapo" id="div'+diapo.index+'"><a class="lienaff" href="#'+diapo.index+'" onclick="affDiap('+diapo.index+');"><img id="diapo'+diapo.index+'" class="thumb" src="'+e.target.result+'" title="Afficher '+theFile.name+'"/>'+'</a><br><div class="reglage" style="text-align: left">&nbsp;&nbsp;<a href="#'+diapo.index+'" style="color: white;" class="liensuppr" title="Retirer cette image du diaporama" onclick="supDiap('+diapo.index+');"><i class="far fa-trash-alt"></i></a></div>'+nom+'</div>';
          
		  CP.getElementById('miniatures').insertBefore(span, null);
		  		  		  
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
 
  }

CP.getElementById('files').addEventListener('change', handleFileSelect, false);


	//---------------Gestion et affichage des diapos--------------
	
  
function affDiap(diapId){//fonction qui s'active quand on clique sur la miniature d'une diapo
	
	avoir='diapo'+diapId;//on définit de quelle diapo il s'agit en récupérant son id
	
	if (!CP.getElementById(avoir)){alert('Aucune diapo !');return;}//si la diapo demandée n'existe pas, ciao !
	
	afficheur.getElementById('diapo').style.backgroundImage = "url("+CP.getElementById(avoir).src+")";//on passe la source dans l'afficheur
	//afficheur.getElementById('imgaf').src=CP.getElementById(avoir).src;
		
	//puis effet sur les miniatures pour différencier visuellement celle qui est active :
	
	var els = CP.getElementsByClassName("thumb");//on cible les éléments dont la classe est "thumb" (toutes les images miniatures, quoi)
	
	Array.prototype.forEach.call(els, function(el) {//pour chacun de ces éléments...
    
	el.style="";});//on enlève toute bordure éventuellement ajoutée (la brodure standard de la class avec assombrissement de la miniature reste)
		
	CP.getElementById(avoir).style="border: 3px solid #0d0; box-shadow: #398e81 1px 0 10px; filter: none;";//on ajoute une bordure verte seulement à la miniature de la diapo active et on pousse sa luminosité
	alt=new Date().getTime();
	CP.getElementById(avoir).setAttribute("alt",alt);//on est obligé pour Edge de changer un attribut à la diapo active pour que le mutationObserver réagisse, alors on met la date et l'heure en alt-text de l'image
	}
  
function diapoPrev(){//diapo précédente
	if (diapo.active != 1){avoir=diapo.active-1;} else {avoir=diapo.nb;}
	affDiap(avoir);
	}

function diapoNext(){//diapo suivante
	if (diapo.active < diapo.nb){avoir=diapo.active+1;} else {avoir=1;}	
	affDiap(avoir);
	}	
	
function diapo1(){//première diapo
	affDiap(1);
	}
	
	
function supDiap(diapId){//suppression d'une diapo
	
	asuppr='div'+diapId;
	
	CP.getElementById(asuppr).remove();//on supprime la div concernée
		
	}

function killDiapoManu(){//supprime toutes les images du diaporama manuel
		var sur = confirm("Êtes-vous sûr de vouloir retirer toutes les images du diaporama manuel ?");
		if (sur) {
		CP.getElementById('miniatures').innerHTML ="";
		diapo.active=0;	}
	}	
	
	
function refreshCompteurDiap(){//met à jour le compteur de diapo affiché
	CP.getElementById('affNbDiap').innerHTML=diapo.nb;
	}
		


	
	
//----------------------------------------------DIAPORAMA AUTOMATIQUE------------------------------------	  
	
	
	//---------------Réindexation des diapos en live à chaque changement--------------
		
function autorunindex(){//démarre la fonction qui réindexe les miniatures à chaque changement
		
	autoobserver.observe(autotargetNode, autoconfig);// On commence à observer le noeud cible pour les mutations précédemment configurées (bref, on surveille les changements dans les miniatures, afin de réindexer en live)	
	
	}
	
	var autotargetNode = CP.getElementById('autominiatures');// Selectionne le noeud dont les mutations seront observées (en l'occurence 'miniatures')

	var autoconfig = {childList: true, attributes: true, subtree: true};// Options de l'observateur (type de mutations à observer)

	var autocallback = function(automutationsList) {// Fonction callback à éxécuter quand une mutation est observée
    
	for(var mutation of automutationsList) {//pour chaque mutation
			
	autoindexation();//on lance le processus d'indexation
				
	}

};

var autoobserver = new MutationObserver(autocallback);// Créé une instance de l'observateur lié à la fonction de callback
	
function autoindexation(){//renumérote les diapos et leurs div de manière à ne pas avoir de trous si certaines ont été supprimées
	
	autoobserver.disconnect();//on déconnecte la surveillance le temps de faire les changements (sinon la fonction va s'autoappeler de manière exponentielle !)
	
	indexdiv=1;//la numérotation à attribuer part de 1
	var els = CP.getElementsByClassName("autoapdiapo");//on cible les éléments dont la classe est "apdiapo" (toutes les div d'images miniatures, quoi)
	Array.prototype.forEach.call(els, function(el) {//pour chacun de ces éléments...
    el.id="autodiv"+indexdiv;//on définit le n°
	indexdiv=indexdiv+1;});//on incrémente (+1 pour le prochain n° attribué) avant de recommencer le cycle
				
	indeximg=1;
	var els = CP.getElementsByClassName("autothumb");//même principe pour les images...
	Array.prototype.forEach.call(els, function(el) {
    el.id="autodiapo"+indeximg;
	indeximg=indeximg+1;});
	
	indexlink=1;
	var els = CP.getElementsByClassName("autolienaff");//pour le lien d'affichage...
	Array.prototype.forEach.call(els, function(el) {
    el.setAttribute( "href", "#auto"+indexlink);
	indexlink=indexlink+1;});
		
	indexsuppr=1;
	var els = CP.getElementsByClassName("autoliensuppr");//et pour le lien de suppression.
	Array.prototype.forEach.call(els, function(el) {
    el.setAttribute( "onClick", "autosupDiap("+indexsuppr+")" );
	el.setAttribute( "href", "#auto"+(indexsuppr+1));//on fait pointer le lien de suppression vers l'ancre de la diapo d'après (qui logiquement prendra la place de celle supprimée)
	indexsuppr=indexsuppr+1;});
	
	diapo.autoNb=indexdiv-1;//le nombre de diapo = nombre de boucles effectuées -1 (car on est parti de 1)
	
	autorefreshCompteurDiap();
	
	if (!CP.getElementById('autodiapo1')){stopDiapo();diapo.autoNb=0;}//si à l'issue de la réindexation, la diapo 1 n'existe pas, c'est qu'il n'y en a plus. On stoppe le diaporama automatique et on met le compteur à zéro.
	
	if (diapo.autoNb==0)//si pas de diapo, masquage des boutons non pertinents
	{CP.getElementById('spoilerDiapoAuto').style.display="none";CP.getElementById('diapo_auto_control').style.display="none";CP.getElementById('autosupprDiapo').style.display="none";}
	else//sinon le contraire
	{CP.getElementById('spoilerDiapoAuto').style.display="block";CP.getElementById('diapo_auto_control').style.display="inline";CP.getElementById('autosupprDiapo').style.display="inline";}
	
	
	autorunindex();//on rebranche la surveillance maintenant que les changements sont faits
	
	}
	
		//---------------Importation des fichiers--------------
	
function autohandleFileSelect(evt) {
    var autofiles = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = autofiles[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }
	  
	  
      var autoreader = new FileReader();

      // Closure to capture the file information.
      autoreader.onload = (function(theFile) {
        return function(e) {
          // crée les miniatures.
          diapo.autoNb=diapo.autoNb+1;
		  diapo.autoIndex=diapo.autoIndex+1;
		  //nom=escape(theFile.name);
		  //nom=nom.substring(0,nom.length-4);//on enlève l'extension dans la variable qui affiche le nom de fichier
		  //nom=nom.substring(0,10);//on tronque le nom à 10 carractères max
		  //nom='<div class="autonomFichier">'+nom+'</div>';//on ajoute le style
		  nom='<div class="autonomFichier handle" title="Déplacer"><i class="fas fa-arrows-alt-h handle"></i></div>';
		  
		  var autospan = CP.createElement('autospan');
          autospan.innerHTML = '<div class="autoapdiapo" id="autodiv'+diapo.autoIndex+'"><a class="autolienaff" href="#auto'+diapo.autoIndex+'"><img id="autodiapo'+diapo.autoIndex+'" class="autothumb" src="'+e.target.result+'" title="Déplacer '+theFile.name+'"/>'+'</a><br><div class="reglage" style="text-align: left">&nbsp;&nbsp;<a href="#auto'+diapo.autoIndex+'" class="autoliensuppr" title="Retirer cette image du diaporama" onclick="autosupDiap('+diapo.autoIndex+');"><i style="color: white;" class="far fa-trash-alt"></i></a></div>'+nom+'</div>';
          
		  CP.getElementById('autominiatures').insertBefore(autospan, null);
		  		  		  
        };
      })(f);

      // Read in the image file as a data URL.
      autoreader.readAsDataURL(f);
    }
  }

CP.getElementById('autofiles').addEventListener('change', autohandleFileSelect, false);

	
	//---------------Gestion et affichage des diapos--------------
  
  
function autoaffDiap(diapId){//fonction qui s'active quand on clique sur la miniature d'une diapo
	
	avoir='autodiapo'+diapId;//on définit quelle diapo doit être affichée en récupérant son id
		
	if (!CP.getElementById(avoir)){return;}//si la diapo demandée n'existe pas, ciao !
	
	afficheur.getElementById('diapo').style.backgroundImage = "url("+CP.getElementById(avoir).src+")";
		
	//puis effet sur les miniatures pour différencier visuellement celle qui est active :
	
	var els = CP.getElementsByClassName("autothumb");//on cible les éléments dont la classe est "thumb" (toutes les images miniatures, quoi)
	
	Array.prototype.forEach.call(els, function(el) {//pour chacun de ces éléments...
    
	el.style="";});//on enlève toute bordure éventuellement ajoutée (la brodure standard de la class avec assombrissement de la miniature reste)
		
	CP.getElementById(avoir).style="border: 3px solid #0d0; box-shadow: #398e81 1px 0 10px; filter: none;";//on ajoute une bordure verte seulement à la miniature de la diapo active et on pousse sa luminosité
	alt=new Date().getTime();
	CP.getElementById(avoir).setAttribute("alt",alt);//on est obligé pour Edge de changer un attribut à la diapo active pour que le mutationObserver réagisse, alors on met la date et l'heure en alt-text de l'image	
	}
  
	
function autosupDiap(diapId){//suppression d'une diapo
	
	asuppr='autodiv'+diapId;
	
	CP.getElementById(asuppr).remove();//on supprime la div concernée
		
	}

function killDiapoAuto(){//supprime toutes les images du diaporama
	stopDiapo();//on arrête le diaporama auto au cas où il tournerait
	var sur = confirm("Êtes-vous sûr de vouloir retirer toutes les images du diaporama automatique ?");
	if (sur) {
    CP.getElementById('autominiatures').innerHTML ="";
	diapo.autoActive=0;
	}
	}	
	

function autorefreshCompteurDiap(){//met à jour le compteur de diapo affiché
	CP.getElementById('autoaffNbDiap').innerHTML=diapo.autoNb;
	}
	
function autodiapo1(){//retour à la première diapo
	autoaffDiap(1);
	}
	

	//----------------------config et lecture du diaporama auto --------------------------------------	
	
	
function diapoVal(){//met à jour les réglages de durée de diapo lorsque le champ concerné est modifié par l'utilisateur.
		diapo.duree = (CP.getElementById('duree_diapo').value*1000);
		//if (diapo.duree < 0.5) {alert('Problème : Durée incorrecte, vérifier !');}
		flashSave();
}

		
function diapoAuto() {//Lance ou arrête le diaporama automatique
	
	if (!CP.getElementById('autodiapo1')){alert('Problème : Aucune diapo ! Ajoutez-en à l\'aide du bouton prévu à cet effet...');return;}//si la diapo demandée n'existe pas, ciao !
	var DiapoDiv = afficheur.getElementById('diapo');
	DiapoDiv.className = "diapo_on"; //on affiche la div diapo au cas où elle ne le serait pas
		if (afficheur.getElementById('ecranPublic').className=="allume") {//si l'écran public était allumé, on l'éteint pour que le diaporama ne se superpose pas)
		ecranOnOff();}
		CP.getElementById('diapo_on_off').innerHTML = '<i class="fas fa-eye-slash"></i>&nbsp;&nbsp;Masquer le diaporama';//on met à jour l'intitulé du bouton
	
	diapo.duree = (CP.getElementById('duree_diapo').value*1000);//conversion en millisecondes
		
	if (diapo.duree < 500) {alert('Problème : Durée incorrecte, vérifier !');
	return;}
	else{diapoloopActif=true;//on autorise le diaporama à boucler
	diapo.autoActive=1;//on se repositionne sur l'image 1
	clearTimeout(timerDiapo);//on stoppe le timer de diapo au cas où il serait déjà actif...
	goDiapo();}//et on lance la fonction diaporama automatique
	
	flashSave();
}
	
function goDiapo(){

	//début de l'affichage diapo
		
		if (diapoloopActif == true) {//si le diaporama est autorisé à boucler...
		
		CP.getElementById('boutonRunDiapoAuto').disabled=true;//on active ou désactive les boutons concernés  
		CP.getElementById('boutonStopDiapoAuto').disabled=false;
		
		autoaffDiap(diapo.autoActive);// on affiche l'image en cours du diaporama auto
		
		if (diapo.autoActive < diapo.autoNb){diapo.autoActive = diapo.autoActive+1;} else {diapo.autoActive=1;}	// si on est pas arrivé au bout, on incrémente pour afficher la diapo suivante à la prochaine boucle, sinon on affichera la première
					
		timerDiapo = setTimeout("goDiapo()",diapo.duree);// retour au début lorsque la durée d'affichage est écoulée	
		
		}//fin de la condition diapoloopActif autorisé à boucler
		
		else{return;}//si le diaporama n'est pas autorisé à boucler : on sort !
		
}	


function stopDiapo(){// pour interrompre le diaporama
	
	clearTimeout(timerDiapo);//on stoppe le timer de diapo
	diapoloopActif = false;//double sécurité pour lui interdire de boucler 
	CP.getElementById('boutonRunDiapoAuto').disabled=false;//on active ou désactive les boutons concernés 
	CP.getElementById('boutonStopDiapoAuto').disabled=true;
	flashSave();
	}	
	
	
function diapoOnOff(){//permet d'afficher ou masquer le diaporama (en fait d'afficher ou masquer la div correspondante soit "diapo")

	stopDiapo();//quelle que soit la situation on stoppe le diaporama automatique au cas où il bouclerait en tâche de fond

	var DiapoDiv = afficheur.getElementById('diapo');
	if (DiapoDiv.className == "diapo_on") { //si l'afficheur de diaporama est visible
		DiapoDiv.className = "diapo_off"; //on le masque
		CP.getElementById('diapo_on_off').innerHTML = '<i class="fas fa-eye"></i>&nbsp;&nbsp;Afficher le diaporama';
		
		
	} else { //sinon l'inverse !
		DiapoDiv.className = "diapo_on";
		if (afficheur.getElementById('ecranPublic').className=="allume") {//mais si l'écran public était allumé, on l'éteint pour que le diaporama ne se superpose pas)
		ecranOnOff();}
		CP.getElementById('diapo_on_off').innerHTML = '<i class="fas fa-eye-slash"></i>&nbsp;&nbsp;Masquer le diaporama';	
	}

flashSave();	
	}