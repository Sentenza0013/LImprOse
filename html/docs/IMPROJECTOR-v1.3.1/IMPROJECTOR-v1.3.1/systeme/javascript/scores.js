	// -------------- SYSTEME DE POINTS --------------------------
	
	function scoreIncrG() {
		equipegauche.score=equipegauche.score+1;//incrémentation
		JournalMatchEquipeGIncr();//mise à jour du journal de match
		CP.getElementById('af_scoreGaucheCP').innerHTML = equipegauche.score;//actualisation panneau de contrôle
		afficheur.getElementById('af_score_G').innerHTML = equipegauche.score;//actualisation tableau d'affichage
		afficheur.getElementById('fondscoreG').style = "-webkit-animation: bounceIn 1s 1";//animation bounce
		setTimeout(function(){afficheur.getElementById('af_score_G').style = "-webkit-animation: clignoscore 0.3s infinite";},700);//animation clignotement après 1s
		setTimeout(function(){afficheur.getElementById('af_score_G').style = "";},2500);//on laisse les animations se terminer et on nettoie
		setTimeout(function(){afficheur.getElementById('fondscoreG').style = "";},1200);
		flashSave();
	}
	
		function scoreDecrG() {
		equipegauche.score=equipegauche.score-1;
		JournalMatchEquipeGDecr();//mise à jour du journal de match
		CP.getElementById('af_scoreGaucheCP').innerHTML = equipegauche.score;
		afficheur.getElementById('af_score_G').innerHTML = equipegauche.score;
		flashSave();
	}
	
		function scoreIncrD() {
		equipedroite.score=equipedroite.score+1;
		JournalMatchEquipeDIncr();//mise à jour du journal de match
		CP.getElementById('af_scoreDroiteCP').innerHTML = equipedroite.score;
		afficheur.getElementById('af_score_D').innerHTML = equipedroite.score;
		afficheur.getElementById('fondscoreD').style = "-webkit-animation: bounceIn 1s 1";
		setTimeout(function(){afficheur.getElementById('af_score_D').style = "-webkit-animation: clignoscore 0.3s infinite";},700);
		setTimeout(function(){afficheur.getElementById('af_score_D').style = "";},2500);
		setTimeout(function(){afficheur.getElementById('fondscoreD').style = "";},1200);
		flashSave();
	}
	
		function scoreDecrD() {
		equipedroite.score=equipedroite.score-1;
		JournalMatchEquipeDDecr();//mise à jour du journal de match
		CP.getElementById('af_scoreDroiteCP').innerHTML = equipedroite.score;
		afficheur.getElementById('af_score_D').innerHTML = equipedroite.score;
		flashSave();
	}
	
		function penoG(journal) { //gestion pénalités de l'équipe de gauche
			
			var totalpenoG = 0;
			
			if (CP.getElementById('peno_1_gauche').checked == true) //comptage du nombre de pénalités + actualisation affichage pénalités
				{	totalpenoG=totalpenoG+1;
				afficheur.getElementById('af_peno1G').className="penoX";}//rappel = penoX est la classe d'une pénalité allumée, peno la classe d'une pénalité éteinte
				else {afficheur.getElementById('af_peno1G').className="peno";}
			
			if (CP.getElementById('peno_2_gauche').checked == true)
				{	totalpenoG=totalpenoG+1;
				afficheur.getElementById('af_peno2G').className="penoX";}
				else {afficheur.getElementById('af_peno2G').className="peno";}	
			
			
			if (CP.getElementById('peno_3_gauche').checked == true)
				{	totalpenoG=totalpenoG+1;
				afficheur.getElementById('af_peno3G').className="penoX";}
				else {afficheur.getElementById('af_peno3G').className="peno";}	
			
			//---partie spécifique pour le journal de match :
			if (journal != "nojournal"){//si la fonction n'a pas été déclenchée avec l'argument "nojournal"
			if (totalpenoG == 1) {JournalMatchEquipeG1Peno();}
			if (totalpenoG == 2) {JournalMatchEquipeG2Peno();}
			if (totalpenoG == 3) {JournalMatchEquipeG3PenoConvert();}
			}
			//---fin de la partie liée au journal de match
			
			if (totalpenoG == 3) {CP.getElementById('basculeG').disabled = false;} else {CP.getElementById('basculeG').disabled = true;}  //(ré)activation bouton Convertir les pénalités) si 3 pénalités et désactivation dans le cas contraire
				
				flashSave();
				
				}
			
		function penoD(journal) { //gestion pénalités de l'équipe de droite
			
			var totalpenoD = 0;
			
			if (CP.getElementById('peno_1_droite').checked == true) //comptage du nombre de pénalités + actualisation affichage pénalités
				{	totalpenoD=totalpenoD+1;
				afficheur.getElementById('af_peno1D').className="penoX";}
				else {afficheur.getElementById('af_peno1D').className="peno";}
			
			if (CP.getElementById('peno_2_droite').checked == true)
				{	totalpenoD=totalpenoD+1;
				afficheur.getElementById('af_peno2D').className="penoX";}
				else {afficheur.getElementById('af_peno2D').className="peno";}	
			
			
			if (CP.getElementById('peno_3_droite').checked == true)
				{	totalpenoD=totalpenoD+1;
				afficheur.getElementById('af_peno3D').className="penoX";}
				else {afficheur.getElementById('af_peno3D').className="peno";}	

			//---partie spécifique pour le journal de match :
			if (journal != "nojournal"){//si la fonction n'a pas été déclenchée avec l'argument "nojournal"
			if (totalpenoD == 1) {JournalMatchEquipeD1Peno();}
			if (totalpenoD == 2) {JournalMatchEquipeD2Peno();}
			if (totalpenoD == 3) {JournalMatchEquipeD3PenoConvert();}
			}
			//---fin de la partie liée au journal de match

				
			if (totalpenoD == 3) {CP.getElementById('basculeD').disabled = false;} else {CP.getElementById('basculeD').disabled = true;}  //(ré)activation bouton Convertir les pénalités) si 3 pénalités et désactivation dans le cas contraire
				
				flashSave();
				
				}
				
				
		function PenoGconvert(){ //conversion pénalités de l'équipe de gauche -> +1 pour l'équipe de droite
			
			CP.getElementById('basculeG').disabled = true; //désactivation du bouton avant d'appliquer son effet
			
			afficheur.getElementById('af_peno1G').className="peno";//extinction des pénalités sur le tableau d'affichage
			setTimeout(function(){afficheur.getElementById('af_peno2G').className="peno";},400);//délai de 400 et 800 ms pour les éteindre une par une
			setTimeout(function(){afficheur.getElementById('af_peno3G').className="peno";},800);
			
			CP.getElementById('peno_1_gauche').checked = false;//décochage des pénalités sur le panneau de contrôle
			CP.getElementById('peno_2_gauche').checked = false;
			CP.getElementById('peno_3_gauche').checked = false;
			
			setTimeout(function(){scoreIncrD();},1400);//ajout d'un point à l'autre équipe après 1.4s
						

			flashSave();
			}


		function PenoDconvert(){ //conversion pénalités de l'équipe de droite -> +1 pour l'équipe de gauche
			
			CP.getElementById('basculeD').disabled = true; //désactivation du bouton avant d'appliquer son effet
			
			afficheur.getElementById('af_peno1D').className="peno";//extinction des pénalités sur le tableau d'affichage
			setTimeout(function(){afficheur.getElementById('af_peno2D').className="peno";},400);//délai de 400 et 800 ms pour les éteindre une par une
			setTimeout(function(){afficheur.getElementById('af_peno3D').className="peno";},800);
			
			CP.getElementById('peno_1_droite').checked = false;//décochage des pénalités sur le panneau de contrôle
			CP.getElementById('peno_2_droite').checked = false;
			CP.getElementById('peno_3_droite').checked = false;
			
			setTimeout(function(){scoreIncrG();},1400);//ajout d'un point à l'autre équipe après 1.4s
			
			
			flashSave();
			}
			