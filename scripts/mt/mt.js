let total_points = 0;

function initMT() {
	unLock();
	$("#proceed-button").css("display", "block");
	$("#page-load-screen").css("display", "none");

	$(".td-MT").on("click", function() {
		let radio = $(this).find("input")[0];
		let table_row = $(radio).attr("class").split(" ")[1];
		$(radio).attr("checked", "checked");
		$("#answer"+ questionID + table_row).attr("value", $(radio).val());
		evaluateMT();
	});
}

function evaluateMT() {
	total_points = 0;
	$("input[type=radio]:checked").each(function() {
       var value = parseInt($(this).val());
       total_points = total_points + value;
   });
	$("#answer"+ questionID + "Total").attr("value", total_points);
}