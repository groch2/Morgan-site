$local_pictures_directory = (Resolve-Path -Path "..\..\pictures-by-device-type").Path
$local_pictures_files = `
    gci $local_pictures_directory -Recurse |`
    ? { $_ -isnot [System.IO.DirectoryInfo] } |`
    % { $_.FullName -replace "^$local_pictures_directory\".Replace("\", "\\") }
Write-Host ($local_pictures_files -join "`n")