<Query Kind="Statements">
  <Namespace>System.Drawing</Namespace>
</Query>

const string picturesDirectory = @"C:\Users\deschaseauxr\Documents\Morgan-site\pictures";
var getImageSize = new Func<string, (double Height, double Width)>(file => {
    using (var stream = File.OpenRead(file))
    using (var sourceImage = Image.FromStream(stream, false, false))
    {
        return (Height: sourceImage.Height, Width: sourceImage.Width);
    }
});
var picturesSizeRatio =
	Directory
		.GetDirectories(picturesDirectory)
		.ToDictionary(
			d => Regex.Match(Path.GetFileName(d), @"(?<=^\d+\s).+$").Value,
			d =>
				Directory
					.GetFiles(Path.Combine(picturesDirectory, d))
					.Select(f => {
						(var Height, var Width) = getImageSize(f);
						return new { File = Path.GetFileNameWithoutExtension(f), Ratio = Math.Round(Height / Width, 2) };
					}));
picturesSizeRatio.Dump();