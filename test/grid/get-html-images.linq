<Query Kind="Expression" />

Directory.GetFiles(@"C:\Users\deschaseauxr\Documents\Morgan-site\test\grid\pictures\")
	.Select(f => $@"<div class=""thumbnail""><div class=""thumbnail-inside""><img src=""{f}""/></div></div>")
	.Aggregate(new StringBuilder(), (state, item) => state.Append(item), builder => builder.ToString())