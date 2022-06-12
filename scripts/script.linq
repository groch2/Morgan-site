<Query Kind="Statements" />

var present_on_aws_s3 = File.ReadAllLines(@"C:\Users\deschaseauxr\Documents\Morgan-site\Morgan-site\scripts\sync-pictures-to-s3-bucket\present_on_aws_s3.txt");
var every_picture = File.ReadAllLines(@"C:\Users\deschaseauxr\Documents\Morgan-site\Morgan-site\scripts\sync-pictures-to-s3-bucket\every_picture.txt");
var files_to_copy = every_picture.Except(present_on_aws_s3, StringComparer.OrdinalIgnoreCase);
files_to_copy
	.Select(file => file.Replace("/", @"\"))
	.Select(file => $@"aws s3 cp ""{Path.Combine(@"C:\Users\deschaseauxr\Documents\Morgan-site\Morgan-site\pictures-by-device-type", file)}"" s3://morgan-site-pictures-by-device-type/{Path.GetDirectoryName(file).Replace(@"\", "/")}/")
	.Dump();