<Query Kind="Program">
  <Namespace>System.Drawing</Namespace>
</Query>

void Main()
{
	var pictureFiles =
		Directory
			.GetDirectories(@"C:\Users\deschaseauxr\Documents\Morgan-site\pictures")
			.SelectMany(d => Directory.GetFiles(Path.Combine(@"C:\Users\deschaseauxr\Documents\Morgan-site\pictures", d)));
	var getImageSize = new Func<string, (double Width, double Height)>(file => {
	    using (var stream = File.OpenRead(file))
	    using (var sourceImage = Image.FromStream(stream, false, false))
	    {
	        return (sourceImage.Width, sourceImage.Height);
	    }
	});
	var picturesSizeRatio =
		pictureFiles.Select<string, (string Ref, double Ratio)>(f => {
			var (width, height) = getImageSize(f);
			var parentDirectory = new DirectoryInfo(Path.GetDirectoryName(f)).Name;
			var fileName = new FileInfo(f).Name;
			var fileRef = Path.Combine(parentDirectory, fileName);
			return (fileRef, height / width);
			}).ToArray();
	
	var thinestPicture = GetMaxItem(picturesSizeRatio, (a, b) => a.Ratio > b.Ratio ? a : b);
	
	Func<(string Ref, double Ratio), (string Ref, double Ratio), (string Ref, double Ratio)> getMinOf2 = (a, b) => a.Ratio < b.Ratio ? a : b;
	var strechedestPicture = GetMaxItem(picturesSizeRatio, getMinOf2);
	
	var pictureWithAbsDiffToOneSizeRatio =
		picturesSizeRatio.Select(psr => (psr.Ref, Math.Abs(1 - psr.Ratio)));
	var squarestPicture = GetMaxItem(pictureWithAbsDiffToOneSizeRatio, getMinOf2);
	
	(new { thinestPicture }).Dump();
	(new { strechedestPicture }).Dump();
	(new { squarestPicture }).Dump();
}

public T GetMaxItem<T>(IEnumerable<T> itemsList, Func<T, T, T> getMaxOf2Items) =>
	itemsList.Skip(1).Aggregate(itemsList.First(), (maxItem, item) => getMaxOf2Items(maxItem, item));
