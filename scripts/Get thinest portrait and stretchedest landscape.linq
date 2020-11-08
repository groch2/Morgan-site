<Query Kind="Statements">
  <Namespace>System.Drawing</Namespace>
</Query>

var pictureFiles =
	Directory
		.GetDirectories(@"C:\Users\deschaseauxr\Documents\Morgan-site\pictures")
		.SelectMany(d => Directory.GetFiles(Path.Combine(@"C:\Users\deschaseauxr\Documents\Morgan-site\pictures", d)));
var getImageSize = new Func<string, (double, double)>(file => {
    using (var stream = File.OpenRead(file))
    using (var sourceImage = Image.FromStream(stream, false, false))
    {
        return (sourceImage.Height, sourceImage.Width);
    }
});
var picturesSizeRatio =
	pictureFiles.Select(f => {
		var (height, width) = getImageSize(f);
		var parentDirectory = new DirectoryInfo(Path.GetDirectoryName(f)).Name;
		var fileName = new FileInfo(f).Name;
		var fileRef = Path.Combine(parentDirectory, fileName);
		return (fileRef, height / width);
		}).ToArray();

var maxSizeRatio = picturesSizeRatio.Max(psr => psr.Item2);
var thinestPicture = picturesSizeRatio.First(psr => psr.Item2 == maxSizeRatio).Item1;

var minSizeRatio = picturesSizeRatio.Min(psr => psr.Item2);
var strechedestPicture = picturesSizeRatio.First(psr => psr.Item2 == minSizeRatio).Item1;

var pictureWithAbsDiffToOneSizeRatio =
	picturesSizeRatio.Select(psr => (psr.Item1, Math.Abs(1 - psr.Item2))).ToArray();
var closestToOneSizeRatio = pictureWithAbsDiffToOneSizeRatio.Min(pr => pr.Item2);
var squarestPicture = pictureWithAbsDiffToOneSizeRatio.First(psr => psr.Item2 == closestToOneSizeRatio).Item1;

(new { thinestPicture }).Dump();
(new { strechedestPicture }).Dump();
(new { squarestPicture }).Dump();