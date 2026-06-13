//----------------------------------- DÉCLARATION DES VARIABLES GLOBALES ET DES OBJETS ----------------------------
	
	
	var ImprojVerNum="1.3.1";//numero de version
	
	//var afficheur = window.opener.document; //permet de taper "afficheur" pour désigner l'écran public dans le code au lieu de mettre à chaque fois "window.opener.document"...
	//var CP = document; // Même chose pour le panneau de contrôle (CP comme "Control Pannel")
	
		
	var aideOnOff="on";
	var timerDiapo;
	
	var journalMatch="";
	var journalMatchImproPrec="";
	
	var styleCartons;
	var styleMaillots;
	
	var equipegauche = { //création de l'objet équipe de gauche et des paramètres qui lui sont associés...
		
		nom: "",
		couleurfond: "",
		couleurnom: "",
		nomSize: "",
		couleurcarton: "",
		couleurmaillot: "",
		logoUrl: "",
		logoSize: "",
		logoBG: "",
		txtPerso: "",
		txtPersoCoul: "",
		txtPersoSize: "",
		score: 0,
		
	};
	
	var equipedroite = { //idem...
		
		nom: "",
		couleurfond: "",
		couleurnom: "",
		nomSize: "",
		couleurcarton: "",
		couleurmaillot: "",
		logoUrl: "",
		logoSize: "",
		logoBG: "",
		txtPerso: "",
		txtPersoCoul: "",
		txtPersoSize: "",
		score: 0,
		
	};
	
	
	var design = {//création de l'objet design qui stocke le paramétrage du design par l'utilisateur (+ ici définition valeurs par défaut)
		timerImproOnOff : "block",
		timerPeriodeOnOff: "block",
		timerPeriodePartiel: true,
		reverseProj : "front",
		typeFond : "video",
		videoFond : "01.mp4",
		mainFont : "Aero",
		couleurFondEcran : "#064f4d",
		couleurInfos : "#FFA500",
		htmlFondPerso : "",
		luminositeVideo : 40,
		luminositeImageFond : 1,
		cssEnCours : "dynamique.css",
		imgFond : "",
		typeFondImg : "",
		affichIntitules : "Oui",
		styleScores : "",
		VSvisible : "inline",
		txtAccueil : "",
		waitImgSrc : "visuels/patoche.png",
		waitImgRotation : "imgWaitRotation",
		waitImgLarg : "27",
		waitTxt : "Place au vote !",
		cptchaussonsActif : "non",
		cptchaussonsTxtAvant : "Compteur : ",
		cptchaussonsTxtAprès : "chaussons lancés.",
		cptchaussons: 0,
		ratioApercu: 0.3,
		versionCss: ImprojVerNum,//par defaut le n° de version du css correspond à celui du logiciel, sauf si l'utilisateur l'a actualisé
		echelle: 1,
		margesup: 0,
		zoom: 1,
		simple: false,
		match: false,
		
	};

	var num_periode;
	var timer_periode = new creerTimer(decompterTimerPeriode, finirTimerPeriode);
	var duree_timer_periode;// durée de la périodes (en minutes)
	var timer_impro = new creerTimer(decompterTimerImpro, finirTimerImpro);
	var duree_impro_min;// durée d'impro choisie (minutes)
	var duree_impro_sec;// durée d'impro choisie (secondes)
	var checkImproOk = true;// variable qui dit que la vérification des champs est ok (ou pas) avant d'afficher une impro
	var	titMixComp="Improvisation ";//libellés devant les infos d'impro
	var titDuree="Durée : ";
	var	titCat="Catégorie : ";
	
	var chaussons=0;
	
	var impro = {      //objet "Impro" contenant les paramètres de l'impro en cours
		type: "",
		titre: "",
		categorie: "",
		duree:""
	};
	
	var diapo = {//création de l'objet diapo contenant les paramètres de diaporama
	active:0,
	nb:0,
	index:0,
	autoActive:0,
	autoNb:0,
	autoIndex:0,
	duree:10000,
	};
