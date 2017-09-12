$(document).ready(function() {
	let articleID;
	$(".newComment").on("click", function(){
		articleID = $(this).attr("data-id");
		$.ajax({
			url:'/api/articles/newcomment/' + articleID,
			data:{},
			method:"GET",
			success:function(data){
				console.log(data)
			}
		});
	});

	$(".commentSubmit").on("click", function(){
		let comment = {};
		comment.commentContent = $(".commentContent").val().trim();
		console.log('this is the first comment' + comment)
		$.ajax({
			url:'/api/articles/newcommentsubmit/' + articleID,
			data: JSON.stringify(comment),
			contentType: 'application/json',
			method:"POST",
			success:function(data){
			}
		});
	});
});




