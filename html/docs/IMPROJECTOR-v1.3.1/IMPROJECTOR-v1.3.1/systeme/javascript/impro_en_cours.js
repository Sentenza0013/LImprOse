	// -------------- FONCTIONS INTERVENANT AVANT l'AFFICHAGE DE L'IMPRO EN COURS, PUIS l'AFFICHANT ----------------------
	
	
	function def_durée_impro() { //remplace les champs vides par "00" (pour afficher par exemple 5:00 si le champ secondes est vide)
	
	duree_impro_min = CP.getElementById('durée_impro_min').value;//récupération des valeurs entrées par l'utilisateur dans le panneau de contrôle
	duree_impro_sec = CP.getElementById('durée_impro_sec').value;
	duree_impro_min = ("0" + duree_impro_min).slice(-2);//ici on formate les nombre pour qu'ils aient toujours 2 chiffres (ex. 5 = 05) et pour que la case minute ou seconde vide donne "00"
	duree_impro_sec = ("0" + duree_impro_sec).slice(-2);
	if (duree_impro_min == '0') {duree_impro_min = '00';}
	if (duree_impro_sec == '0') {duree_impro_sec = '00';}
	
	}
	
	
	
	function def_impro_mixcomp() { //définit le contenu de la variable va_mixcomp (mixte/comparée) en fonction de ce qui est coché
	
	impro.type = 'Improvisation'; // Contenu par défaut en cas d'oubli de choix
	if (CP.getElementById('radiomixte').checked==true) {impro.type='Mixte';};
	if (CP.getElementById('radiocomp').checked==true) {impro.type='Comparée';};
	
	}
	
	function def_cat_impro() {// définit le contenu de la variable de catégorie d'impro (va_cat_impro)
	
	impro.categorie = CP.getElementById('cat_impro').value;
	if (impro.categorie=='') {impro.categorie = 'Libre';}; // "Libre" --> Contenu par défaut si le champ "catégorie" a été laissé vide
		
	}
	
	
	function varimpro() { //mise à jour des variables globales concernant l'impro en cours
		
		def_impro_mixcomp(); //on appelle la fonction qui définit si c'est mixte on comparé
		impro.titre = CP.getElementById('improtitre').value;
		def_cat_impro();//on appelle la fonction qui définit la catégorie
		def_durée_impro();//on appelle la fonction qui définit les minutes et secondes
		impro.duree = duree_impro_min+':'+duree_impro_sec;// puis on concatène min et sec
				
	}
	
		
		function improrefresh(){ //(ré)affichage des variables de l'impro en cours sur l'écran public
		
		checkInfosImpros(); //on vérifie qu'aucun champ indispensable n'a été oublié
		if (checkImproOk==false){alert('Informations manquantes ou incorrectes, vérifiez !'); return;}
				
		duree_impro_min=0; //vidage des compteurs de temps
		duree_impro_sec=0; //vidage des compteurs de temps
		stopTimerImpro(); //arrêt du compteur
		afficheur.getElementById('content-impro').style='width: 60%;';//rétablissement largeur contenu central
		afficheur.getElementById('bandeauinfosimpro').className='bandeauinfosimpro';//on réaffiche les éléments cachés en mode attente (effet animation css à leur réapparition)...
		afficheur.getElementById('af_big_timer').className='timer-impro';
		afficheur.getElementById('wait').style='display: none;';//et on masque la div contenant l'écran d'attente...
				
		
		varimpro(); //on met à jour les infos de l'impro
		
		afficheur.getElementById('af_texte_accueil').style.display = "none";//on masque le message d'accueil au cas où il serait présent
		afficheur.getElementById('af_mix_comp').style.visibility = "visible";//on (ré)affiche les infos au cas où elles auraient été masquées par le message d'accueil
		afficheur.getElementById('af_cat_impro').style.visibility = "visible";
		afficheur.getElementById('af_durée_impro').style.visibility = "visible";
		if(design.timerPeriodePartiel==true){afficheur.getElementById('timer-periode-on-off').style.display="none";}//on masque le compte-à-rebours de période si l'utilisateur souhaite le masquer pendant les impros
		
		//puis on affiche dans le tableau public :
		afficheur.getElementById('af_mix_comp').innerHTML = titMixComp+impro.type;//titMixComp contient "Improvisation : " ...ou rien selon le choix de l'utilisateur (pour afficher "Improvisation : Mixte/comparée" ou juste "Mixte/comparée")
		afficheur.getElementById('af_titre_impro').innerHTML = '<div class="effet_elastique">'+impro.titre+'</div>';//animation titre
		afficheur.getElementById('af_cat_impro').innerHTML = titCat+impro.categorie;//titCat contient "Catégorie : " ...ou rien selon le choix de l'utilisateur (on fait précéder la catégorie XXX par "Catégorie : XXX" ou par rien)
		afficheur.getElementById('af_durée_impro').innerHTML = '&nbsp;•&nbsp;'+titDuree+impro.duree;//titCat contient "Durée : " ...ou rien selon le choix de l'utilisateur (on fait précéder la durée XX:XX par "Durée : XX:XX" ou par rien)
		afficheur.getElementById('af_big_timer').innerHTML = impro.duree;
		afficheur.getElementById('af_big_timer').style = "-webkit-animation: rubberBand 1s 1";//animation timer
		setTimeout(function(){afficheur.getElementById('af_big_timer').style = "";},1200);//on laisse l'animation se terminer et on nettoie
		
		flash();//on déclenche l'animation "effet flash"
		
		if (design.timerImproOnOff=="block") {//seulement si l'utilisateur a choisi d'afficher le timer des impros en cours...
		CP.getElementById('boutonImproGo').disabled = false; //on dégrise le bouton qui lui permet de lancer le timer de l'impro
		} else {CP.getElementById('boutonImproGo').disabled = true;} //sinon on le grise au cas où il ne le serait pas
		
		afficheur.getElementById('af_timer_periode').style='color:' + design.couleurInfos + '; font-size: 2vmin;'; //on remet le timer période à sa taille initiale (il a été agrandi durant l'écran d'attente)
		
		journalMatchImpro();//on ajoute l'impro au journal de match
		
		flashSave();
	}

	
function checkInfosImpros()// pour s'assurer que rien ne manque avant d'afficher les infos de l'impro (définition variable checkImproOk sur vrai/faux)
{
		if (
		(CP.getElementById('radiomixte').checked==false && CP.getElementById('radiocomp').checked==false)
		||
		(CP.getElementById('improtitre').value==0)
		||
		(CP.getElementById('durée_impro_min').value+CP.getElementById('durée_impro_sec').value==0)
		) {checkImproOk=false;}
		else {checkImproOk=true;};
	}
	
	
	
//effet "flash"

	function flash(){
		afficheur.getElementById('effet-flash').innerHTML = '<div id="surcouche" class="surcouche_effets"></div>';//apparition d'une div avec animation css
		setTimeout(function(){ //pause de 3s le temps que l'annimation se joue
		afficheur.getElementById('effet-flash').innerHTML = ''; //nettoyage de la div devenue inutile
        },3000);
	}
	
	
	//Fonction écran d'attente entre deux impros et réinitialisation des champs de l'impro en cours
	
	function wait(){
		
		flash();//on déclenche l'animation "effet flash"
		
		chaussons=Number(CP.getElementById('nbchaussons').value);//on actualise la valeur du compteur de chaussons et on met à jour le texte en conséquence
		majTxtWait();
		
		
		CP.getElementById('radiomixte').checked=false;//on nettoie les champs de l'impro en cours
		CP.getElementById('radiocomp').checked=false;
		CP.getElementById('improtitre').value='';
		CP.getElementById('cat_impro').value='';
		CP.getElementById('durée_impro_min').value='';
		CP.getElementById('durée_impro_sec').value='';
		CP.getElementById('boutonImproGo').disabled = true; //on grise le bouton qui permet de lancer le timer de l'impro
		
		stopTimerImpro()//on arrête le timer d'impro (normalement il l'est déjà)
		
		afficheur.getElementById('bandeauinfosimpro').className='bandeauinfosimprocaché';//appel d'une classe display none pour les éléments à masquer
		afficheur.getElementById('af_big_timer').className='timer-improcaché';//masquage timer d'impro en cours
		afficheur.getElementById('wait').style='display: inline;';//affichage de la div contenant l'écran d'attente
		//afficheur.getElementById('content-impro').style='width: auto;';//réduction largeur contenu central
		afficheur.getElementById('af_timer_periode').style='color: ' + design.couleurInfos + '; font-size: 4vmin;'; //agrandissement timer période
		afficheur.getElementById('timer-periode-on-off').style.display=design.timerPeriodeOnOff;//on rétablit l'état (visible ou non) du compte à rebours de période
		
		flashSave();
	}
	
	
	//----------------------------------------------COMPTAGE CHAUSSONS-------------------------
	
	function majCPnbchaussons(){//mise à jour du champ en fonction de la variable compteur de chaussons
		CP.getElementById('nbchaussons').value=chaussons;
					
	}
	
	
	function chaussonsDecr(){//compteur de chaussons - 1
		
		chaussons=Number(CP.getElementById('nbchaussons').value);
		chaussons=chaussons-1;
		majCPnbchaussons();
	}
	
	function chaussonsIncr(){//incrémentation compteur de chaussons
		
		chaussons=Number(CP.getElementById('nbchaussons').value);
		chaussons=chaussons+1;
		majCPnbchaussons();
	}
	
	function chaussonsIncrRand(){//incrémentation compteur de chaussons avec un chiffre aléatoire compris entre 2 et 6
		
		var rand=Math.floor((7-2)*Math.random())+2;
		chaussons=Number(CP.getElementById('nbchaussons').value);
		chaussons=chaussons+rand;
		majCPnbchaussons();
		
	}
	
	function majChaussonsManuel(){//mise à jour du compteur de chaussons à partir du contenu du champ
		
		chaussons=Number(CP.getElementById('nbchaussons').value);
		majCPnbchaussons();
		majTxtWait();
	}
	
	function validNbChaussons(e) {//fonction déclenchée chaque fois qu'un truc est tapé dans le champ du compteur de chaussons
    if (e.keyCode == 13) {//si la touche pressée est entrée, alors on met à jour le compteur
    majChaussonsManuel();    
    }
}
	
//-----------------------------------------Affichage message d'accueil ou autre-------------------

function affichTxtAccueil() {//fonction qui affiche le texte d'accueil à la place du titre de l'impro
	design.txtAccueil = CP.getElementById('texte_accueil').value;//on récupère la valeur de l'utilisateur dans le panneau de contrôle
	afficheur.getElementById('af_texte_accueil').style.display = "inline";//on (ré)affiche (si masqué lors de l'affichage du titre de l'impro)
	afficheur.getElementById('af_titre_impro').innerHTML = "";
	afficheur.getElementById('af_mix_comp').style.visibility = "hidden";//on masque les infos de l'impro en cours
	afficheur.getElementById('af_cat_impro').style.visibility = "hidden";
	afficheur.getElementById('af_durée_impro').style.visibility = "hidden";
	afficheur.getElementById('wait').style='display: none;';//ou on masque l'écran d'attente au cas où il serait actif
	afficheur.getElementById('content-impro').style='width: 69%;';//rétablissement largeur-type du contenu central
	afficheur.getElementById('bandeauinfosimpro').className='bandeauinfosimpro';//on affiche la div conteneur
	afficheur.getElementById('af_texte_accueil').innerHTML = '<div class="effet_elastique">'+design.txtAccueil+'</div>';//on applique (avec aniation css effet élastique et effet flash)
	flash();

	flashSave();
	}

	