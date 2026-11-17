# Derech Library

## 1. Backend (5 min, free, one time)
1. Create a new Google Sheet (call it "Derech Library"). Menu: Extensions > Apps Script.
2. Delete the sample code, paste in everything from `Code.gs`, save.
3. Project Settings (gear) > Script Properties > Add: name `PIN`, value = your admin PIN.
4. Deploy > New deployment > type **Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy, authorize, copy the `/exec` URL.
5. Paste that URL into `config.js` (`window.API_URL = "..."`).
(The Sheet's "Loans" tab is also a live list of who has what, for the administration.)

## 2. Website (GitHub Pages)
Upload all files in this folder to a GitHub repo (root). Settings > Pages > Deploy from branch `main` / root.
Your site is `https://<user>.github.io/<repo>/`. Open it, tap Admin > Labels to print QR codes (they use that address).

## Adding books
Append new lines at the END of `books.js`: `{"id":"b-0101","t":"Title","a":"Author","c":"Category"}`. Never reorder or delete (labels depend on the ids).
