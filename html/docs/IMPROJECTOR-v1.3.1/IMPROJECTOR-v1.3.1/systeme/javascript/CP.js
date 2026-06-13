

//-----------------------------------fonctionnalités spécifiques à l'interface du panneau de contrôle---------------

function onglet(id) {//système d'onglets
	
	CP.getElementById('titre').innerHTML="Panneau de contrôle - Improjector v"+ImprojVerNum;//on met à jour le titre sinon Chrome fait n'imp'
	
	CP.getElementById('avant-match').style.display="none";CP.getElementById('onglet-avant-match').classList.remove("selected");
	CP.getElementById('match').style.display="none";CP.getElementById('onglet-match').classList.remove("selected");
	CP.getElementById('sliders').style.display="none";CP.getElementById('onglet-sliders').classList.remove("selected");
	CP.getElementById('design').style.display="none";CP.getElementById('onglet-design').classList.remove("selected");
	CP.getElementById('sauvegarde').style.display="none";CP.getElementById('onglet-sauvegarde').classList.remove("selected");
	CP.getElementById('journal').style.display="none";CP.getElementById('onglet-journal').classList.remove("selected");
	
	CP.getElementById(id).style.display="inline";CP.getElementById('onglet-'+id).classList.add("selected");
	
}


function showHide(shID) {//système de spoiler (pour afficher ou masquer les vignettes du diaporama)
    if (CP.getElementById(shID)) {
        if (CP.getElementById(shID+'-voir').style.display != 'none') {
            CP.getElementById(shID+'-voir').style.display = 'none';
			CP.getElementById(shID+'-hide').style.display = 'inline';
            CP.getElementById(shID).style.display = 'block';
        }
        else {
            CP.getElementById(shID+'-voir').style.display = 'inline';
            CP.getElementById(shID+'-hide').style.display = 'none';
			CP.getElementById(shID).style.display = 'none';
        }
    }
}


function aide_On_Off(){//affiche ou masque les picto d'aide du CP

	if(aideOnOff=="on"){
		aideOnOff="off";
		CP.getElementById('infoBulOnOff').style.color = "grey";
		setTimeout(function(){CP.getElementById('txtinfobullespecial').innerHTML="Besoin d'aide ? Cliquez ici pour afficher les pictos d'aide dans le panneau de contrôle.";},1000);		
		
		var pictos = CP.getElementsByClassName("info");
		for(var i=0; i < pictos.length; i++) { 
		pictos[i].style.display = "none";	
	}
	return;

	}
		if(aideOnOff=="off"){
		aideOnOff="on";
		CP.getElementById('infoBulOnOff').style.color = "#DE9D19";
		setTimeout(function(){CP.getElementById('txtinfobullespecial').innerHTML="Vous êtes un expert d'Improjector ? Cliquez ici pour masquer les pictos de l'aide.";},1000);
		
		
		var pictos = CP.getElementsByClassName("info");
		for(var i=0; i < pictos.length; i++) { 
		pictos[i].style.display = "inline";	
}
		}
}


//--------------------------------------divers trucs qui s'initialisent à l'ouverture du panneau de contrôle----------------------------------------


function nettoyage(){//fonction qui se lance au démarrage pour supprimer tout contenu inutile de l'afficheur
	
	afficheur.getElementById('contenuPanneauControle').innerHTML="";//on n'a plus besoin de ça dans le document...
	afficheur.getElementById('selfdestruction').innerHTML="";//ni de ça (autosuppression du script)...
	afficheur.getElementById('accueil').innerHTML="";//ni de ça...
	afficheur.getElementById('accueil').style.display="none";//ni de ça...
	afficheur.getElementById('body').style.overflow="hidden !important";	
	afficheur.getElementById('hide').style.display="inline";//et enfin on affiche tout ce qui était caché jusque là...

	document.onkeydown=disableF5;//on active le blocage de l'actualisation
	}


var surveillance = setInterval(function() {//on va surveiller l'état de l'afficheur pour alerter s'il a été fermé ou ne répond plus
    if(!window.opener) {clearInterval(surveillance); PC.focus();
	if (confirm('L\'Écran destiné au public ne répond plus, il a probablement été fermé ou réactualisé. Il ne pourra pas refonctionner tant que le panneau de contrôle reste ouvert. Voulez-vous fermer le panneau de contrôle ?'))
	{self.close();}
	};  
   }, 3000);
   
window.onbeforeunload = function(){//affichage d'un avertissement si on veut quitter ou rafraîchir la page du panneau de contrôle :
    if (window.opener) {//si l'afficheur est encore ouvert, avertissement (sinon inutile)...
	return "Attention, la fermeture du panneau de contrôle ou de l'afficheur vous fait perdre vos réglages non sauvegardés, les infos du match en cours ! Êtes-vous sûr ?";
	}
	};
	
	
	