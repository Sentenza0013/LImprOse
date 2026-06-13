// -------------- RÉGLAGES DESIGN --------------------------------------------------------------------------			




//--------------- DESIGN EN COURS --> AFFICHEUR
	
	function majDesign() {//met à jour le design en fonction des options choisies dans le panneau de controle utilisateur, rubrique Design général
	
		majParamDesign();//mise à jour des variables design à partir des champs du CP

	CP.getElementById('optionsVideo').style.display="none";//on masque toutes les sous-options non-pertinentes (concernant le fond notamment); elles seront réaffichées en fonction du type de fond choisi
	CP.getElementById('optionsHtml').style.display="none";
	CP.getElementById('optionsImg').style.display="none";
	CP.getElementById('optionsFondCouleur').style.display="none";
	
	afficheur.getElementById('af_BG').innerHTML = '';//on masque la div du fond
	
	afficheur.getElementById('af_timer_periode').style.color=design.couleurInfos;//on met à jour la couleur d'écriture des infos principales
	afficheur.getElementById('mix-comp').style.color=design.couleurInfos;
	afficheur.getElementById('duree-imp').style.color=design.couleurInfos;
	afficheur.getElementById('categ').style.color=design.couleurInfos;
	afficheur.getElementById('txtwait').style.color=design.couleurInfos;
	afficheur.getElementById('vs').style.color=design.couleurInfos;
	afficheur.getElementById('caucusBar').style.backgroundColor=design.couleurInfos;
		
	afficheur.getElementById('scoreG').className='scoreG'+design.styleScores;//applique la classe "ScoreG" (oblique) ou ScoreGvertical selon réglage (en concaténant scoreG avec le contenu de la variable "styleScore" qui est soit rien, soit "vertical"
	afficheur.getElementById('scoreD').className='scoreD'+design.styleScores;//idem
	
	afficheur.getElementById('vs').style.visibility=design.VSvisible;//"visible" ou "hidden" selon choix utilisateur d'afficher ou non le "VS" en haut de l'écran public
	afficheur.getElementById('caucus').style.display=design.caucusVisible;//"block" ou "none" selon choix utilisateur d'afficher ou non la barre de caucus
	
	afficheur.body.style='overflow: hidden !important; font-family: '+design.mainFont+';';//mise à jour des polices
	afficheur.getElementById('timer-impro-on-off').style.display=design.timerImproOnOff;//mise à jour de l'affichage ou non du timer d'impro
	afficheur.getElementById('timer-periode-on-off').style.display=design.timerPeriodeOnOff;//mise à jour de l'affichage ou non du timer de période
	CP.getElementById('cp-time-per').style.display = design.timerPeriodeOnOff;//la div qui permet de contrôler le compte-à-rebours de période dans l'onglet "contrôle du match" suit la même logique
	
	afficheur.getElementById("ref_css").setAttribute("href", design.cssEnCours+'?v'+design.versionCss);//choix de la "Présentation" (style css)
		
	if (design.typeFond=="video"){//si le selecteur est sur video...
		afficheur.getElementById('af_BG').style.filter ="";//on supprime tout filtre sur la div BG (background) au cas où par exemple la luminosité aurait été baissée lors du réglage de la luinosité de l'image fixe
		CP.getElementById('optionsVideo').style.display= "block";
		afficheur.getElementById('af_BG').innerHTML = '<video autoplay loop id="bgvid" class="fondvideo" style="filter: brightness('+design.luminositeVideo+'%);"><source src="visuels/'+design.videoFond+'" type="video/mp4"></video>';}//mise à jour du contenu de la balise video en fonction de la video choisie dans le selecteur
		CP.getElementById('lumin_video').title=design.luminositeVideo+"%";// mise à jour de l'infobulle qui donne le pourcentage sur la jauge de réglage de luminosité vidéo
	
	if (design.typeFond=="statique"){//si le selecteur est sur statique...
		CP.getElementById('optionsFondCouleur').style.display= "block";//affichage des sous-options
		afficheur.getElementById('af_BG').style = "";//puis application des modifs...
		afficheur.getElementById('af_BG').style.backgroundColor = design.couleurFondEcran;
		}
		
	if (design.typeFond=="html"){//si le selecteur est sur html...
		CP.getElementById('optionsHtml').style.display= "block";//affichage des sous-options
		afficheur.getElementById('af_BG').style.backgroundColor = "";//puis application des modifs...
		afficheur.getElementById('af_BG').style = design.htmlFondPerso;
		}
		
	if (design.typeFond=="img"){//si le selecteur est sur image...
		CP.getElementById('optionsImg').style.display= "block";//affichage des sous-options
		afficheur.getElementById('af_BG').style.backgroundImage = "url('"+design.imgFond+"')";//puis application des modifs...
		afficheur.getElementById('af_BG').style.backgroundRepeat = "no-repeat";
		afficheur.getElementById('af_BG').style.backgroundSize = "cover";
		afficheur.getElementById('af_BG').style.backgroundPosition = "center";
		afficheur.getElementById('af_BG').style.filter ="brightness("+design.luminositeImageFond+")";// luminosité de l'image de fond
		CP.getElementById('lumin_image_fond').title=design.luminositeImageFond;//maj infobulle du curseur de luminosité de l'image
		}
	
if (design.reverseProj=="back"){afficheur.getElementById('html').style.transform="rotateY(180deg)";}else{afficheur.getElementById('html').style.transform="";}//retournement de l'image si l'utilisateur le souhaite
	
	if (design.affichIntitules=="Oui") {//si l'utilisateur décide d'afficher les libellés de l'impro
		titMixComp="Improvisation "; //on remplit la variable qui sera concaténée avec la catégorie (ce qui permettre d'afficher par ex. "Improvisation Mixte" plutôt que "Mixte" tout court)
		titDuree="Durée : ";// même principe
		titCat="Catégorie : ";// même principe
	} else {
		titMixComp="";// sinon rien ne précèdera "Mixte" ou "Comparée"
		titDuree="";// même principe
		titCat="";}// même principe
	
	afficheur.getElementById('logowait').src=design.waitImgSrc;//mise à jour de l'image de l'écran d'attente inter-impro
	afficheur.getElementById('logowait').style='width: '+design.waitImgLarg+'vmin;';//largeur de cette image
	CP.getElementById('taille_logo_wait').title=design.waitImgLarg;//mise à jour de l'infobulle correspondant à la jauge de largeur de l'image
	afficheur.getElementById('logowait').className=design.waitImgRotation;//classe correspondant à la rotation ou non...
	majTxtWait();//mise à jour du texte d'attente inter-impro
	
	zooms();//on applique les options de zoom
	
	flashSave();
	
	}


//--------------- CP --> DESIGN EN COURS

	function majParamDesign(){//mise à jour des variables design à partir des champs du CP
		
		design.reverseProj = CP.getElementById('reverse_proj').value;
		design.timerImproOnOff = CP.getElementById('affichTimerImpro').value;
		design.timerPeriodeOnOff = CP.getElementById('affichTimerPeriode').value;
		design.cssEnCours = CP.getElementById('switcher_Css').value;
		design.mainFont = CP.getElementById('font').value;
		design.typeFond = CP.getElementById('fond_ecran').value;
		design.couleurFondEcran = CP.getElementById('couleur_fond_ecran').value;
		design.couleurInfos = CP.getElementById('couleur_infos').value;
		design.htmlFondPerso = CP.getElementById('html_fond_perso').value;
		design.luminositeVideo = CP.getElementById('lumin_video').value;
		design.videoFond = CP.getElementById('fond_video').value;
		design.typeFondImg = CP.getElementById('type_fond_image').value;
		design.luminositeImageFond = CP.getElementById('lumin_image_fond').value;
		design.affichIntitules = CP.getElementById('affich_intitules').value;
		design.styleScores = CP.getElementById('style_Scores').value;
		design.VSvisible = CP.getElementById('VS_visible').value;
		design.caucusVisible = CP.getElementById('caucus_visible').value;
		design.txtAccueil = CP.getElementById('texte_accueil').value;
		design.waitImgLarg = CP.getElementById('taille_logo_wait').value;
		design.waitImgRotation = CP.getElementById('logo_wait_rotation').value;
		design.waitTxt = CP.getElementById('texte_wait').value;
		design.cptchaussonsActif = CP.getElementById('compteur_chaussons_actif').value;
		design.cptchaussonsTxtAvant = CP.getElementById('texte_compteur_avant').value;
		design.cptchaussonsTxtApres = CP.getElementById('texte_compteur_apres').value;
		design.zoom=CP.getElementById('zoom').value;
		design.echelle=CP.getElementById('echelle').value;
		design.margesup=CP.getElementById('margesup').value;
		
		if (CP.getElementById('affichTimerPeriode').selectedIndex==1){design.timerPeriodePartiel=true;}else{design.timerPeriodePartiel=false;}//détermine si le compte à rebours de période doit être affiché pendant les impros
		
		majCPchaussons();//détermine si, suite aux nouveaux réglages, on affiche ou masque les div du panneau de controle liées à la gestion du compteur de chausson
		
		flashSave();
		
		}
	
//--------------- DESIGN EN COURS --> CP
	
	
function aplikDesign() {//fonction qui met à jour le panneau de contrôle fonction de l'état en cours de l'objet 'design'
	
		CP.getElementById('switcher_Css').value = design.cssEnCours;// on met à jour les champs et autres inputs du panneau de contrôle avec les valeurs chargées
		CP.getElementById('reverse_proj').value = design.reverseProj;
		CP.getElementById('affichTimerImpro').value = design.timerImproOnOff;
		CP.getElementById('affichTimerPeriode').value = design.timerPeriodeOnOff;
		CP.getElementById('cp-time-per').style.display = design.timerPeriodeOnOff;//en fonction du choix de l'utilisateur on affiche ou masque aussi la div qui permet de contrôler le compte-à-rebours de période dans l'onglet "contrôle du match" 
		CP.getElementById('fond_ecran').value = design.typeFond;
		CP.getElementById('font').value = design.mainFont;
		CP.getElementById('fond_video').value = design.videoFond;
		CP.getElementById('couleur_infos').value = design.couleurInfos;
		CP.getElementById('couleur_fond_ecran').value = design.couleurFondEcran;
		CP.getElementById('html_fond_perso').value = design.htmlFondPerso;
		CP.getElementById('lumin_video').value = design.luminositeVideo;
		CP.getElementById('lumin_video').title=design.luminositeVideo+"%"; //même les infobulles ;-) !
		CP.getElementById('type_fond_image').value=design.typeFondImg;
		CP.getElementById('lumin_image_fond').value=design.luminositeImageFond;
		CP.getElementById('lumin_image_fond').title=design.luminositeImageFond; //même les infobulles ;-) !
		CP.getElementById('affich_intitules').value=design.affichIntitules;
		CP.getElementById('style_Scores').value=design.styleScores;
		CP.getElementById('VS_visible').value=design.VSvisible;
		CP.getElementById('caucus_visible').value=design.caucusVisible;
		CP.getElementById('texte_accueil').value=design.txtAccueil;
		CP.getElementById('CPlogoWait').src=design.waitImgSrc;
		CP.getElementById('taille_logo_wait').value=design.waitImgLarg;
		CP.getElementById('logo_wait_rotation').value=design.waitImgRotation;
		CP.getElementById('texte_wait').value=design.waitTxt;
		CP.getElementById('compteur_chaussons_actif').value=design.cptchaussonsActif;
		CP.getElementById('texte_compteur_avant').value=design.cptchaussonsTxtAvant;
		CP.getElementById('texte_compteur_apres').value=design.cptchaussonsTxtApres;
		CP.getElementById('taille_apercu').value=design.ratioApercu;
		CP.getElementById('taille_apercu').title=(design.ratioApercu*100)+'%';//même les infobulles ;-) !
		CP.getElementById('zoom').value=design.zoom;
		CP.getElementById('echelle').value=design.echelle;
		CP.getElementById('margesup').value=design.margesup;	

		if (design.timerPeriodePartiel==true){CP.getElementById('affichTimerPeriode').selectedIndex=1;}
		
		mode();//fonction qui permet la prise en compte du mode choisi (simple/complexe)
		modeMR();//fonction qui permet la prise en compte du mode choisi (match/réglage)
				
		flashSave();
		
		}	



//--------------- SOUS-FONCTIONS DESIGN :


function def_img_fond() {//définit l'image de fond de l'afficheur
	
		design.typeFondImg=CP.getElementById('type_fond_image').value;//on renseigne la variable typeFondImg à partir du choix de l'utilisateur dans le CP
		
		if (design.typeFondImg!="fondImgPerso"){design.imgFond=design.typeFondImg;}//s'il a choisi autre chose que l'image personnalisée
		else{
		
				var imgbkd = CP.getElementById("imagefond").files;
				if (imgbkd.length > 0){
					
						
					var fileToLoad = imgbkd[0];
 
					var fileReader = new FileReader();
 
							fileReader.onload = function(fileLoadedEvent)
							{
               
							design.imgFond = fileLoadedEvent.target.result;//on met le base64 du fichier choisi dans la variable imgFond
                		 	afficheur.getElementById('af_BG').style.backgroundImage = "url('"+design.imgFond+"')";
							
							};
 
        fileReader.readAsDataURL(fileToLoad);
		
				}
		}
		
		//dans tous les cas :		
				
		afficheur.getElementById('af_BG').style.backgroundImage = "url('"+design.imgFond+"')";
		afficheur.getElementById('af_BG').style.backgroundRepeat = "no-repeat";
		afficheur.getElementById('af_BG').style.backgroundSize = "cover";
		
	flashSave();	
	
	}
	
	
function killImgBckgd() {//enlève l'image de fond
		CP.getElementById('imagefond').value='';
		design.imgFond='';
		afficheur.getElementById('af_BG').style.backgroundImage = "";
	
	flashSave();
	
	}
	

	
function genDeg(){
		var degrad=CP.getElementById('type_deg').value+CP.getElementById('coul_deg_1').value+', '+CP.getElementById('coul_deg_2').value+')';
		CP.getElementById('html_fond_perso').value='background: '+degrad+';';
		CP.getElementById('aper_deg').style.background=degrad;
		
	flashSave();
		
		}

		
function majTxtWait() {//Mise à jour du texte d'attente (action qui se déclenche lors de la mise à jour du champ). Permet à l'opérateur de mettre à jour ce contenu pendant une impro en prévision du prochain affichage, sans déclencher la fonction majDesign qui risque de faire scintiller l'écran
		
		var TxtaAfficher;
		
		design.waitTxt=CP.getElementById('texte_wait').value;//on met à jour la valeur de design.waitTxt en fonction du texte voulu par l'utilisateur
		
		design.cptchaussons=CP.getElementById('nbchaussons').value;//on met à jour la valeur du compteur de chaussons
		
		if (design.waitTxt=="") {var sautdeligneeventuel="";}else{var sautdeligneeventuel="<br>";}//il sera inutile d'ajouter un retour à la ligne avant le compteur de chausson si aucun texte personnalisé ne précède
		
		design.cptchaussonsActif=CP.getElementById('compteur_chaussons_actif').value;//on détermine si le compteur de chaussons est actif
		
		design.cptchaussonsTxtAvant=CP.getElementById('texte_compteur_avant').value;//on met à jour le texte qui précède le nombre de lancers
		design.cptchaussonsTxtApres=CP.getElementById('texte_compteur_apres').value;//on met à jour le texte qui précède le nombre de lancers
		
		if (design.cptchaussonsActif=="oui") {//si le compteur de chaussons est actif on ajoutera les valeurs le concernant à la suite du texte défini par l'utilisateur.
		TxtaAfficher=design.waitTxt+sautdeligneeventuel+design.cptchaussonsTxtAvant+'<span class="nbchaussons">'+design.cptchaussons+'</span>'+design.cptchaussonsTxtApres;//on concatène
		journalMatchImproWrite();//et on affiche à la fin du journal de match
		}
		
		else {//sinon juste le texte de l'utilisateur
		TxtaAfficher=CP.getElementById('texte_wait').value;
		}
		afficheur.getElementById('txtwait').innerHTML=TxtaAfficher;
	flashSave();
		}

function cssReload(){//modifie le n° de version du css afin de ne plus prendre en compte celui stocké dans le cache du navigateur
	
	design.versionCss=new Date().getTime();//on met à jour la variable design.versionCss en lui attribuant la date et l'heure en cours
	afficheur.getElementById("ref_css").setAttribute("href", design.cssEnCours+'?v'+design.versionCss);//on applique
	
}		

function zooms(){
	
	design.zoom=CP.getElementById('zoom').value;//on met à jour les variables à partir des réglages de l'utilisateur
	design.echelle=CP.getElementById('echelle').value;
	design.margesup=CP.getElementById('margesup').value;
	
	if (design.zoom==1){afficheur.getElementById('ecranPublic').style.transform='';afficheur.getElementById('diapo').style.transform='';}//si le zoom est de 1 (pas de zoom) --> aucune transformation
	else {afficheur.getElementById('ecranPublic').style.transform='scale('+design.zoom+')';afficheur.getElementById('diapo').style.transform='scale('+design.zoom+')';}//sinon mise à l'échelle désirée
	
	if (design.echelle==1){afficheur.getElementById('conteneur').style.transformOrigin='';afficheur.getElementById('conteneur').style.transform='';}//même principe
	else {afficheur.getElementById('conteneur').style.transformOrigin='top';afficheur.getElementById('conteneur').style.transform='scale('+design.echelle+')';;
	}
	
	if (design.margesup==0){afficheur.getElementById('header').style.marginTop='';afficheur.getElementById('diapo').style.marginTop='';}//même principe
	else {afficheur.getElementById('header').style.marginTop=design.margesup+'vmin';afficheur.getElementById('diapo').style.marginTop=design.margesup+'vmin';}
	
	if (design.margesup==0 && echelle==1) {afficheur.getElementById('degradeSup').style='';}else{afficheur.getElementById('degradeSup').style.background='none';}//si l'écran de match n'est pas collé aux bords, suppression de l'effet dégradé du bord supérieur, sinon ça fait bizarre

	CP.getElementById('centrageVertical').innerHTML=design.margesup;
	}

function resetZooms(){
	
	design.zoom=1;
	design.echelle=1;
	design.margesup=0;
	
	aplikDesign();
	majDesign();
	
	}


		
//--------------- SOUS-FONCTIONS DESIGN//--------------------------------Image de l'écran d'attente-----------------------		



function loadLogoWait()//choix de l'image
{
    var logowait = CP.getElementById("logo_wait").files;
    if (logowait.length > 0)
    {
        var fileToLoad = logowait[0];
 
        var fileReader = new FileReader();
 
        fileReader.onload = function(fileLoadedEvent)
        {
                
            design.waitImgSrc = fileLoadedEvent.target.result;
         
            afficheur.getElementById('logowait').src = design.waitImgSrc;
			CP.getElementById('CPlogoWait').src = design.waitImgSrc;
			
         
        };
 
        fileReader.readAsDataURL(fileToLoad);
    }

	flashSave();
	}

function killLogoWait(){//retire l'image (rien à la place)
		CP.getElementById('logo_wait').value='';
		design.waitImgSrc = '';
		afficheur.getElementById('logowait').src = design.waitImgSrc;
		CP.getElementById('CPlogoWait').src = design.waitImgSrc;
		flashSave();
		
		}	
		
function DefautLogoWait(){//met l'image par défaut
		CP.getElementById('logo_wait').value='';
		design.waitImgSrc = 'visuels/patoche.png';
		afficheur.getElementById('logowait').src = design.waitImgSrc;
		CP.getElementById('CPlogoWait').src = design.waitImgSrc;
		flashSave();	
	
}

function LogoChausson(){//met l'image du jet de chaussons
		CP.getElementById('logo_wait_rotation').value='imgWaitNoRotation';
		CP.getElementById('logo_wait').value='';
		design.waitImgSrc = 'visuels/chausson.png';
		afficheur.getElementById('logowait').src = design.waitImgSrc;
		CP.getElementById('CPlogoWait').src = design.waitImgSrc;
		majDesign();
		flashSave();
	
}

function majCPchaussons(){//fait apparaître ou disparaître dans le panneau de contrôle les div correspondant aux fonctionnalités liées au compteur de chaussons
	
	if (design.cptchaussonsActif=="oui") {
	CP.getElementById('chaussonMatch').style.display="inline";
	CP.getElementById('chaussonDesign').style.display="inline";	
	}
	else
	{
	CP.getElementById('chaussonMatch').style.display="none";
	CP.getElementById('chaussonDesign').style.display="none";		
	}		

}


//--------------------------------Préconfiguration design-----------------

function Design(choix){//choix d'une préconfiguration design
	
		design.reverseProj = "front";//tous les paramètres non concernés par les préconfigurations sont mis à leur valeur par défaut
		design.timerImproOnOff = "block";
		design.timerPeriodePartiel=true;
		design.affichIntitules="Oui";
		design.txtAccueil = "Bienvenue dans ce match !<br>Préparez vos cartons...<br>et vos chaussons !";
		design.waitImgRotation = "imgWaitRotation";
		design.waitImgLarg = "27";
		design.waitTxt = "Place au vote !";
		design.cptchaussonsActif = "non";
		design.cptchaussonsTxtAvant = "Compteur : ";
		design.cptchaussonsTxtAprès = "chaussons lancés.";
		design.waitImgSrc = "visuels/patoche.png";
		design.zoom = 1;
		design.echelle = 1;
		design.margesup = 0;
			
	
	if (choix=="standard") {defautDesign();}
			
	if (choix=="theatre"){
		design.typeFond = "img";
		design.videoFond = "";
		design.mainFont = "georgiabelle";
		design.couleurFondEcran = "#064f4d";
		design.couleurInfos = "#ffd079";
		design.htmlFondPerso = "";
		design.luminositeVideo = 40;
		design.luminositeImageFond = 0.6;
		design.cssEnCours = "_dynamique.css";
		design.typeFondImg="visuels/fond08.jpg";
		design.imgFond="visuels/fond08.jpg";
		design.styleScores="";
		design.VSvisible="visible";
		}
		
	if (choix=="abyss"){
		design.typeFond = "video";
		design.videoFond = "003.mp4";
		design.mainFont = "alte";
		design.couleurFondEcran = "";
		design.couleurInfos = "#24b59f";
		design.htmlFondPerso = "";
		design.luminositeVideo = 31;
		design.luminositeImageFond = 1;
		design.cssEnCours = "_sobre.css";
		design.typeFondImg="";
		design.imgFond="";
		design.styleScores="";
		design.VSvisible="hidden";
		}
		
	if (choix=="metalique"){
		design.typeFond = "img";
		design.videoFond = "";
		design.mainFont = "fjalla";
		design.couleurFondEcran = "";
		design.couleurInfos = "#d87c7c";
		design.htmlFondPerso = "";
		design.luminositeVideo = 40;
		design.luminositeImageFond = 0.7;
		design.cssEnCours = "_dynamique.css";
		design.typeFondImg="visuels/fond01.jpg";
		design.imgFond="visuels/fond01.jpg";
		design.styleScores="vertical";
		design.VSvisible="hidden";
		}

	if (choix=="camping"){
		design.typeFond = "html";
		design.videoFond = "";
		design.mainFont = "blueh";
		design.couleurFondEcran = "";
		design.couleurInfos = "#cccc00";
		design.htmlFondPerso = "background: linear-gradient(to bottom, #33552f, #1c301b);";
		design.luminositeVideo = 40;
		design.luminositeImageFond = 1;
		design.cssEnCours = "_dynamique.css";
		design.typeFondImg="";
		design.imgFond="";
		design.styleScores="";
		design.VSvisible="visible";
		}	

	if (choix=="inferno"){
		design.typeFond = "video";
		design.videoFond = "001.mp4";
		design.mainFont = "raleway";
		design.couleurFondEcran = "";
		design.couleurInfos = "#ff9428";
		design.htmlFondPerso = "";
		design.luminositeVideo = 52;
		design.luminositeImageFond = 1;
		design.cssEnCours = "_sobre.css";
		design.typeFondImg="";
		design.imgFond="";
		design.styleScores="vertical";
		design.VSvisible="visible";
		}			
		
	if (choix=="sport"){
		design.typeFond = "video";
		design.videoFond = "00.mp4";
		design.mainFont = "Aero";
		design.couleurFondEcran = "";
		design.couleurInfos = "#eedd11";
		design.htmlFondPerso = "";
		design.luminositeVideo = 32;
		design.luminositeImageFond = 1;
		design.cssEnCours = "_sobre.css";
		design.typeFondImg="";
		design.imgFond="";
		design.styleScores="vertical";
		design.VSvisible="hidden";
		}	
		
		if (choix=="toxiczombie"){
		design.typeFond = "html";
		design.videoFond = "";
		design.mainFont = "fjalla";
		design.couleurFondEcran = "";
		design.couleurInfos = "#337b28";
		design.htmlFondPerso = "background: linear-gradient(to bottom, #000000, #4f0606);";
		design.luminositeVideo = 32;
		design.luminositeImageFond = 1;
		design.cssEnCours = "_dynamique.css";
		design.typeFondImg="";
		design.imgFond="";
		design.styleScores="vertical";
		design.VSvisible="visible";
		}	

		if (choix=="casino"){
		design.typeFond = "img";
		design.videoFond = "";
		design.mainFont = "crete";
		design.couleurFondEcran = "";
		design.couleurInfos = "#e6cc1a";
		design.htmlFondPerso = "";
		design.luminositeVideo = 32;
		design.luminositeImageFond = 0.6;
		design.cssEnCours = "_sobre.css";
		design.typeFondImg="visuels/fond02.jpg";
		design.imgFond="visuels/fond02.jpg";
		design.styleScores="";
		design.VSvisible="visible";
		}	
		
		aplikDesign(); //on met à jour le panneau de contrôle à partir de l'objet design en cours
		
		majDesign();//on affiche dans l'écran public !
		
		testImpro();//on balance une impro factice pour mieux juger du rendu


}
	