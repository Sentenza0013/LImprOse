
		function majInfosMatch() {
    
	//D'abord on attribue aux variables les valeurs qu'on récupère dans les champs du panneau de contrôle :
	
	equipegauche.nom = CP.getElementById('nom_equipe_G').value;
	equipedroite.nom = CP.getElementById('nom_equipe_D').value;
	equipegauche.couleurfond = CP.getElementById('couleur_fond_equipe_gauche').value;
	equipedroite.couleurfond = CP.getElementById('couleur_fond_equipe_droite').value;
	equipegauche.couleurnom = CP.getElementById('couleur_texte_equipe_gauche').value;
	equipedroite.couleurnom = CP.getElementById('couleur_texte_equipe_droite').value;
	equipegauche.nomSize = CP.getElementById('taille_texte_equipe_gauche').value;
	equipedroite.nomSize = CP.getElementById('taille_texte_equipe_droite').value;
	equipegauche.couleurcarton = CP.getElementById('couleur_carton_equipe_gauche').value;
	equipedroite.couleurcarton = CP.getElementById('couleur_carton_equipe_droite').value;
	equipegauche.couleurmaillot = CP.getElementById('couleur_maillot_equipe_gauche').value;
	equipedroite.couleurmaillot = CP.getElementById('couleur_maillot_equipe_droite').value;
	
	equipegauche.logoSize = CP.getElementById('taille_image_logo_equipe_gauche').value;
	equipedroite.logoSize = CP.getElementById('taille_image_logo_equipe_droite').value;
	equipegauche.logoBG = CP.getElementById('couleur_fond_image_logo_equipe_gauche').value;
	equipedroite.logoBG = CP.getElementById('couleur_fond_image_logo_equipe_droite').value;
	equipegauche.txtPerso = CP.getElementById('texte_ajouté_equipe_gauche').value;
	equipedroite.txtPerso = CP.getElementById('texte_ajouté_equipe_droite').value;
	equipegauche.txtPersoCoul = CP.getElementById('couleur_texte_ajouté_equipe_gauche').value;
	equipedroite.txtPersoCoul = CP.getElementById('couleur_texte_ajouté_equipe_droite').value;
	equipegauche.txtPersoSize = CP.getElementById('taille_texte_ajouté_equipe_gauche').value;
	equipedroite.txtPersoSize = CP.getElementById('taille_texte_ajouté_equipe_droite').value;
	if (CP.getElementById('affichCartons').checked==true){styleCartons="";}else{styleCartons="display:none";}
	if (CP.getElementById('affichMaillots').checked==true){styleMaillots="";}else{styleMaillots="display:none";}
		
	
	
	AffInfosMatch();
			
	}
	


	
function AffInfosMatch() {
	
	
	//rafraichissements dans l'afficheur ) à partir des variables en cours :
	
	
	afficheur.getElementById('af_main_carton_G').style = styleCartons;
	afficheur.getElementById('af_main_carton_D').style = styleCartons;
	afficheur.getElementById('af_maillot_gauche').style = styleMaillots;
	afficheur.getElementById('af_maillot_droite').style = styleMaillots;
	afficheur.getElementById('af_nom_equipe_de_gauche').innerHTML = equipegauche.nom;
	afficheur.getElementById('af_nom_equipe_de_droite').innerHTML = equipedroite.nom;
	afficheur.getElementById('af_fond_equipe_de_gauche').style.background = "linear-gradient(to bottom, rgba(255,255,255,1) 0%, "+equipegauche.couleurfond+" 10%, "+equipegauche.couleurfond+" 90%, rgb(93, 110, 117) 100%)";
	afficheur.getElementById('af_fond_equipe_de_droite').style.background = "linear-gradient(to bottom, rgba(255,255,255,1) 0%, "+equipedroite.couleurfond+" 10%, "+equipedroite.couleurfond+" 90%, rgb(93, 110, 117) 100%)";
	afficheur.getElementById('af_nom_equipe_de_gauche').style.color = equipegauche.couleurnom;
	afficheur.getElementById('af_nom_equipe_de_droite').style.color = equipedroite.couleurnom;
	afficheur.getElementById('af_nom_equipe_de_gauche').style.fontSize = equipegauche.nomSize+'vmin';
	afficheur.getElementById('af_nom_equipe_de_droite').style.fontSize = equipedroite.nomSize+'vmin';
	afficheur.getElementById('af_carton_G').style.backgroundColor = equipegauche.couleurcarton;
	afficheur.getElementById('af_carton_D').style.backgroundColor = equipedroite.couleurcarton;
	afficheur.getElementById('af_maillot_gauche').style.backgroundColor = equipegauche.couleurmaillot;
	afficheur.getElementById('af_maillot_droite').style.backgroundColor = equipedroite.couleurmaillot;
	afficheur.getElementById("af_logo_gauche").src = equipegauche.logoUrl;
	afficheur.getElementById("af_logo_droite").src = equipedroite.logoUrl;
	afficheur.getElementById('af_logo_gauche').style.height = equipegauche.logoSize+'vmin';
	afficheur.getElementById('af_logo_droite').style.height = equipedroite.logoSize+'vmin';
	afficheur.getElementById('af_logo_gauche').style.backgroundColor = equipegauche.logoBG;
	afficheur.getElementById('af_logo_droite').style.backgroundColor = equipedroite.logoBG;
	afficheur.getElementById('af_text_persoG').innerHTML = equipegauche.txtPerso;
	afficheur.getElementById('af_text_persoD').innerHTML = equipedroite.txtPerso;
	afficheur.getElementById('af_text_persoG').style.color = equipegauche.txtPersoCoul;
	afficheur.getElementById('af_text_persoD').style.color = equipedroite.txtPersoCoul;
	afficheur.getElementById('af_text_persoG').style.fontSize = equipegauche.txtPersoSize+'vmin';
	afficheur.getElementById('af_text_persoD').style.fontSize = equipedroite.txtPersoSize+'vmin';
	
	journalMatchPrepa(); // on met à jour les infos nécessaires à l'écriture du journal de match (titre du journal, etc.)
	
	flashSave();
	
	}
	
function AffCPInfosMatch() {//met à jour le panneau de contrôle et ses champs à partir des variables ayant cours (utilisé par ex. après chargement des réglages mémorisés)
		
			CP.getElementById('nom_equipe_G').value=equipegauche.nom;	//équipe de gauche
			CP.getElementById('couleur_fond_equipe_gauche').value=equipegauche.couleurfond;	
			CP.getElementById('couleur_texte_equipe_gauche').value=equipegauche.couleurnom;
			CP.getElementById('taille_texte_equipe_gauche').value=equipegauche.nomSize;	
			CP.getElementById('couleur_carton_equipe_gauche').value=equipegauche.couleurcarton;
			CP.getElementById('couleur_maillot_equipe_gauche').value=equipegauche.couleurmaillot;
			CP.getElementById('taille_image_logo_equipe_gauche').value=equipegauche.logoSize;
			CP.getElementById('couleur_fond_image_logo_equipe_gauche').value=equipegauche.logoBG;
			CP.getElementById('texte_ajouté_equipe_gauche').value=equipegauche.txtPerso;
			CP.getElementById('couleur_texte_ajouté_equipe_gauche').value=equipegauche.txtPersoCoul;
			CP.getElementById('taille_texte_ajouté_equipe_gauche').value=equipegauche.txtPersoSize;
			CP.getElementById('CPlogoEquipeG_RM').src=equipegauche.logoUrl;	
						
			CP.getElementById('nom_equipe_D').value=equipedroite.nom;	//équipe de droite
			CP.getElementById('couleur_fond_equipe_droite').value=equipedroite.couleurfond;	
			CP.getElementById('couleur_texte_equipe_droite').value=equipedroite.couleurnom;
			CP.getElementById('taille_texte_equipe_droite').value=equipedroite.nomSize;				
			CP.getElementById('couleur_carton_equipe_droite').value=equipedroite.couleurcarton;
			CP.getElementById('couleur_maillot_equipe_droite').value=equipedroite.couleurmaillot;
			CP.getElementById('taille_image_logo_equipe_droite').value=equipedroite.logoSize;
			CP.getElementById('couleur_fond_image_logo_equipe_droite').value=equipedroite.logoBG;
			CP.getElementById('texte_ajouté_equipe_droite').value=equipedroite.txtPerso;
			CP.getElementById('couleur_texte_ajouté_equipe_droite').value=equipedroite.txtPersoCoul;
			CP.getElementById('taille_texte_ajouté_equipe_droite').value=equipedroite.txtPersoSize;
			CP.getElementById('CPlogoEquipeD_RM').src=equipedroite.logoUrl;
	
			if (styleCartons==""){CP.getElementById('affichCartons').checked=true;}else{CP.getElementById('affichCartons').checked=false};
			if (styleMaillots==""){CP.getElementById('affichMaillots').checked=true;}else{CP.getElementById('affichMaillots').checked=false};
			
			CP.getElementById('nom_equipe_gauche').innerHTML = equipegauche.nom;//onglet "contrôle du match"
			CP.getElementById('nom_equipe_droite').innerHTML = equipedroite.nom;
			CP.getElementById('CPcartonG').style.color=equipegauche.couleurcarton;
			CP.getElementById('CPcartonD').style.color=equipedroite.couleurcarton;
			CP.getElementById('CPcouleurFondEquipeG').style.borderColor=equipegauche.couleurfond;
			CP.getElementById('CPcouleurFondEquipeD').style.borderColor=equipedroite.couleurfond;
			CP.getElementById('CPlogoEquipeG').src=equipegauche.logoUrl;
			CP.getElementById('CPlogoEquipeD').src=equipedroite.logoUrl;		
	
	flashSave();
	}










	function inversEquipes() {//intervertir équipe de gauche et de droite
		
		var nouvelleequipedroite = equipegauche;//création de 2 variables temporaires contenant les infos à transférer
		var nouvelleequipegauche = equipedroite;
		equipegauche = nouvelleequipegauche;//mise à jour des équipes depuis variables tampon
		equipedroite = nouvelleequipedroite;
		
		CP.getElementById('af_scoreDroiteCP').innerHTML = equipedroite.score;//mise à jour du score dans l'afficheur et le panneau de contrôle
		afficheur.getElementById('af_score_D').innerHTML = equipedroite.score;
		CP.getElementById('af_scoreGaucheCP').innerHTML = equipegauche.score;
		afficheur.getElementById('af_score_G').innerHTML = equipegauche.score;
		
		var penogauche1=CP.getElementById('peno_1_gauche').checked;//créations de variables temporaires contenant la valeur des pénalités
		var penogauche2=CP.getElementById('peno_2_gauche').checked;
		var penogauche3=CP.getElementById('peno_3_gauche').checked;
		var penodroite1=CP.getElementById('peno_1_droite').checked;
		var penodroite2=CP.getElementById('peno_2_droite').checked;
		var penodroite3=CP.getElementById('peno_3_droite').checked;
		
		CP.getElementById('peno_1_droite').checked=penogauche1;//application de l'inversion à partir des valeurs temporaires
		CP.getElementById('peno_2_droite').checked=penogauche2;
		CP.getElementById('peno_3_droite').checked=penogauche3;
		CP.getElementById('peno_1_gauche').checked=penodroite1;
		CP.getElementById('peno_2_gauche').checked=penodroite2;
		CP.getElementById('peno_3_gauche').checked=penodroite3;
		
		penoG("nojournal");//application des effets des pénalités inversées sans inscription dans le journal de match (il n'y a pas de nouvelle(s) pénalité(s), elle(s) change(nt) juste de côté)
		penoD("nojournal");
		
		AffCPInfosMatch();//mise à jour du panneau de contrôle
		AffInfosMatch();//mise à jour du panneau de l'écran public
		
		flashSave();
		
	}	
	
	