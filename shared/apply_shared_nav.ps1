Set-Location 'C:\Users\navee\Downloads\Aruvi tours'

$files = Get-ChildItem -Recurse -Filter index.html | Where-Object { $_.FullName -notlike '*\home page\index.html' }
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$navbar = @'
<nav id="nav" class="nav aruvi-navbar">
  <div class="aruvi-nav-container">
    <a class="aruvi-logo" href="../home%20page/index.html">ARUVI <span>TOURS</span></a>

    <ul class="aruvi-nav-links" id="navMenu">
      <li><a href="../home%20page/index.html">Home</a></li>
      <li><a href="../home%20page/index.html#about">About</a></li>
      <li class="aruvi-dd">
        <details>
          <summary>Packages</summary>
          <div class="aruvi-dd-panel">
            <div class="aruvi-dd-col">
              <p class="aruvi-dd-title">Domestic</p>
              <a href="../kerala/index.html">Kerala</a>
              <a href="../goa/index.html">Goa</a>
              <a href="../Andaman/index.html">Andaman</a>
              <a href="../golden_triangle/index.html">Golden Triangle</a>
              <a href="../Himachal Pradesh/index.html">Himachal</a>
              <a href="../Kashmir/index.html">Kashmir</a>
              <a href="../Rajasthan/index.html">Rajasthan</a>
              <a href="../Sikkim/index.html">Sikkim</a>
              <a href="../Assam/index.html">Assam</a>
              <a href="../Gujarat/index.html">Gujarat</a>
              <a href="../Ladakh/index.html">Ladakh</a>
              <a href="../Lakshadweep/index.html">Lakshadweep</a>
              <a href="../Odisha/index.html">Odisha</a>
              <a href="../Meghalaya/index.html">Meghalaya</a>
              <a href="../Arunachal Pradesh/index.html">Arunachal Pradesh</a>
            </div>
            <div class="aruvi-dd-col">
              <p class="aruvi-dd-title">International</p>
              <a href="../malaysia/index.html">Malaysia</a>
              <a href="../singapore/index.html">Singapore</a>
              <a href="../srilanka/index.html">Sri Lanka</a>
              <a href="../nepal/index.html">Nepal</a>
              <a href="../china/index.html">China</a>
              <a href="../vietnam/index.html">Vietnam</a>
            </div>
          </div>
        </details>
      </li>
      <li><a href="../home%20page/index.html#contact">Contact Us</a></li>
      <li><a class="aruvi-book" href="../home%20page/index.html#booking">Book Now</a></li>
    </ul>

    <button class="aruvi-burger" id="hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>

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
</nav>
'@

$changed = @()

foreach($f in $files){
  $path = $f.FullName
  $content = [System.IO.File]::ReadAllText($path)
  $original = $content

  if([string]::IsNullOrWhiteSpace($content)){
    continue
  }

  if($content -notmatch 'href="\.\./shared/navbar.css"'){
    $content = [regex]::Replace($content, '</head>', '  <link rel="stylesheet" href="../shared/navbar.css" />' + [Environment]::NewLine + '</head>', 1)
  }

  $navRx = [regex]::new('<nav[\s\S]*?<\/nav>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  if($navRx.IsMatch($content)){
    $content = $navRx.Replace($content, $navbar, 1)
  }
  else {
    $content = [regex]::Replace($content, '<body[^>]*>', '$0`r`n' + $navbar, 1)
  }

  $mobileRx = [regex]::new('<div class="mobile-menu"[\s\S]*?<\/div>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  $content = $mobileRx.Replace($content, '', 1)

  if($content -ne $original){
    [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
    $changed += $path
  }
}

"Changed files: $($changed.Count)"
$changed
