<Query Kind="Expression" />

File.ReadAllLines(@"C:\Users\deschaseauxr\Documents\Morgan-site\Mobile phones resolutions.txt")
	.Select(l => Regex.Match(l, @"^([^:]+):\s+(\d+)\sx\s(\d+)$").Groups.Cast<Group>().Skip(1).Select(g => g.Value))