<Query Kind="Statements">
  <Namespace>System.Drawing</Namespace>
</Query>

const string picturesDirectory = @"C:\Users\deschaseauxr\Documents\Morgan-site\pictures";
var picturesByDirectory =
	Directory
		.GetDirectories(picturesDirectory)
		.ToDictionary(
			d => Regex.Match(Path.GetFileName(d), @"(?<=^\d+\s).+$").Value,
			d => Directory.GetFiles(Path.Combine(picturesDirectory, d)));
var getImageSize = new Func<string, (double Height, double Width)>(file => {
    using (var stream = File.OpenRead(file))
    using (var sourceImage = Image.FromStream(stream, false, false))
    {
        return (Height: sourceImage.Height, Width: sourceImage.Width);
    }
});
var picturesSizeRatio =
	picturesByDirectory.ToDictionary(
		directory => directory.Key,
		directory =>
			directory.Value
				.Select(f => {
					(var Height, var Width) = getImageSize(f);
					return new { File = Path.GetFileNameWithoutExtension(f), Height, Width };
				}));
picturesSizeRatio.Dump();