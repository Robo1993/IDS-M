let time_drawing;

function initVM() {
	if(questionCode.indexOf("H") != -1) {
		$("#item-area").css("transform", "rotate(180deg)");
		unLock();
		$("#proceed-button").css("display", "block");
	}else if(questionCode.indexOf("Eval") != -1) {
		unLock();
		$("#eval-container").append("<img class='evalImg_drawing' src='"+localStorage.getItem("idsm/" + questionCode)+"' />");
		$("#proceed-button").css("display", "block");
	}else {
		$("#play-button").css("display", "block");
		$("#play-button").click();
		if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
			$("#speed").css("display", "none");
		}
	}

	if (questionCode.indexOf("FSD04") != -1) {
		// Select the element with the ID 'arrow-container'
		const arrowContainer = document.getElementById('schablone');

		// Remove any existing transform effects
		arrowContainer.style.transform = '';
	
		// Set a new transform effect to rotate the element by 90 degrees
		arrowContainer.style.transform = 'rotate(180deg)';
		}

	//if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		//$("#speed").css("display", "block");
	//}

	if (questionCode.indexOf("Eval") != -1) {
		//document.getElementById("eval-container").style.cssText = "transform: scale(1.2)"
	}

	if (questionCode.indexOf("FA01Eval") != -1) {
		// Setting styles for elements with class "evaluation-field"
		document.getElementById("a1").style.cssText = "width: 115px; height: 70px; left: 325px; top: 85px; transform: rotate(-40deg);";
		document.getElementById("a2").style.cssText = "width: 120px; height: 70px; left: 370px; top: 225px;";
		document.getElementById("a3").style.cssText = "width: 120px; height: 70px; left: 310px; top: 350px; transform: rotate(45deg);";
		document.getElementById("a4").style.cssText = "width: 120px; height: 70px; left: 68px; top: 350px; transform: rotate(135deg);";
		document.getElementById("a5").style.cssText = "width: 120px; height: 70px; left: 8px; top: 225px;";
		document.getElementById("a6").style.cssText = "width: 115px; height: 70px; left: 65px; top: 85px; transform: rotate(45deg);";
	
		// Setting styles for elements with class "evaluation-field-b"
		document.getElementById("b1").style.cssText = "width: 115px; height: 115px; left: 330px; top: 60px;";
		document.getElementById("b2").style.cssText = "width: 120px; height: 70px; left: 370px; top: 225px;";
		document.getElementById("b3").style.cssText = "width: 120px; height: 120px; left: 320px; top: 330px;";
		document.getElementById("b4").style.cssText = "width: 120px; height: 120px; left: 60px; top: 330px;";
		document.getElementById("b5").style.cssText = "width: 120px; height: 70px; left: 8px; top: 225px;";
		document.getElementById("b6").style.cssText = "width: 115px; height: 120px; left: 55px; top: 55px;";
	
		// Setting styles for other elements
		document.getElementById("points_span").style.fontSize = "26px";
		document.getElementById("points").style.display = "none";
		document.getElementById("zero_points").style.fontSize = "26px";
	} else if (questionCode.indexOf("FA02Eval") != -1) {
		document.getElementById("a1").style.cssText = "width: 65px; height: 32px; left: 259px; top: 123px;";
		document.getElementById("a2").style.cssText = "width: 24px; height: 60px; left: 326px; top: 155px;";
		document.getElementById("a3").style.cssText = "width: 96px; height: 10px; left: 352px; top: 218px;";
		document.getElementById("a4").style.cssText = "width: 24px; height: 60px; left: 326px; top: 231px;";
		document.getElementById("a5").style.cssText = "width: 64px; height: 31px; left: 259px; top: 291px;";
		document.getElementById("a6").style.cssText = "width: 12px; height: 91px; left: 247px; top: 324px;";
		document.getElementById("a7").style.cssText = "width: 67px; height: 32px; left: 180px; top: 291px;";
		document.getElementById("a8").style.cssText = "width: 22px; height: 60px; left: 155px; top: 231px;";
		document.getElementById("a9").style.cssText = "width: 97px; height: 11px; left: 54px; top: 218px;";
		document.getElementById("a10").style.cssText = "width: 24px; height: 62px; left: 154px; top: 154px;";
	
		// Setting styles for elements with class "evaluation-field-b"
		document.getElementById("b1").style.cssText = "width: 65px; height: 32px; left: 259px; top: 123px;";
		document.getElementById("b2").style.cssText = "width: 24px; height: 60px; left: 326px; top: 155px;";
		document.getElementById("b3").style.cssText = "width: 96px; height: 10px; left: 352px; top: 218px;";
		document.getElementById("b4").style.cssText = "width: 24px; height: 60px; left: 326px; top: 231px;";
		document.getElementById("b5").style.cssText = "width: 64px; height: 31px; left: 259px; top: 291px;";
		document.getElementById("b6").style.cssText = "width: 12px; height: 91px; left: 247px; top: 324px;";
		document.getElementById("b7").style.cssText = "width: 67px; height: 32px; left: 180px; top: 291px;";
		document.getElementById("b8").style.cssText = "width: 22px; height: 60px; left: 155px; top: 231px;";
		document.getElementById("b9").style.cssText = "width: 97px; height: 11px; left: 54px; top: 218px;";
		document.getElementById("b10").style.cssText = "width: 24px; height: 62px; left: 154px; top: 154px;";
		} else if (questionCode.indexOf("FA03Eval") != -1) {
			// Setting styles for elements with class "evaluation-field"
			document.getElementById("a1").style.cssText = "width: 26px; height: 45px; left: 194px; top: 167px;";
			document.getElementById("a2").style.cssText = "width: 42px; height: 21px; left: 143px; top: 145px;";
			document.getElementById("a3").style.cssText = "width: 26px; height: 45px; left: 281px; top: 100px;";
			document.getElementById("a4").style.cssText = "width: 45px; height: 25px; left: 316px; top: 167px;";
			document.getElementById("a5").style.cssText = "width: 37px; height: 44px; left: 233px; top: 215px;";
			document.getElementById("a6").style.cssText = "width: 42px; height: 20px; left: 143px; top: 260px;";
			document.getElementById("a7").style.cssText = "width: 37px; height: 47px; left: 231px; top: 281px;";
			document.getElementById("a8").style.cssText = "width: 43px; height: 26px; left: 317px; top: 349px;";
			document.getElementById("a9").style.cssText = "width: 27px; height: 46px; left: 280px; top: 398px;";
			document.getElementById("a10").style.cssText = "width: 42px; height: 20px; left: 143px; top: 378px;";
			document.getElementById("a11").style.cssText = "width: 26px; height: 43px; left: 194px; top: 333px;";
			document.getElementById("a12").style.cssText = "width: 44px; height: 20px; left: 228px; top: 378px;";
		
			// Setting styles for elements with class "evaluation-field-b"
			document.getElementById("b1").style.cssText = "width: 26px; height: 45px; left: 194px; top: 167px;";
			document.getElementById("b2").style.cssText = "width: 42px; height: 21px; left: 143px; top: 145px;";
			document.getElementById("b3").style.cssText = "width: 26px; height: 45px; left: 281px; top: 100px;";
			document.getElementById("b4").style.cssText = "width: 45px; height: 25px; left: 316px; top: 167px;";
			document.getElementById("b5").style.cssText = "width: 37px; height: 44px; left: 233px; top: 215px;";
			document.getElementById("b6").style.cssText = "width: 42px; height: 20px; left: 143px; top: 260px;";
			document.getElementById("b7").style.cssText = "width: 37px; height: 47px; left: 231px; top: 281px;";
			document.getElementById("b8").style.cssText = "width: 43px; height: 26px; left: 317px; top: 349px;";
			document.getElementById("b9").style.cssText = "width: 27px; height: 46px; left: 280px; top: 398px;";
			document.getElementById("b10").style.cssText = "width: 42px; height: 20px; left: 143px; top: 378px;";
			document.getElementById("b11").style.cssText = "width: 26px; height: 43px; left: 194px; top: 333px;";
			document.getElementById("b12").style.cssText = "width: 44px; height: 20px; left: 228px; top: 378px;";

		} else if (questionCode.indexOf("FA04Eval") != -1) {
			// Setting styles for elements with class "evaluation-field"
			document.getElementById("a1").style.cssText = "width: 42px; height: 48px; left: 230px; top: 58px;";
			document.getElementById("a2").style.cssText = "width: 50px; height: 47px; left: 368px; top: 255px;";
			document.getElementById("a3").style.cssText = "width: 42px; height: 46px; left: 232px; top: 410px;";
			document.getElementById("a4").style.cssText = "width: 48px; height: 35px; left: 86px; top: 263px;";
			document.getElementById("a5").style.cssText = "width: 50px; height: 47px; left: 138px; top: 130px;";
			document.getElementById("a6").style.cssText = "width: 40px; height: 54px; left: 232px; top: 174px;";
			document.getElementById("a7").style.cssText = "width: 53px; height: 45px; left: 316px; top: 128px;";
			document.getElementById("a8").style.cssText = "width: 52px; height: 35px; left: 280px; top: 263px;";
			document.getElementById("a9").style.cssText = "width: 46px; height: 52px; left: 308px; top: 361px;";
			document.getElementById("a10").style.cssText = "width: 40px; height: 47px; left: 230px; top: 345px;";
			document.getElementById("a11").style.cssText = "width: 46px; height: 54px; left: 151px; top: 360px;";
			document.getElementById("a12").style.cssText = "width: 50px; height: 35px; left: 172px; top: 263px;";
		
			// Setting styles for elements with class "evaluation-field-b"
			document.getElementById("b1").style.cssText = "width: 42px; height: 48px; left: 230px; top: 58px;";
			document.getElementById("b2").style.cssText = "width: 50px; height: 47px; left: 368px; top: 255px;";
			document.getElementById("b3").style.cssText = "width: 42px; height: 46px; left: 232px; top: 410px;";
			document.getElementById("b4").style.cssText = "width: 48px; height: 35px; left: 86px; top: 263px;";
			document.getElementById("b5").style.cssText = "width: 50px; height: 47px; left: 138px; top: 130px;";
			document.getElementById("b6").style.cssText = "width: 40px; height: 54px; left: 232px; top: 174px;";
			document.getElementById("b7").style.cssText = "width: 53px; height: 45px; left: 316px; top: 128px;";
			document.getElementById("b8").style.cssText = "width: 52px; height: 35px; left: 280px; top: 263px;";
			document.getElementById("b9").style.cssText = "width: 46px; height: 52px; left: 308px; top: 361px;";
			document.getElementById("b10").style.cssText = "width: 40px; height: 47px; left: 230px; top: 345px;";
			document.getElementById("b11").style.cssText = "width: 46px; height: 54px; left: 151px; top: 360px;";
			document.getElementById("b12").style.cssText = "width: 50px; height: 35px; left: 172px; top: 263px;";
		} else if (questionCode.indexOf("FA05Eval") != -1) {
			// Setting styles for elements with class "evaluation-field"
			document.getElementById("a1").style.cssText = "width: 52px; height: 51px; left: 130px; top: 72px;";
			document.getElementById("a2").style.cssText = "width: 52px; height: 52px; left: 326px; top: 73px;";
			document.getElementById("a3").style.cssText = "width: 58px; height: 58px; left: 315px; top: 160px;";
			document.getElementById("a4").style.cssText = "width: 43px; height: 55px; left: 235px; top: 175px;";
			document.getElementById("a5").style.cssText = "width: 59px; height: 59px; left: 118px; top: 156px;";
			document.getElementById("a6").style.cssText = "width: 53px; height: 33px; left: 386px; top: 217px;";
			document.getElementById("a7").style.cssText = "width: 50px; height: 38px; left: 388px; top: 312px;";
			document.getElementById("a8").style.cssText = "width: 43px; height: 68px; left: 347px; top: 400px;";
			document.getElementById("a9").style.cssText = "width: 58px; height: 63px; left: 226px; top: 427px;";
			document.getElementById("a10").style.cssText = "width: 45px; height: 68px; left: 121px; top: 404px;";
			document.getElementById("a11").style.cssText = "width: 54px; height: 39px; left: 62px; top: 311px;";
			document.getElementById("a12").style.cssText = "width: 53px; height: 32px; left: 62px; top: 218px;";
		
			// Setting styles for elements with class "evaluation-field-b"
			document.getElementById("b1").style.cssText = "width: 52px; height: 51px; left: 130px; top: 72px;";
			document.getElementById("b2").style.cssText = "width: 52px; height: 52px; left: 326px; top: 73px;";
			document.getElementById("b3").style.cssText = "width: 58px; height: 58px; left: 315px; top: 160px;";
			document.getElementById("b4").style.cssText = "width: 43px; height: 55px; left: 235px; top: 175px;";
			document.getElementById("b5").style.cssText = "width: 59px; height: 59px; left: 118px; top: 156px;";
			document.getElementById("b6").style.cssText = "width: 53px; height: 33px; left: 386px; top: 217px;";
			document.getElementById("b7").style.cssText = "width: 50px; height: 38px; left: 388px; top: 312px;";
			document.getElementById("b8").style.cssText = "width: 43px; height: 68px; left: 347px; top: 400px;";
			document.getElementById("b9").style.cssText = "width: 58px; height: 63px; left: 226px; top: 427px;";
			document.getElementById("b10").style.cssText = "width: 45px; height: 68px; left: 121px; top: 404px;";
			document.getElementById("b11").style.cssText = "width: 54px; height: 39px; left: 62px; top: 311px;";
			document.getElementById("b12").style.cssText = "width: 53px; height: 32px; left: 62px; top: 218px;";
		} else if (questionCode.indexOf("FA06Eval") != -1) {
			// Setting styles for elements with class "evaluation-field"
			document.getElementById("a1").style.cssText = "width: 26px; height: 37px; left: 270px; top: 48px;";
			document.getElementById("a2").style.cssText = "width: 55px; height: 26px; left: 375px; top: 147px;";
			document.getElementById("a3").style.cssText = "width: 54px; height: 33px; left: 376px; top: 261px;";
			document.getElementById("a4").style.cssText = "width: 51px; height: 55px; left: 343px; top: 350px;";
			document.getElementById("a5").style.cssText = "width: 53px; height: 62px; left: 223px; top: 395px;";
			document.getElementById("a6").style.cssText = "width: 52px; height: 59px; left: 132px; top: 351px;";
			document.getElementById("a7").style.cssText = "width: 52px; height: 33px; left: 83px; top: 277px;";
			document.getElementById("a8").style.cssText = "width: 53px; height: 27px; left: 82px; top: 163px;";
			document.getElementById("a9").style.cssText = "width: 54px; height: 62px; left: 192px; top: 87px;";
			document.getElementById("a10").style.cssText = "width: 57px; height: 57px; left: 314px; top: 84px;";
			document.getElementById("a11").style.cssText = "width: 56px; height: 31px; left: 276px; top: 203px;";
			document.getElementById("a12").style.cssText = "width: 56px; height: 29px; left: 276px; top: 323px;";
		
			// Setting styles for elements with class "evaluation-field-b"
			document.getElementById("b1").style.cssText = "width: 26px; height: 37px; left: 270px; top: 48px;";
			document.getElementById("b2").style.cssText = "width: 55px; height: 26px; left: 375px; top: 147px;";
			document.getElementById("b3").style.cssText = "width: 54px; height: 33px; left: 376px; top: 261px;";
			document.getElementById("b4").style.cssText = "width: 51px; height: 55px; left: 343px; top: 350px;";
			document.getElementById("b5").style.cssText = "width: 53px; height: 62px; left: 223px; top: 395px;";
			document.getElementById("b6").style.cssText = "width: 52px; height: 59px; left: 132px; top: 351px;";
			document.getElementById("b7").style.cssText = "width: 52px; height: 33px; left: 83px; top: 277px;";
			document.getElementById("b8").style.cssText = "width: 53px; height: 27px; left: 82px; top: 163px;";
			document.getElementById("b9").style.cssText = "width: 54px; height: 62px; left: 192px; top: 87px;";
			document.getElementById("b10").style.cssText = "width: 57px; height: 57px; left: 314px; top: 84px;";
			document.getElementById("b11").style.cssText = "width: 56px; height: 31px; left: 276px; top: 203px;";
			document.getElementById("b12").style.cssText = "width: 56px; height: 29px; left: 276px; top: 323px;";
		} else if (questionCode.indexOf("FS01Eval") != -1) {
			document.getElementById("eval-together").style.cssText = "margin-top: -25vh;"
			// Setting styles for elements with class "evaluation-field"
			document.getElementById("a1").style.cssText = "width: 107px; height: 95px; left: 26px; top: 135px;";
			document.getElementById("a2").style.cssText = "width: 106px; height: 92px; left: 129px; top: 304px;";
			document.getElementById("a3").style.cssText = "width: 39px; height: 97px; left: 116px; top: 402px;";
			document.getElementById("a4").style.cssText = "width: 35px; height: 95px; left: 31px; top: 403px;";
		
			// Setting styles for elements with class "evaluation-field-b"
			document.getElementById("b1").style.cssText = "width: 107px; height: 95px; left: 26px; top: 135px;";
			document.getElementById("b2").style.cssText = "width: 106px; height: 92px; left: 129px; top: 304px;";
			document.getElementById("b3").style.cssText = "width: 39px; height: 97px; left: 116px; top: 402px;";
			document.getElementById("b4").style.cssText = "width: 35px; height: 95px; left: 31px; top: 403px;";
		} else if (questionCode.indexOf("FS02Eval") != -1) {
			document.getElementById("eval-together").style.cssText = "margin-top: -25vh;"
			// Setting styles for elements with class "evaluation-field"
			document.getElementById("a1").style.cssText = "width: 33px; height: 66px; left: 419px; top: 20px;";
			document.getElementById("a2").style.cssText = "width: 73px; height: 64px; left: 297px; top: 152px;";
			document.getElementById("a3").style.cssText = "width: 73px; height: 70px; left: 310px; top: 311px;";
			document.getElementById("a4").style.cssText = "width: 35px; height: 69px; left: 417px; top: 417px;";
		
			// Setting styles for elements with class "evaluation-field-b"
			document.getElementById("b1").style.cssText = "width: 33px; height: 66px; left: 419px; top: 20px;";
			document.getElementById("b2").style.cssText = "width: 73px; height: 64px; left: 297px; top: 152px;";
			document.getElementById("b3").style.cssText = "width: 73px; height: 70px; left: 310px; top: 311px;";
			document.getElementById("b4").style.cssText = "width: 35px; height: 69px; left: 417px; top: 417px;";
		} else if (questionCode.indexOf("FS03Eval") != -1) {
			document.getElementById("eval-together").style.cssText = "margin-top: -25vh;"
			// Setting styles for elements with class "evaluation-field"
			document.getElementById("a1").style.cssText = "width: 48px; height: 46px; left: 7px; top: 84px;";
			document.getElementById("a2").style.cssText = "width: 28px; height: 38px; left: 120px; top: 135px;";
			document.getElementById("a3").style.cssText = "width: 48px; height: 45px; left: 123px; top: 202px;";
			document.getElementById("a4").style.cssText = "width: 48px; height: 45px; left: 122px; top: 256px;";
			document.getElementById("a5").style.cssText = "width: 28px; height: 38px; left: 120px; top: 330px;";
			document.getElementById("a6").style.cssText = "width: 48px; height: 44px; left: 7px; top: 376px;";
		
			// Setting styles for elements with class "evaluation-field-b"
			document.getElementById("b1").style.cssText = "width: 48px; height: 46px; left: 7px; top: 84px;";
			document.getElementById("b2").style.cssText = "width: 28px; height: 38px; left: 120px; top: 135px;";
			document.getElementById("b3").style.cssText = "width: 48px; height: 45px; left: 123px; top: 202px;";
			document.getElementById("b4").style.cssText = "width: 48px; height: 45px; left: 122px; top: 256px;";
			document.getElementById("b5").style.cssText = "width: 28px; height: 38px; left: 120px; top: 330px;";
			document.getElementById("b6").style.cssText = "width: 48px; height: 44px; left: 7px; top: 376px;";
		} else if (questionCode.indexOf("FS04Eval") != -1) {
			document.getElementById("eval-together").style.cssText = "margin-top: -25vh;"
			// Setting styles for elements with class "evaluation-field"
			document.getElementById("a1").style.cssText = "width: 43px; height: 59px; left: 321px; top: 48px;";
			document.getElementById("a2").style.cssText = "width: 61px; height: 38px; left: 234px; top: 155px;";
			document.getElementById("a3").style.cssText = "width: 61px; height: 39px; left: 234px; top: 313px;";
			document.getElementById("a4").style.cssText = "width: 43px; height: 61px; left: 321px; top: 396px;";
			document.getElementById("a5").style.cssText = "width: 56px; height: 61px; left: 395px; top: 174px;";
			document.getElementById("a6").style.cssText = "width: 57px; height: 61px; left: 396px; top: 270px;";
		
			// Setting styles for elements with class "evaluation-field-b"
			document.getElementById("b1").style.cssText = "width: 43px; height: 59px; left: 321px; top: 48px;";
			document.getElementById("b2").style.cssText = "width: 61px; height: 38px; left: 234px; top: 155px;";
			document.getElementById("b3").style.cssText = "width: 61px; height: 39px; left: 234px; top: 313px;";
			document.getElementById("b4").style.cssText = "width: 43px; height: 61px; left: 321px; top: 396px;";
			document.getElementById("b5").style.cssText = "width: 56px; height: 61px; left: 395px; top: 174px;";
			document.getElementById("b6").style.cssText = "width: 57px; height: 61px; left: 396px; top: 270px;";

		} else if (questionCode.indexOf("FS05Eval") != -1) {
			document.getElementById("eval-together").style.cssText = "margin-top: -25vh;"
			// Setting styles for elements with class "evaluation-field"
			document.getElementById("a1").style.cssText = "width: 44px; height: 51px; left: 183px; top: 30px;";
			document.getElementById("a2").style.cssText = "width: 50px; height: 23px; left: 278px; top: 101px;";
			document.getElementById("a3").style.cssText = "width: 32px; height: 49px; left: 232px; top: 151px;";
			document.getElementById("a4").style.cssText = "width: 49px; height: 48px; left: 117px; top: 82px;";
			document.getElementById("a5").style.cssText = "width: 53px; height: 61px; left: 86px; top: 134px;";
			document.getElementById("a6").style.cssText = "width: 62px; height: 58px; left: 12px; top: 173px;";
			document.getElementById("a7").style.cssText = "width: 66px; height: 61px; left: 6px; top: 274px;";
			document.getElementById("a8").style.cssText = "width: 45px; height: 58px; left: 89px; top: 316px;";
			document.getElementById("a9").style.cssText = "width: 32px; height: 49px; left: 232px; top: 308px;";
			document.getElementById("a10").style.cssText = "width: 48px; height: 22px; left: 279px; top: 381px;";
			document.getElementById("a11").style.cssText = "width: 45px; height: 51px; left: 183px; top: 426px;";
			document.getElementById("a12").style.cssText = "width: 50px; height: 48px; left: 117px; top: 377px;";
		
			// Setting styles for elements with class "evaluation-field-b"
			document.getElementById("b1").style.cssText = "width: 44px; height: 51px; left: 183px; top: 30px;";
			document.getElementById("b2").style.cssText = "width: 50px; height: 23px; left: 278px; top: 101px;";
			document.getElementById("b3").style.cssText = "width: 32px; height: 49px; left: 232px; top: 151px;";
			document.getElementById("b4").style.cssText = "width: 49px; height: 48px; left: 117px; top: 82px;";
			document.getElementById("b5").style.cssText = "width: 53px; height: 61px; left: 86px; top: 134px;";
			document.getElementById("b6").style.cssText = "width: 62px; height: 58px; left: 12px; top: 173px;";
			document.getElementById("b7").style.cssText = "width: 66px; height: 61px; left: 6px; top: 274px;";
			document.getElementById("b8").style.cssText = "width: 45px; height: 58px; left: 89px; top: 316px;";
			document.getElementById("b9").style.cssText = "width: 32px; height: 49px; left: 232px; top: 308px;";
			document.getElementById("b10").style.cssText = "width: 48px; height: 22px; left: 279px; top: 381px;";
			document.getElementById("b11").style.cssText = "width: 45px; height: 51px; left: 183px; top: 426px;";
			document.getElementById("b12").style.cssText = "width: 50px; height: 48px; left: 117px; top: 377px;";
		}

	$(".evaluation-field").on("click", function() {
		var b_id = $(this).attr("id").substring(1);
		if($("#b" + b_id).css("background-color") == "rgba(0, 0, 0, 0)") {
			$("#b" + b_id).css("background-color", "#99d2a7");
		}else {
			$("#b" + b_id).css("background-color", "rgba(0, 0, 0, 0)");
		}
		var correct = $(".evaluation-field-b[style*='background-color: rgb(153, 210, 167)']").length;
		$("#points_span").text(correct);
		$("#answer"+ questionID + "points").attr("value", correct);
	});

	$("#zero_points").on("click", function() {
		$("#points_span").text(0);
		$("#answer"+ questionID + "points").attr("value", 0);
	});

	$("#page-load-screen").css("display", "none");
}

function startVM() {
	//start = new Date();
	start = performance.now();
	init();
	activateSpeed();
	$("#tp-response-button").css("display", "block");
	//$("#time-bar-fluid").addClass("bar-load-10s-once");
}

function feedbackVM() {
	document.getElementById("canvas-container").style.zIndex = -1;
	$("#clock").css("display", "none");
	$("#speed").css("display", "none");
	if(questionCode.indexOf("FS") != -1 || questionCode.indexOf("FA") != -1) {
		$("#schablone").css("display", "block");
		$("#schablone").css("margin-left", "auto");
		//feedback();
		$("#feedback-button-correct").removeClass("feedback-button");
		$("#feedback-button-false").removeClass("feedback-button");

		$("#feedback-button-correct").on("click", function() {
			answered_correctly = true;
			manualFeedback();
		});

		$("#feedback-button-false").on("click", function() {
			answered_correctly = false;
			manualFeedback();
		});

	}else if(questionCode.indexOf("EZLE") != -1) {
		feedback();
		$("#proceed-button").css("display", "block");
	}
}

function manualFeedback() {
	$("#feedback-button-correct").addClass("feedback-button");
	$("#feedback-button-false").addClass("feedback-button");
	feedback();
	$("#proceed-button").css("display", "block");
}

function evaluateVM() {
	time_drawing = (end - start) - (end - date_of_last_pickup);

	//$("#time-bar-fluid").removeClass("bar-load-10s-once");

	if(questionCode.indexOf("EZLE") != -1) {
		evaluateEZLE();
	}else if (questionCode.indexOf("FS") != -1) {
		evaluateFS();
	}else if(questionCode.indexOf("FA") != -1) {
		evaluateFA();
	}
	if(questionCode.indexOf("D") != -1 || questionCode.indexOf("V") != -1) {
		//$("#feedback-button").css("display", "block");
		if(questionCode.indexOf("EZLE") == -1) {
			$("#eval-container").css("display", "block");
		}
		feedbackVM();
	}else {
		$("#ls-button-submit").click();
	}
}

function evaluateEZLE() {
	checkPercentage();
	var time = end - start;
	localStorage.setItem("idsm/" + questionCode + "Eval", canvas.toDataURL("image/png"));
	$("#answer"+ questionID + "Time").attr("value", time_drawing);
	$("#answer"+ questionID + "Crossed").attr("value", crossing);
	$("#answer"+ questionID + "Percent").attr("value", 100 - percentage +"%");
	$("#answer"+ questionID + "Target").attr("value", target);
	$("#answer"+ questionID + "Pickups").attr("value", pickups);
	$("#answer"+ questionID + "UserDrawing").attr("value", localStorage.getItem("idsm/" + questionCode + "Eval"));
	if(100 - percentage == 0 && target) {
		answered_correctly = true;
	}
}

function evaluateFS() {
	checkPercentage();
	checkFields();
	localStorage.setItem("idsm/" + questionCode + "Eval", canvas.toDataURL("image/png"));
	var time = end - start;
	$("#answer"+ questionID + "Time").attr("value", time_drawing);
	$("#answer"+ questionID + "Percent").attr("value", 100 - percentage +"%");
	$("#answer"+ questionID + "FieldsCrossed").attr("value", crossed_fields);
	$("#answer"+ questionID + "FieldsMissed").attr("value", missed_fields);
	$("#answer"+ questionID + "Pickups").attr("value", pickups);
	$("#answer"+ questionID + "UserDrawing").attr("value", localStorage.getItem("idsm/" + questionCode + "Eval"));
	if(100 - percentage == 0 && missed_fields == 0) {
		answered_correctly = true;
	}
}

function evaluateFA() {
	checkPercentage();
	checkFields();
	localStorage.setItem("idsm/" + questionCode + "Eval", canvas.toDataURL("image/png"));
	var time = end - start;
	$("#answer"+ questionID + "Time").attr("value", time_drawing);
	$("#answer"+ questionID + "Percent").attr("value", 100 - percentage +"%");
	$("#answer"+ questionID + "FieldsCrossed").attr("value", crossed_fields);
	$("#answer"+ questionID + "FieldsMissed").attr("value", missed_fields);
	$("#answer"+ questionID + "Pickups").attr("value", pickups);
	$("#answer"+ questionID + "UserDrawing").attr("value", localStorage.getItem("idsm/" + questionCode + "Eval"));
	if(100 - percentage == 0 && missed_fields == 0) {
		answered_correctly = true;
	}
}