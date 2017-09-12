const renderModal = function(arr){
	$(".modal-body").empty();
	arr.forEach(function(element){
		let div = $('<div class ="panel panel-default">');
		let divBody = $('<div class="panel-body">');
		divBody.text(element.comment);
		div.append(divBody);
		$(".modal-body").append(div);
		console.log(element);
	});
};



$(document).ready(function() {
	let articleID;
	let activeArticleComments;
	//when new add new comment button is clicked
	$(".newComment").on("click", function(){
		//grab the unique id of the article that user wants to add comment on
		articleID = $(this).attr("data-id");
		$.ajax({
			//concatenate this id onto the path so we can reference it on the backend
			url:'/api/articles/newcomment/' + articleID,
			data:{},
			method:"GET",
			success:function(data){
				activeArticleComments = data;
				renderModal(data);
				console.log(activeArticleComments)
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




