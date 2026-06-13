

function defautDesign(){//(re)charge les réglages par défaut qui sont bien sûr les meilleurs !
	
		design.typeFond = "video";
		design.reverseProj = "front";
		design.timerImproOnOff = "block";
		design.videoFond = "01.mp4";
		design.mainFont = "Aero";
		design.couleurFondEcran = "#064f4d";
		design.couleurInfos = "#FFA500";
		design.htmlFondPerso = "";
		design.luminositeVideo = 40;
		design.luminositeImageFond = 1;
		design.cssEnCours = "_dynamique.css";
		design.typeFondImg="fondImgPerso";
		design.imgFond="";
		design.affichIntitules="Oui";
		design.styleScores="";
		design.VSvisible="visible";
		design.caucusVisible = "block";
		design.txtAccueil = "Bienvenue dans ce match !<br>Préparez vos cartons...<br>et vos chaussons !";
		design.waitImgSrc = "visuels/patoche.png";
		design.waitImgRotation = "imgWaitRotation";
		design.waitImgLarg = "27";
		design.waitTxt = "Place au vote !";
		design.cptchaussonsActif = "non";
		design.cptchaussonsTxtAvant = "Compteur : ";
		design.cptchaussonsTxtAprès = "chaussons lancés.";
		
		
		aplikDesign(); //on met à jour le panneau de contrôle à partir de l'objet design en cours
		
		majDesign();//on affiche dans l'écran public !
	}
	
	
	function valeursDeTest() //temporaire : pour tester l'affichage d'un simple clic avec des réglages tests de matchs
	{

		equipedroite.couleurcarton = "#df0101";
		equipedroite.couleurfond = "#8a0808";
		equipedroite.couleurmaillot = "#ffffc6";
		equipedroite.couleurnom = "#ffffff";
		equipedroite.nomSize = "4";
		equipedroite.logoBG = "transparent";
		equipedroite.logoSize = "25";
		CP.getElementById('logo_equipe_gauche').value='';
		equipedroite.logoUrl = "logos/lii.png";
		equipedroite.nom = "Ligue d'Impro Intergalactique";
		equipedroite.txtPerso = "";
		equipedroite.txtPersoCoul = "#ffffff";
		equipedroite.txtPersoSize = "3";

		equipegauche.couleurcarton = "#ffffff";
		equipegauche.couleurfond = "#8258fa";
		equipegauche.couleurmaillot = "#ff8000";
		equipegauche.couleurnom = "#ffffff";
		equipegauche.nomSize = "4";
		equipegauche.logoBG = "transparent";
		equipegauche.logoSize = "25";
		CP.getElementById('logo_equipe_droite').value='';
		equipegauche.logoUrl = "logos/brin.png";
		equipegauche.nom = "Club Impro de Brin-sur-Seuges";
		equipegauche.txtPerso = "";
		equipegauche.txtPersoCoul = "#ff9f40";
		equipegauche.txtPersoSize = "3";
		
		styleCartons = "";
		styleMaillots = "display:none";
		
		AffInfosMatch(); //on rafraichit le tableau d'affichage avec la fonction appropriée...
		AffCPInfosMatch();

	}	


function testImpro(){//Crée une impro factice pour tester le rendu
	
	CP.getElementById('improtitre').value="Titre de l'improvisation en cours";
	CP.getElementById('radiomixte').checked=true;
	CP.getElementById('cat_impro').value="Western";
	CP.getElementById('durée_impro_min').value="1";
	CP.getElementById('durée_impro_sec').value="30";
	improrefresh();//affichage de l'impro factice, puis réinitialisation
	CP.getElementById('improtitre').value="";
	CP.getElementById('radiomixte').checked=false;
	CP.getElementById('cat_impro').value="";
	CP.getElementById('durée_impro_min').value="";
	CP.getElementById('durée_impro_sec').value="";
	CP.getElementById('boutonImproGo').disabled = true; 
}
