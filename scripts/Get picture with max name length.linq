<Query Kind="Statements" />

var fileNames =
	Directory.GetDirectories(@"C:\Users\deschaseauxr\Documents\Morgan-site\pictures")
		.SelectMany(d => Directory.GetFiles(d))
		.Select(f => Path.GetFileName(f));
var maxLength = fileNames.Select(f => f.Length).Max();
fileNames.First(f => f.Length == maxLength).Dump();