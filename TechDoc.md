### Sveučilište Jurja Dobrile u Puli

### Prijediplomski sveučilišni studij Informatika

### Kolegij: Upravljanje poslovnim procesima (UPP)  


<p>
  <img src="https://fipu.unipu.hr/_pub/themes_static/unipu2020/fipu/icons/fipu_hr.png" alt="FIPU logo" width="500">
</p>
<br><br>

# Tehnički izvještaj: AImageQuizWA aplikacija



**Autor:** Igor Pavlić 
**Akademska godina:** 2025/2026  
**JMBAG:** 0069012453  


**Datum:** Ožujak 2026


1. Uvod i opis projekta

Ovaj izvještaj dokumentira arhitekturu i implementaciju sustava AI Image Quiz, interaktivne web aplikacije temeljene na pogađanju sadržaja slika generiranih putem umjetne inteligencije. Iz perspektive softverske arhitekture, projekt je dizajniran kao dekaplirana (decoupled) klijent-poslužitelj (client-server) aplikacija koja koristi vanjske servise generativne inteligencije (DeepAI API) kao temeljni izvor dinamičkog sadržaja.

Arhitektura sustava počiva na principima razdvajanja odgovornosti (Separation of Concerns), gdje Vue.js frontend komunicira s bezstanjskim (stateless) Express.js backendom putem REST API-ja. Ovakav pristup osigurava visoku razinu modularnosti i olakšava održavanje koda. Dokumentacija je pripremljena za akademski i profesionalni pregled, s posebnim fokusom na tranziciju s managed rješenja (Firebase) na vlastitu, kontroliranu infrastrukturu.

2. Tehnološki stog (Tech Stack)

Odabrane tehnologije reflektiraju moderan pristup razvoju skalabilnih web aplikacija uz korištenje NoSQL baze podataka i asinkrone komunikacije.

Sloj	Tehnologija
Frontend	Vue.js 3 (Composition API) + Vite
Backend	Node.js + Express.js
Baza podataka	MongoDB Atlas
Autentifikacija	JWT (JSON Web Tokens) + bcrypt
AI slike	DeepAI Text-to-Image API
HTTP klijent	Axios
Testiranje	Postman

3. Arhitektura sustava i REST API specifikacija

Komunikacija unutar sustava odvija se isključivo putem REST protokola. Svi zaštićeni endpointi zahtijevaju validaciju JSON Web Tokena (JWT) u zaglavlju zahtjeva, dok administrativni endpointi dodatno provjeravaju status korisničke uloge (role) unutar baze podataka.

3.1. Autentifikacijski sustav

Backend koristi /login endpoint za provjeru vjerodajnica i izdavanje JWT tokena koji služi kao identifikator sesije na klijentskoj strani.

Metoda	Endpoint	Opis	Auth
POST	/api/auth/register	Registracija novog korisnika i hashiranje lozinke
POST	/api/auth/login	Provjera korisnika i izdavanje JWT tokena

3.2. Upravljanje kvizom

Rute za kviz osiguravaju dinamički dohvat podataka potrebnih za igru te perzistenciju postignutih rezultata korisnika.

Metoda	Endpoint	Opis	Auth
GET	/api/quiz/words	Dohvat skupa riječi za generiranje kviza
GET	/api/quiz/score	Dohvat trenutnog rezultata prijavljenog korisnika
PATCH	/api/quiz/score	Ažuriranje rezultata (score) nakon završetka sesije

3.3. Sustav rangiranja (Highscore)

Javne rute omogućuju natjecateljski karakter aplikacije bez potrebe za obveznom autentifikacijom prilikom pregleda najboljih igrača.

Metoda	Endpoint	Opis	Auth
GET	/api/highscore	Globalna lista top 10 rezultata
GET	/api/highscore/rank/:userId	Izračun i dohvat ranga specifičnog korisnika

3.4. Administracija

Administrativne rute zaštićene su posredničkom logikom (middleware) koja validira JWT i provjerava postojanje admin prava u korisničkom profilu.

Metoda	Endpoint	Opis	Auth
POST	/api/admin/words	Dodavanje novih riječi u sustav
GET	/api/admin/words	Administrativni pregled svih riječi
DELETE	/api/admin/words/:id	Uklanjanje riječi iz baze podataka

4. Detalji baze podataka i korisničke uloge

Sustav koristi MongoDB Atlas za pohranu podataka. Dokumentacijski model (schema) za korisnika uključuje polja: username, password (osiguran bcrypt algoritmom), role (default: 'user') i score.

Sigurnosni aspekt pohrane lozinki riješen je jednosmjernim hashiranjem prije same perzistencije u bazu, čime se sprječava kompromitacija podataka u slučaju neovlaštenog pristupa. Za pristup administratorskim alatima, sustav ne dopušta samostalnu promociju korisnika. Potrebno je ručno intervenirati u bazu podataka (Atlas sučelje ili MongoDB Compass) i promijeniti polje role u vrijednost "admin" za željenog korisnika.

5. Instalacija i konfiguracija sustava

Postupak instalacije podijeljen je u tri logičke cjeline kako bi se osigurala ispravna povezanost servisa.

5.1. Konfiguracija baze podataka

1. Na MongoDB Atlas platformi kreirati klaster i Database User-a s pripadajućim vjerodajnicama.
2. U "Network Access" sekciji postaviti IP adresu na 0.0.0.0/0. Napomena: Ovo je prihvatljivo za razvojno okruženje, dok bi se u produkciji pristup trebao ograničiti na specifičnu IP adresu servera.
3. Preuzeti Connection String za integraciju s backendom.

5.2. Postavljanje Backenda

1. Navigirati u backend direktorij.
2. Instalirati potrebne module naredbom: npm install.
3. Konfigurirati .env datoteku s MONGODB_URI i JWT_SECRET varijablama.
4. Pokrenuti server naredbom: node app.js (ili npm start).

5.3. Postavljanje Frontenda

1. Navigirati u frontend direktorij.
2. Instalirati ovisnosti naredbom: npm install.
3. U .env datoteci postaviti URL backenda (npr. VITE_API_URL=http://localhost:3000).
4. Pokrenuti razvojno okruženje naredbom: npm run dev. Aplikacija će biti dostupna na portu 5173.

6. Analiza migracije: Firebase na Express/MongoDB

Migracija s Firebase platforme na vlastiti tehnološki stog poduzeta je radi eliminacije "vendor lock-in" efekta, postizanja veće kontrole nad autentifikacijskim tijekom te fleksibilnijeg indeksiranja podataka u MongoDB-u. Umjesto korištenja Firebase SDK-a koji diktira strukturu aplikacije, sustav sada koristi standardne HTTP pozive putem Axiosa prema kontroliranom API-ju.

Element	Prije (Firebase)	Poslije (Express + MongoDB)
Autentifikacija	Firebase Auth	JWT + bcrypt
Baza podataka	Firestore	MongoDB Atlas + Mongoose
Pristup podacima (Auth)	firebase/auth SDK	Axios → /api/auth/*
Pristup podacima (Logic)	firebase/firestore SDK	Axios → /api/quiz/*
Praćenje stanja	onAuthStateChanged()	localStorage token + provjera na mountu
Upravljanje pravima	Hardkodiran ownerEmail	Dinamičko polje role: 'admin'
Konfiguracija	Firebase config	MongoDB URI + JWT_SECRET

7. Testiranje sustava

Kvaliteta i stabilnost API-ja osigurana je testiranjem pomoću Postman alata. Fokus testiranja bio je na validaciji endpointova i provjeri ispravnosti HTTP statusnih kodova:

* 200 OK / 201 Created: Potvrda uspješne registracije, prijave i dohvata podataka.
* 401 Unauthorized: Provjera nemogućnosti pristupa zaštićenim rutama bez ispravnog JWT tokena.
* 403 Forbidden: Validacija zabrane pristupa administratorskim rutama za korisnike s ulogom 'user'.
* Endpoint Validation: Provjera integriteta podataka kod javnih ruta poput Highscore tablice.

1. Zaključak

Implementirani sustav uspješno demonstrira prelazak s gotovih rješenja na prilagođenu klijent-poslužitelj arhitekturu, čime se dobiva na sigurnosti i skalabilnosti. Korištenje DeepAI servisa omogućuje beskonačnu varijabilnost sadržaja kviza, dok JWT arhitektura pruža robusnu zaštitu korisničkih podataka.
