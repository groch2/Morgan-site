<Query Kind="Statements">
  <Namespace>System.Drawing</Namespace>
</Query>

const string picturesRootDirectory = @"C:\Users\deschaseauxr\Documents\Morgan-site\pictures";
var pictureFiles = 
	Directory
		.GetDirectories(picturesRootDirectory)
		.SelectMany(d => Directory.GetFiles(Path.Combine(picturesRootDirectory, d)));
var getImageSize = new Func<string, (double Width, double Height)>(file => {
    using (var stream = File.OpenRead(file))
    using (var sourceImage = Image.FromStream(stream, false, false))
    {
        return (sourceImage.Width, sourceImage.Height);
    }
});
var picturesSizeRatio =
	pictureFiles.Select<string, (string Ref, double Height, double Width, double Ratio)>(f => {
		var (width, height) = getImageSize(f);
		var parentDirectory = new DirectoryInfo(Path.GetDirectoryName(f)).Name;
		var fileName = new FileInfo(f).Name;
		var fileRef = Path.Combine(parentDirectory, fileName);
		return (fileRef, height, width, height / width);
		});
const double iPhone12Height = 1284; 
const double iPhone12Width = 2778;
const double iPhoneRatio = iPhone12Height / iPhone12Width;
Func<double, string> doubleForDisplay = value => value.ToString("0.00");
new { iPhoneRatio = doubleForDisplay(iPhoneRatio) }.Dump();
var picturesWithIPhoneDisplayValues =
	picturesSizeRatio
		.Select(p =>
			{
				var isPhoneMoreStretchedThanPicture = iPhoneRatio < p.Ratio;
				var pictureHeightOnIPhone =
					isPhoneMoreStretchedThanPicture ? iPhone12Height : p.Height * iPhone12Width / p.Width;
				var pictureWidthOnIPhone =
					isPhoneMoreStretchedThanPicture ? p.Width * iPhone12Height / p.Height : iPhone12Width;
				var pictureRatioOnIPhone = pictureHeightOnIPhone / pictureWidthOnIPhone;
				return new
					{ 
						File = p.Ref,
						p.Height,
						p.Width,
						p.Ratio,
						onIPhone = new 
						{ 
							Height = Math.Round(pictureHeightOnIPhone),
							Width = Math.Round(pictureWidthOnIPhone),
							Ratio = pictureRatioOnIPhone
						}
					};
			});
Func<double, double> roundForComparison = value => Math.Round(value, 2, MidpointRounding.AwayFromZero);
new { picturesWithModifiedRatioOnIPhone = picturesWithIPhoneDisplayValues.Where(p => roundForComparison(p.Ratio) != roundForComparison(p.onIPhone.Ratio)) }.Dump();
picturesWithIPhoneDisplayValues.Select(p =>
	new
		{ 
			p.File,
			Height = p.onIPhone.Height,
			Width = p.onIPhone.Width,
		})
	.Dump();