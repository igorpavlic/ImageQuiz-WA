# 🧠 Image Quiz

Interaktivna kviz aplikacija gdje korisnici pogađaju što prikazuje AI-generirana slika.

## Tehnologije

| Sloj | Tehnologija |
|------|-------------|
| Frontend | Vue.js 3 (Composition API) + Vite |
| Backend | Node.js + Express.js |
| Baza podataka | MongoDB Atlas (službeni `mongodb` driver) |
| Autentifikacija | JWT (JSON Web Tokens) + bcryptjs |
| AI slike | DeepAI Text-to-Image API |
| HTTP klijent | Axios |
| Testiranje API-ja | Postman |

> **Napomena:** baza se koristi izravno preko službenog `mongodb` drivera
> (`MongoClient` + `db.collection(...)`), bez ODM sloja poput Mongoosea.

## Struktura projekta

```
image-quiz-project/
├── backend/
│   ├── config/db.js            # MongoDB konekcija (connectDB, getDB)
│   ├── middleware/auth.js       # JWT middleware (auth + adminOnly)
│   ├── routes/
│   │   ├── auth.js             # POST /api/auth/register, /api/auth/login
│   │   ├── quiz.js             # GET /api/quiz/words, GET|PATCH /api/quiz/score
│   │   ├── highscore.js        # GET /api/highscore, /api/highscore/rank/:id
│   │   └── admin.js            # POST|GET|DELETE /api/admin/words
│   ├── server.js               # Express server
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/index.js        # Axios instance + JWT interceptor
│   │   ├── assets/main.css     # Stilovi
│   │   ├── components/
│   │   │   ├── Login.vue       # Login forma
│   │   │   ├── Register.vue    # Registracija
│   │   │   ├── QuizView.vue    # Kviz gameplay
│   │   │   ├── DataProvider.vue # Dohvat riječi + DeepAI (renderless)
│   │   │   ├── AdminPanel.vue  # Admin dodavanje/brisanje riječi
│   │   │   ├── Highscore.vue   # Top 10 igrača
│   │   │   ├── Header.vue
│   │   │   └── Footer.vue
│   │   ├── App.vue             # korijenska komponenta (uvjetni prikaz ekrana)
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js          # Vite + proxy na backend
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

> **Napomena o usmjeravanju:** aplikacija ne koristi Vue Router. Korijenska
> komponenta `App.vue` uvjetno prikazuje ekrane ovisno o stanju prijave (`user`)
> i odabranom načinu (`login` / `register`); admin panel se prikazuje samo kad
> je `user.role === 'admin'`.

## REST API Endpoints

### Auth
| Metoda | Endpoint | Opis | Auth |
|--------|----------|------|------|
| POST | `/api/auth/register` | Registracija korisnika | ❌ |
| POST | `/api/auth/login` | Prijava korisnika | ❌ |

### Quiz
| Metoda | Endpoint | Opis | Auth |
|--------|----------|------|------|
| GET | `/api/quiz/words` | Dohvati sve riječi | ✅ JWT |
| GET | `/api/quiz/score` | Dohvati score korisnika | ✅ JWT |
| PATCH | `/api/quiz/score` | Ažuriraj score | ✅ JWT |

### Highscore
| Metoda | Endpoint | Opis | Auth |
|--------|----------|------|------|
| GET | `/api/highscore` | Top 10 igrača | ❌ |
| GET | `/api/highscore/rank/:userId` | Rank korisnika | ❌ |

### Admin
| Metoda | Endpoint | Opis | Auth |
|--------|----------|------|------|
| POST | `/api/admin/words` | Dodaj riječi | ✅ JWT + Admin |
| GET | `/api/admin/words` | Listaj sve riječi | ✅ JWT + Admin |
| DELETE | `/api/admin/words/:id` | Obriši riječ | ✅ JWT + Admin |

### Ostalo
| Metoda | Endpoint | Opis | Auth |
|--------|----------|------|------|
| GET | `/api/health` | Provjera stanja poslužitelja | ❌ |

## Instalacija

### 1. MongoDB Atlas

1. Idi na [mongodb.com/atlas](https://www.mongodb.com/atlas) i kreiraj besplatni klaster
2. Kreiraj Database User (username + password)
3. U Network Access dodaj `0.0.0.0/0` (Allow Access from Anywhere)
4. Kopiraj Connection String

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Uredi `.env`:
```
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net
DB_NAME=image-quiz
JWT_SECRET=promijeni_ovo_u_random_string_min_32_znaka
```

> **Važno:** naziv baze čita se iz `DB_NAME` (`client.db(process.env.DB_NAME)`),
> a ne iz putanje u `MONGO_URI`. Ako `DB_NAME` izostane, konekcija će ciljati
> nedefiniranu bazu.

Pokreni:
```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Uredi `.env`:
```
VITE_API_URL=http://localhost:3000/api
VITE_DEEPAI_API_KEY=tvoj_deepai_api_key
```

Pokreni:
```bash
npm run dev
```

Aplikacija će biti na `http://localhost:5173`

### 4. Kreiranje admin korisnika

Registriraj se normalno, zatim u MongoDB Compassu ili Atlasu promijeni `role` polje na `"admin"`:

```javascript
db.users.updateOne(
  { email: "tvoj@email.com" },
  { $set: { role: "admin" } }
)
```

## Postman testiranje

Importiraj `postman-collection.json` u Postman i testiraj sve endpointe:

### Register
```
POST http://localhost:3000/api/auth/register
Body (JSON): { "email": "test@test.com", "password": "123456" }
```

### Login
```
POST http://localhost:3000/api/auth/login
Body (JSON): { "email": "test@test.com", "password": "123456" }
→ Kopiraj token iz responsea
```

### Get Words (zaštićeno)
```
GET http://localhost:3000/api/quiz/words
Headers: Authorization: Bearer <token>
```

### Update Score (zaštićeno)
```
PATCH http://localhost:3000/api/quiz/score
Headers: Authorization: Bearer <token>
Body (JSON): { "score": 5 }
```

### Highscores (javno)
```
GET http://localhost:3000/api/highscore
```

### Add Words (admin)
```
POST http://localhost:3000/api/admin/words
Headers: Authorization: Bearer <admin_token>
Body (JSON): { "words": ["dog", "car", "house", "tree"] }
```

## Migracija: Firebase → Express + MongoDB

| Prije (Firebase) | Poslije (Express + MongoDB) |
|---|---|
| Firebase Auth | JWT + bcryptjs |
| Firestore | MongoDB Atlas (`mongodb` driver) |
| `firebase/auth` SDK | Axios → `/api/auth/*` |
| `firebase/firestore` SDK | Axios → `/api/quiz/*`, `/api/highscore/*` |
| `onAuthStateChanged()` | localStorage token + provjera na mount |
| `signInWithEmailAndPassword()` | `POST /api/auth/login` |
| `createUserWithEmailAndPassword()` | `POST /api/auth/register` |
| `getDocs(collection(db, 'words'))` | `GET /api/quiz/words` |
| `updateDoc(doc(db, 'users', uid))` | `PATCH /api/quiz/score` |
| Hardkodiran ownerEmail | `role: 'admin'` u MongoDB |
| Firebase config (.env) | MongoDB URI + JWT_SECRET (.env) |

## Poznata ograničenja

- **Manipulacija rezultatom:** `PATCH /api/quiz/score` prihvaća proizvoljnu
  vrijednost s klijenta. Sigurnije rješenje je provjera odgovora na poslužitelju.
- **DeepAI ključ na klijentu:** `VITE_DEEPAI_API_KEY` je ugrađen u frontend i
  poziva se izravno iz preglednika; razmotriti posredovanje preko backenda.
- **Stroga usporedba odgovora:** ne podržava sinonime, množinu ni manje
  pravopisne pogreške.

## Autor

Igor Pavlić - FIPU Web Applications 25/26
