$deployCommand = "aws s3 sync "".\pictures-by-device-type"" s3://morgan-site-pictures-by-device-type/ --delete"
Invoke-Expression "${deployCommand} --dryrun"
Write-Host "Press Enter to confirm or any other key to abort :"
$keyCode = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown").VirtualKeyCode
if ($keyCode -eq 13) {
    Invoke-Expression "${deployCommand}"
}
else {
    Write-Host "Abort"
}