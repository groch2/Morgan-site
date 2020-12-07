 Get-ChildItem | ForEach-Object{ $_.Name.Replace(" ", "\ ") + @("", "/")[$_.Mode[0] -eq "d"] }
 