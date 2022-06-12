# $local_pictures_directory = (Resolve-Path -Path "..\..\pictures-by-device-type").Path
# $local_pictures_files = `
#     gci $local_pictures_directory -Recurse |`
#     ? { $_ -isnot [System.IO.DirectoryInfo] } |`
#     % { $_.FullName -replace "^$local_pictures_directory\".Replace("\", "\\") }
# Write-Host ($local_pictures_files -join "`n")

# $env:PYTHONIOENCODING='Unicode'
# $s3_bucket_pictures_list = `
#     aws s3 ls s3://morgan-site-pictures-by-device-type/ --recursive
    # % { $_.Substring(31) } |`
    # Out-File "$env:TEMP\s3_bucket_pictures_list.txt" -Encoding UTF8
# Write-Host $s3_bucket_pictures_list -Separator "`n"
aws s3 ls s3://morgan-site-pictures-by-device-type/ --recursive