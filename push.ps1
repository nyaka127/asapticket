Set-Location "c:\Users\USER\OneDrive\Desktop\dev\tmp\gh-pages"
git init
git add .
git commit -m "Add static landing page for GitHub Pages"
git branch -M main
git remote remove origin 2>$null
git remote add origin https://github.com/nyaka127/asapticket.git
git push -u origin main --force
Write-Host "Done! Visit https://nyaka127.github.io/asapticket/ in about 2 minutes." -ForegroundColor Green
