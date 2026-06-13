var ap=window.closed;//pour éviter des bugs par la suite, on prétend que la fenêtre d'aperçu est un objet déjà existant, mais qu'elle a été fermée.



function openapercu(){//ouvre la fenetre d'aperçu
	
	if (navigator.userAgent.indexOf('Edge') >= 0){alert('Votre navigateur est incompatible avec cette fonctionnalité...');return;}
	
	var x = (window.screenX || window.screenLeft || 0);//récupère la position du panneau de contrôle au moment du clic, qu'on réutilisera ensuite pour que la popup d'aperçu ne s'ouvre pas n'importe où, et en particulier sur l'écran public !
	var y = (window.screenY || window.screenTop || 0);
	
	
	var hauteur=((afficheur.getElementById('html').offsetHeight*design.ratioApercu));//définition de la largeur et hauteur de la fenetre d'apercu en fonction du ratio défini + 20px en hauteur pour le bandeau aperçu
	var largeur=(afficheur.getElementById('html').offsetWidth*design.ratioApercu);	
	var param='"alwaysRaised=yes,toolbar=no,location=no,directories=no,menubar=no,scrollbars=no,status=no,resizable=no,width='+largeur+',height='+hauteur+',top='+y+',left='+x+'"';//paramètres de la future fenêtre d'apercu (taille, position et autres).
	
		
	window.ap=window.open("","apw",param);//ouverture de la fenêtre d'apercu avec les paramètres définis. L'élément s'appelera "ap" comme aperçu
	
	window.ap.focus();//on met la fenetre d'aperçu au premier plan
	
	ap=window.ap;
	
	ap.document.write('<!DOCTYPE html><html lang="fr" id="html"></html>');
	
	ap.document.getElementById('html').innerHTML=afficheur.getElementById('html').innerHTML;//on charge dans l'aperçu une copie du contenu de l'afficheur...
	
	
	apercuDiff();	//on change ce qui est spécifique à l'aperçu
		
	
	observer.observe(targetNode, config);// On commence à observer le noeud cible pour les mutations précédemment configurées (bref, on surveille les changements dans l'afficheur, afin de les reporter dans l'aperçu)
		
}



/////////Pour rafraichir l'aperçu, on surveille en direct les changements dans l'afficheur et on reporte dans l'aperçu :

var targetNode = afficheur.getElementById('html');// Selectionne le noeud de l'afficheur dont les mutations seront observées (en l'occurence 'html' qui est à la racine dans l'afficheur)

var config = { attributes: true, childList: true, characterData: true, subtree: true };// Options de l'observateur (type de mutations à observer)

var callback = function(mutationsList) {// Fonction callback à éxécuter quand une mutation est observée dans l'afficheur
    
	if (!window.ap||window.ap.closed||window.ap===undefined) {observer.disconnect();return;}//si la fenetre d'aperçu n'existe pas (ou plus) on met fin à la surveillance des mutations dans l'afficheur
	
	for(var mutation of mutationsList) {//pour chaque mutation

	observer.disconnect();//on déconnecte la surveillance le temps de faire les changements
	
	console.log('change !');
	
	var modif=mutation.target.id; //on récupère l'id qui a muté dans la variable modif 
	
	//et si elles sont différentes, on copie les propriétés importantes du noeud concerné de l'afficheur vers son homonyme dans l'aperçu 
	var apcss=ap.document.getElementById(modif).style.cssText;
	var afcss=afficheur.getElementById(modif).style.cssText;
	var apclass=ap.document.getElementById(modif).className;
	var afclass=afficheur.getElementById(modif).className;
	var aphtml=ap.document.getElementById(modif).innerHTML;
	var afhtml=afficheur.getElementById(modif).innerHTML;
	var apsrc=ap.document.getElementById(modif).src;
	var afsrc=afficheur.getElementById(modif).src;
	var aphref=ap.document.getElementById(modif).href;
	var afhref=afficheur.getElementById(modif).href;
	
	if (aphtml!==afhtml) {ap.document.getElementById(modif).innerHTML=afhtml;}
	if (apcss!==afcss) {ap.document.getElementById(modif).style.cssText=afcss;}
	if (apclass!==afclass) {ap.document.getElementById(modif).className=afclass;}
	if (apsrc!==afsrc) {ap.document.getElementById(modif).src=afsrc;}
	if (aphref!==afhref) {ap.document.getElementById(modif).href=afhref;}
	
	
	//ap.document.getElementById(modif).parentNode.innerHTML=afficheur.getElementById(modif).parentNode.innerHTML; //méthode plus économique mais non conservée (rendu moins fidèle)
	
	apercuDiff();//on change ce qui est spécifique à l'aperçu
	
	observer.observe(targetNode, config);//on rebranche la surveillance
	
	}	
	
	
};

// Créé une instance de l'observateur lié à la fonction de callback
var observer = new MutationObserver(callback);
	

function apercuDiff(){//modifie l'aperçu en fonctions de ses spécificités vis-a-vis de l'afficheur
	
	ap.document.getElementById('titre').innerHTML="Aperçu - Improjector";//on modifie le titre de la fenêtre d'aperçu, et on y fait apparaître le bandeau aperçu pour la différencier de l'afficheur
	ap.document.getElementById('bandeau_apercu').style.display="inline-block";//on rend visible le bandeau aperçu, qui est masqué côté l'afficheur
	ap.document.getElementById('vscadre').setAttribute('onclick','');ap.document.getElementById('vscadre').removeAttribute('href');ap.document.getElementById('vscadre').style.cursor="default";ap.document.getElementById('vscadre').title="";ap.document.getElementById('fullscreen').style.display="none";//on désactive tout ce qui se rattache au vs cliquable (l'aperçu n'a pas à passer en plein écran)
	ap.document.getElementById('html').style="cursor: default !important";//curseur normal sur tout l'aperçu
	
	//neutralisation ciblée d'éventuels réglages atypiques de l'afficheur par l'utilisateur :
	ap.document.getElementById('html').style.transform="";//pas de retournement d'image pour l'aperçu même si l'utilisateur a choisi le mode "projection par l'arrière"
	ap.document.getElementById('ecranPublic').style.transform='';ap.document.getElementById('diapo').style.transform='';//pas de zoom
	ap.document.getElementById('conteneur').style.transformOrigin='';ap.document.getElementById('conteneur').style.transform='';//pas de recadrage
	ap.document.getElementById('header').style.marginTop='';ap.document.getElementById('diapo').style.marginTop='';//et pas de rencentrage
	
}
	
	
///////redimensionnements	
	


var resizeViewPort = function(width, height) {//fonction pour redimensionner une fenetre sans prendre en compte les barres d'outils
    if (ap.window.outerWidth) {
        ap.window.resizeTo(
            width + (ap.window.outerWidth - ap.window.innerWidth),
            height + (ap.window.outerHeight - ap.window.innerHeight)
        );
    } else {
        ap.window.resizeTo(500, 500);
        ap.window.resizeTo(
            width + (500 - ap.window.document.body.offsetWidth),
            height + (500 - ap.window.document.body.offsetHeight)
        );
    }
};


window.opener.onresize = redimApercu;//dès que l'afficheur est redimensionné, redimensionnement de la fenêtre d'apercu selon le facteur voulu

function redimApercu(){
 
	var hauteur=(afficheur.getElementById('html').offsetHeight*design.ratioApercu);//définition de la largeur et hauteur de la fenetre d'apercu en fonction du ratio défini + 20px en hauteur pour le bandeau aperçu
	var largeur=(afficheur.getElementById('html').offsetWidth*design.ratioApercu);
	
	if (!window.ap||window.ap.closed||window.ap===undefined){return;}
	else{
	resizeViewPort(largeur, hauteur);
	}
 
}

function setApRatio(){//modification par l'utilisateur du ratio de taille de la fenetre d'aperçu
	
	design.ratioApercu=CP.getElementById('taille_apercu').value;//on récupère la valeur dans le CP, on met à jour la variable
	CP.getElementById('taille_apercu').title=(design.ratioApercu*100)+'%';//on met à jour l'infobulle de la jauge
	if (!window.ap||window.ap.closed||window.ap===undefined){flashSave();return;}//si la fenêtre d'aperçu est fermée ou inexistante, on arrête là
	else{//sinon
	redimApercu();//on applique le nouveau dimensionnement
	window.ap.focus();//on replace l'aperçu au premier plan
	}
	flashSave();
}