
function initISH() {
	unLock();
	$("#ish-buttons").css("display", "flex");

	$(".ish-button").on("click", function() {
		//$("#ish-buttons").css("display", "none");
		$(".ish-button").each(function(e) {
			$(this).css("border", "");
		});
		$(this).css("border", "1px solid #000")
		$("#answer"+ questionID +"ColorBlindness").attr("value", $(this).attr("value"));
		$("#proceed-button").css("display", "block");
	});
}

function startISH() {

}

function evaluateISH() {

}