const mongoose = require("mongoose");
const Schema = mongoose.schema;

const CommentSchema = new Schema({
	content: {
		type: String,
		required: true
	}
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;