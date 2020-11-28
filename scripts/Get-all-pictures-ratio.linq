<Query Kind="Statements">
  <Namespace>System.Drawing</Namespace>
</Query>

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
		});

picturesSizeRatio
	.OrderBy(t => t.Ratio)
	.Select(t => (t.Ref, Math.Round(t.Ratio, 2).ToString("0.00")))
	.Dump();