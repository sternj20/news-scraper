const renderModal = function(arr){
	$(".modal-body").empty();
	$(".commentContent").val('');
	arr.forEach(function(element){
		let div = $('<div class ="panel panel-default">');
		let divBody = $('<div class="panel-body">');
		let button = $('<button type="submit">');
		button.text('Delete comment').addClass('btn deleteComment').attr("data-id", element._id)
		divBody.text(element.comment);
		div.append(divBody);
		div.append(button);
		$(".modal-body").append(div);
	});
};



$(document).ready(function() {
	let articleID;
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
				renderModal(data);
			}
		});
	});

	$(".commentSubmit").on("click", function(){
		let comment = {};
		comment.commentContent = $(".commentContent").val().trim();
		$.ajax({
			url:'/api/articles/newcommentsubmit/' + articleID,
			data: JSON.stringify(comment),
			contentType: 'application/json',
			method:"POST",
			success:function(data){
				$.ajax({
					//concatenate this id onto the path so we can reference it on the backend
					url:'/api/articles/newcomment/' + articleID,
					data:{},
					method:"GET",
					success:function(data){
						activeArticleComments = data;
						renderModal(data);
					}
				});
			}
		});
	});

	$(".modal-body").on("click", ".deleteComment", function(){
		let commentID = $(this).attr("data-id")
		$.ajax({
			url:'/api/articles/deletecomment/' + commentID,
			method:"DELETE",
			success:function(data){
				$.ajax({
					url:'/api/articles/newcomment/' + articleID,
					data:{},
					method:"GET",
					success:function(data){
						activeArticleComments = data;
						renderModal(data);
					}
				});
			}
		});
	});
});




