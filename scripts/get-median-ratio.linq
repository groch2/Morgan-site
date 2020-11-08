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
Directory
	.GetDirectories(picturesDirectory)
	.ToDictionary(
		d => Regex.Match(Path.GetFileName(d), @"(?<=^\d+\s).+$").Value,
		d => {
			var filesWithSizeRatio = Directory
				.GetFiles(Path.Combine(picturesDirectory, d))
				.Select(f => {
					(var Height, var Width) = getImageSize(f);
					return new { File = Path.GetFileNameWithoutExtension(f), Ratio = Height / Width };
				})
				.OrderBy(file => file.Ratio).ToArray();
			var half = filesWithSizeRatio.Length / 2;
			var medianRatio = filesWithSizeRatio[half].Ratio;
			return
				Math.Round(
					filesWithSizeRatio.Length % 2 == 0 ?
					(medianRatio + filesWithSizeRatio[half + 1].Ratio) / 2 :
					medianRatio, 2);
		})
	.Dump();