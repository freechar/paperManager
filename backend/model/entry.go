package model

type entry struct {
	User User
	ThesisInfo ThesisInfo
	ThesisFile ThesisFile
	Stage Stage
	Evaluate Evaluate
	Diff Diff
	Comment Comment
	CommentReply CommentReply
}

var Entry = entry{}
