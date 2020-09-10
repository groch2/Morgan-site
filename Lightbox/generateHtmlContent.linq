<Query Kind="Statements" />

var content =
	Directory.GetFiles(@"C:\Users\deschaseauxr\Documents\Morgan-site\1 Peintures")
	.Select(f => $@"<img class=""mySlides"" src=""{f}"" style=""width:100%"">")
	.Aggregate(new StringBuilder(), (state, item) => state.AppendLine(item), content => content.ToString()).Dump();
File.WriteAllText(@"C:\Users\deschaseauxr\Documents\Morgan-site\Lightbox\content\peinture.html", content);
/*
<img class="mySlides" src="C:\Users\deschaseauxr\Documents\Morgan-site\Thumbnails\2 Dessins\20180627120825190_0005.jpg" style="width:100%">
*/