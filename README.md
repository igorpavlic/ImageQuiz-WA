# ImageQuiz-WA

ImageQuiz-WA je interaktivna web aplikacija razvijena u sklopu kolegija Web aplikacije na FIPU. Glavna funkcionalnost aplikacije je kviz u kojem korisnici pogađaju pojmove na temelju slika generiranih pomoću umjetne inteligencije.

## Tehnologije

Projekt koristi moderan tehnološki stog za full-stack razvoj:

- Frontend: Vue.js 3 (Composition API) uz Vite razvojni alat.
- Backend: Node.js i Express.js okvir.
- Baza podataka: MongoDB (Atlas) uz Mongoose ODM.
- Autentifikacija: JSON Web Tokens (JWT) i bcrypt za enkripciju lozinki.
- AI integracija: DeepAI Text-to-Image API.
- HTTP klijent: Axios.
- Testiranje: Postman.

## REST API Endpoints

### Autentifikacija
| Metoda | Endpoint | Opis | Autentifikacija |
|---|---|---|---|
| POST | /api/auth/register | Registracija novog korisnika | Nije potrebna |
| POST | /api/auth/login | Prijava korisnika | Nije potrebna |

### Kviz i rezultati
| Metoda | Endpoint | Opis | Autentifikacija |
|---|---|---|---|
| GET | /api/quiz/words | Dohvat svih riječi za kviz | Da (JWT) |
| GET | /api/quiz/score | Dohvat bodova trenutnog korisnika | Da (JWT) |
| PATCH | /api/quiz/score | Ažuriranje korisničkih bodova | Da (JWT) |

### Ljestvica poretka (Highscore)
| Metoda | Endpoint | Opis | Autentifikacija |
|---|---|---|---|
| GET | /api/highscore | Prikaz top 10 igrača | Nije potrebna |
| GET | /api/highscore/rank/:userId | Prikaz ranga određenog korisnika | Nije potrebna |

### Administracija (Samo za admine)
| Metoda | Endpoint | Opis | Autentifikacija |
|---|---|---|---|
| POST | /api/admin/words | Dodavanje novih riječi u bazu | Da (JWT + Admin role) |
| GET | /api/admin/words | Pregled svih riječi u bazi | Da (JWT + Admin role) |
| DELETE | /api/admin/words/:id | Brisanje riječi iz baze | Da (JWT + Admin role) |

## Instalacija i postavljanje

### 1. Baza podataka (MongoDB Atlas)
1. Kreirajte besplatni klaster na mongodb.com/atlas.
2. Izradite Database User (korisničko ime i lozinka).
3. U Network Access postavkama dopustite pristup s bilo koje adrese (0.0.0.0/0).
4. Kopirajte Connection String za povezivanje.

### 2. Backend postavljanje
1. Navigirajte u direktorij /backend.
2. Kreirajte .env datoteku i definirajte varijable: MONGO_URI, JWT_SECRET i PORT.
3. Pokrenite naredbe:
   npm install
   node index.js

### 3. Frontend postavljanje
1. Navigirajte u direktorij /frontend.
2. Kreirajte .env datoteku i definirajte VITE_API_BASE_URL.
3. Pokrenite naredbe:
   npm install
   npm run dev
4. Aplikacija će biti dostupna na adresi http://localhost:5173.

### 4. Postavljanje administratora
Nakon standardne registracije putem aplikacije, potrebno je ručno promijeniti polje "role" na "admin" unutar MongoDB Atlas sučelja ili MongoDB Compassa za željenog korisnika.

## Migracija: s Firebase-a na Express + MongoDB

Projekt je prošao značajnu arhitektonsku promjenu radi veće kontrole nad podacima i logikom:
- Firebase Auth zamijenjen je vlastitim JWT + bcrypt sustavom.
- Cloud Firestore zamijenjen je MongoDB Atlas bazom podataka.
- Firebase SDK zamijenjen je standardnim Axios HTTP zahtjevima prema vlastitom backendu.
- Autentifikacija se održava putem lokalne pohrane (localStorage) i provjere tokena pri učitavanju.

## Autor

**Igor Pavlić**
- GitHub: [@igorpavlic](https://github.com/igorpavlic)

## Akademske informacije

**[Fakultet informatike u Puli](https://fipu.unipu.hr/)**
- Kolegij: **[Web aplikacije](https://ntankovic.unipu.hr/wa)**
- Mentor: **[doc. dr. sc. Nikola Tanković](https://ntankovic.unipu.hr)**
