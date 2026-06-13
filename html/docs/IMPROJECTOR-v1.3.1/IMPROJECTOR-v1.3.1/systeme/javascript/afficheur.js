
//---------------------------------------fonctions spécifiques à l'afficheur-----------------------------



//Fonction utilisée pour plein ecran par clic sur "vs"
	
	  function pleinecran(){
	  
	if (!document.fullscreenElement && !document.msFullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        }else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
		
}
		
	


window.onbeforeunload = function(){//affichage d'un avertissement si on veut quitter ou rafraîchir la page :
    if (CP) {//si le panneau de contrôle est encore ouvert, avertissement (sinon inutile)...
	return "Attention, la fermeture du panneau de contrôle ou de l'afficheur vous fait perdre vos réglages non sauvegardés, les infos du match en cours ! Êtes-vous sûr ?";
	}
	};
	
	
	
	
	
	
	
	
