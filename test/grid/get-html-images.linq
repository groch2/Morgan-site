<Query Kind="Expression" />

Directory.GetFiles(@"C:\Users\deschaseauxr\Documents\Morgan-site\test\grid\pictures\")
	.Select(f => $@"<div class=""thumbnail""><img src=""file:///{f.Replace("\\", "/")}""/></div>")
	.Aggregate(new StringBuilder(), (state, item) => state.Append(item), builder => builder.ToString())