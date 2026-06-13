
function changemode(){//switch mode simple/mode complet
	
	if (design.simple==false){design.simple=true;}else{design.simple=false;}//change la valeur de la variable qui indique si on est en mode simple ou complet
	mode();//on lance la fonction qui permet la prise en compte du mode choisi
	flashSave();
}


function mode(){//fonction qui permet la prise en compte du mode choisi (simple/complet)
	
		
	if (design.simple==true){//si le mode simple est activé...
	
	var els = CP.getElementsByClassName("complexe");//on cible les éléments dont la classe est "complexe"
	
	Array.prototype.forEach.call(els, function(el) {//pour chacun de ces éléments...
    
	el.classList.add("adios");}); //on ajoute une classe "adios" (qui contient un display:none pour les masquer)

	CP.getElementById("mode_CP_1").checked=true;CP.getElementById("mode_CP_2").checked=true;//on coche les box "mode simple";
	CP.getElementById("mode_match_div").style.display='block';//on fait apparaître le bouton qui permet de passer au mode match

	
	}

	
	else {//si le mode complet est activé...
		
	var els = CP.getElementsByClassName("complexe");//on cible les éléments dont la classe est "complexe"
	
	Array.prototype.forEach.call(els, function(el) {//pour chacun de ces éléments...
    
	el.classList.remove("adios");}); //on elève la classe "adios" (qui contient un display:none) afin de les réafficher
	
	CP.getElementById("mode_CP_1").checked=false;CP.getElementById("mode_CP_2").checked=false;//on décoche les box "mode simple";
	CP.getElementById("mode_match_div").style.display='none';//on masque le bouton qui permet de passer au mode match
		
	}
		
}


function changemodeMR(){//switch mode match/mode réglage
	
	if (design.match==false){design.match=true;}else{design.match=false;}//change la valeur de la variable qui indique si on est en mode match ou reglage
	modeMR();//on lance la fonction qui permet la prise en compte du mode choisi
	
}


function modeMR(){//fonction qui permet la prise en compte du mode choisi (match/réglage)
	
	if (design.match==true){//si le mode match est activé...
	
	var els = CP.getElementsByClassName("reglage");//on cible les éléments dont la classe est "reglage"
	
	Array.prototype.forEach.call(els, function(el) {//pour chacun de ces éléments...
    
	el.classList.add("adios");}); //on ajoute une classe "adios" (qui contient un display:none pour les masquer)

	CP.getElementById("mode_reg").style.display='inline-block';//on fait apparaitre le bouton qui permet de revenir au mode réglages
	CP.getElementById("mode_match").style.display='none';//on masque le bouton qui permet de passer au mode match
	
    }

	else {//si le mode reglage est activé...
		
	var els = CP.getElementsByClassName("reglage");//on cible les éléments dont la classe est "reglage"
	
	Array.prototype.forEach.call(els, function(el) {//pour chacun de ces éléments...
    
	el.classList.remove("adios");}); //on elève la classe "adios" (qui contient un display:none) afin de les réafficher
	
	CP.getElementById("mode_reg").style.display='none';//on masque le bouton qui permet de revenir au mode réglages
	CP.getElementById("mode_match").style.display='inline';//on fait apparaître le bouton qui permet de passer au mode match		
	
	}
	

	
	
	
}