<Query Kind="Expression" />

File.ReadAllLines(@"C:\Users\deschaseauxr\Documents\Morgan-site\Mobile phones resolutions.txt")
	.Select(l => Regex.Match(l, @"^([^:]+):\s+(\d+)\sx\s(\d+)$").Groups.Cast<Group>().Skip(1).Select(g => g.Value).ToArray())
	.Select(data =>
		{
			var phoneModel = data[0];
			var width = double.Parse(data[1]);
			var height = double.Parse(data[2]);
			var ratio = Math.Round(height / width, 2).ToString("0.00");
			return new { PhoneModel = phoneModel, Width = width, Height = height, Ratio = ratio };
		})
	.OrderBy(phoneScreen => phoneScreen.Ratio)
