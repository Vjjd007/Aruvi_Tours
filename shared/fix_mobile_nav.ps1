Set-Location 'C:\Users\navee\Downloads\Aruvi tours'

$files = Get-ChildItem -Recurse -Filter index.html | Where-Object { $_.FullName -notlike '*\home page\index.html' }
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$mobile = @'
<div class="mobile-menu" id="mobileMenu">
  <ul>
    <li><a href="../home%20page/index.html" class="mm-link">Home</a></li>
    <li><a href="../home%20page/index.html#about" class="mm-link">About</a></li>
    <li><a href="../kerala/index.html" class="mm-link">Kerala</a></li>
    <li><a href="../goa/index.html" class="mm-link">Goa</a></li>
    <li><a href="../Andaman/index.html" class="mm-link">Andaman</a></li>
    <li><a href="../golden_triangle/index.html" class="mm-link">Golden Triangle</a></li>
    <li><a href="../Kashmir/index.html" class="mm-link">Kashmir</a></li>
    <li><a href="../Rajasthan/index.html" class="mm-link">Rajasthan</a></li>
    <li><a href="../Sikkim/index.html" class="mm-link">Sikkim</a></li>
    <li><a href="../Assam/index.html" class="mm-link">Assam</a></li>
    <li><a href="../Gujarat/index.html" class="mm-link">Gujarat</a></li>
    <li><a href="../Ladakh/index.html" class="mm-link">Ladakh</a></li>
    <li><a href="../Lakshadweep/index.html" class="mm-link">Lakshadweep</a></li>
    <li><a href="../Odisha/index.html" class="mm-link">Odisha</a></li>
    <li><a href="../Meghalaya/index.html" class="mm-link">Meghalaya</a></li>
    <li><a href="../Arunachal Pradesh/index.html" class="mm-link">Arunachal Pradesh</a></li>
    <li><a href="../malaysia/index.html" class="mm-link">Malaysia</a></li>
    <li><a href="../singapore/index.html" class="mm-link">Singapore</a></li>
    <li><a href="../srilanka/index.html" class="mm-link">Sri Lanka</a></li>
    <li><a href="../nepal/index.html" class="mm-link">Nepal</a></li>
    <li><a href="../china/index.html" class="mm-link">China</a></li>
    <li><a href="../vietnam/index.html" class="mm-link">Vietnam</a></li>
    <li><a href="../home%20page/index.html#contact" class="mm-link">Contact Us</a></li>
    <li><a href="../home%20page/index.html#booking" class="mm-link">Book Now</a></li>
  </ul>
</div>
'@

$changed = @()
$mobileRx = [regex]::new('<div class="mobile-menu"[\s\S]*?<\/div>', [System.Text.RegularExpressions.RegexOptions]::Singleline)

foreach($f in $files){
  $p = $f.FullName
  $c = [System.IO.File]::ReadAllText($p)
  $o = $c

  $c = $c.Replace('`r`n', [Environment]::NewLine)

  if($mobileRx.IsMatch($c)){
    $c = $mobileRx.Replace($c, $mobile, 1)
  }
  else {
    $c = [regex]::Replace($c, '<\/nav>', '</nav>' + [Environment]::NewLine + $mobile, 1)
  }

  if($c -ne $o){
    [System.IO.File]::WriteAllText($p, $c, $utf8NoBom)
    $changed += $p
  }
}

"Changed files: $($changed.Count)"
$changed
