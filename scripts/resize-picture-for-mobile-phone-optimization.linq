<Query Kind="Statements">
  <Namespace>System.Drawing</Namespace>
</Query>

const string picturesRootDirectory = @"C:\Users\deschaseauxr\Pictures\Test pict resize for mobile phone";
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
const double iPhone5Height = 320;
const double iPhone5Width = 568;
const double iPhoneRatio = iPhone5Height / iPhone5Width;
Func<double, string> doubleForDisplay = value => value.ToString("0.00");
doubleForDisplay(iPhoneRatio).Dump();
picturesSizeRatio
	.OrderBy(p => p.Ratio)
	.Select(p =>
		{
			double pictureHeightOnIPhone, pictureWidthOnIPhone;
			var isPhoneMoreStretchedThanPicture = iPhoneRatio < p.Ratio;
			if (isPhoneMoreStretchedThanPicture)
			{
				pictureHeightOnIPhone = iPhone5Height;
				pictureWidthOnIPhone = Math.Round(p.Width / (p.Height / iPhone5Height));
			}
			else
			{
				pictureWidthOnIPhone = iPhone5Width;
				pictureHeightOnIPhone = Math.Round(p.Height / (p.Width / iPhone5Width));
			}
			return new
				{ 
					File = p.Ref,
					Height = p.Height,
					Width = p.Width,
					Ratio = doubleForDisplay(p.Ratio),
					IsPhoneMoreStretchedThanPicture = isPhoneMoreStretchedThanPicture,
					onIPhone = new 
					{ 
						Height = pictureHeightOnIPhone,
						Width = pictureWidthOnIPhone,
						Ratio = doubleForDisplay(pictureHeightOnIPhone / pictureWidthOnIPhone)
					}
				};
		})
	.Dump();