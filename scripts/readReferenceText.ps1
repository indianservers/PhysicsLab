param([string]$Inventory = 'artifacts/physics-studio-audit/studio-inventory.json')
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null=[Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime]
$null=[Windows.Storage.FileAccessMode,Windows.Storage,ContentType=WindowsRuntime]
$null=[Windows.Storage.Streams.IRandomAccessStream,Windows.Storage.Streams,ContentType=WindowsRuntime]
$null=[Windows.Graphics.Imaging.BitmapDecoder,Windows.Graphics.Imaging,ContentType=WindowsRuntime]
$null=[Windows.Graphics.Imaging.SoftwareBitmap,Windows.Graphics.Imaging,ContentType=WindowsRuntime]
$null=[Windows.Media.Ocr.OcrEngine,Windows.Foundation,ContentType=WindowsRuntime]
$null=[Windows.Media.Ocr.OcrResult,Windows.Foundation,ContentType=WindowsRuntime]
$script:taskMethod=[System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } | Select-Object -First 1
function Await-Result($Operation,[Type]$ResultType) {
 $task=$script:taskMethod.MakeGenericMethod($ResultType).Invoke($null,@($Operation));$task.Wait();return $task.Result
}
$engine=[Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
$rows=Get-Content -LiteralPath $Inventory -Raw | ConvertFrom-Json
$results=New-Object 'System.Collections.Generic.List[object]'
$base=(Get-Location).Path
foreach($row in $rows){
 $entry=@{reference=$row.mockup;route=$row.currentRoute}
 foreach($kind in @('target','current')){
  $key=$row.mockup.Replace('/','__').Replace('.png','')
  $filePath=if($kind -eq 'target'){Join-Path 'C:\Indian Servers\temp\Physics\studiotargetUI\all' $row.mockup}else{Join-Path $base "artifacts/physics-studio-audit/reference-captures/$key.png"}
  if(!(Test-Path -LiteralPath $filePath)){$entry[$kind]=@{error='Screenshot missing'};continue}
  try{
   $file=Await-Result ([Windows.Storage.StorageFile]::GetFileFromPathAsync($filePath)) ([Windows.Storage.StorageFile])
   $stream=Await-Result ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
   $decoder=Await-Result ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
   $bitmap=Await-Result ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
   $result=Await-Result ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
   $lines=@($result.Lines | ForEach-Object { @{text=$_.Text;words=@($_.Words | ForEach-Object {@{text=$_.Text;x=$_.BoundingRect.X;y=$_.BoundingRect.Y;width=$_.BoundingRect.Width;height=$_.BoundingRect.Height}})} })
   $entry[$kind]=@{text=$result.Text;lines=$lines}
  }catch{$entry[$kind]=@{error=$_.Exception.Message}}
  finally{if($bitmap){$bitmap.Dispose();$bitmap=$null};if($stream){$stream.Dispose();$stream=$null}}
 }
 $results.Add($entry)
 $output=Join-Path $base 'artifacts/physics-studio-audit/reference-ocr.json'
 [System.IO.File]::WriteAllText($output,($results | ConvertTo-Json -Depth 9),[System.Text.UTF8Encoding]::new($false))
 if($results.Count % 10 -eq 0){Write-Output "Recognized $($results.Count)/$($rows.Count) reference pairs"}
}
