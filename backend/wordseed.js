import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const words = [
  // Animals
  "dog", "cat", "elephant", "tiger", "lion", "giraffe", "zebra", "penguin", "dolphin", "whale",
  "eagle", "owl", "parrot", "flamingo", "peacock", "butterfly", "ladybug", "spider", "octopus", "shark",
  "bear", "wolf", "fox", "deer", "rabbit", "squirrel", "hedgehog", "koala", "panda", "kangaroo",
  "crocodile", "turtle", "frog", "snake", "chameleon", "gorilla", "chimpanzee", "horse", "cow", "pig",
  "chicken", "duck", "goose", "swan", "bee", "ant", "dragonfly", "seahorse", "jellyfish", "starfish",

  // Food & Drinks
  "pizza", "hamburger", "sushi", "taco", "pasta", "bread", "cheese", "butter", "egg", "bacon",
  "pancake", "waffle", "donut", "cupcake", "cake", "cookie", "chocolate", "ice cream", "popcorn", "pretzel",
  "apple", "banana", "orange", "strawberry", "watermelon", "grapes", "pineapple", "mango", "cherry", "lemon",
  "avocado", "tomato", "carrot", "broccoli", "mushroom", "onion", "potato", "corn", "pepper", "garlic",
  "coffee", "tea", "juice", "milk", "wine", "beer", "smoothie", "lemonade", "soup", "salad",

  // Nature & Weather
  "mountain", "volcano", "waterfall", "river", "lake", "ocean", "beach", "island", "desert", "forest",
  "rainbow", "lightning", "tornado", "snowflake", "sunrise", "sunset", "moon", "star", "cloud", "rain",
  "tree", "flower", "rose", "sunflower", "cactus", "palm tree", "mushroom", "leaf", "grass", "bamboo",

  // Transport
  "car", "bus", "train", "airplane", "helicopter", "bicycle", "motorcycle", "boat", "submarine", "rocket",
  "truck", "taxi", "ambulance", "fire truck", "tractor", "skateboard", "scooter", "canoe", "sailboat", "hot air balloon",

  // Buildings & Places
  "house", "castle", "church", "mosque", "temple", "lighthouse", "bridge", "skyscraper", "windmill", "barn",
  "hospital", "school", "library", "museum", "stadium", "airport", "prison", "factory", "restaurant", "hotel",
  "pyramid", "colosseum", "igloo", "tent", "cabin", "palace", "tower", "fountain", "statue", "monument",

  // Objects & Tools
  "clock", "watch", "compass", "telescope", "microscope", "camera", "phone", "laptop", "keyboard", "mouse",
  "hammer", "screwdriver", "wrench", "scissors", "knife", "sword", "shield", "key", "lock", "chain",
  "umbrella", "backpack", "suitcase", "wallet", "glasses", "mirror", "candle", "lamp", "flashlight", "lantern",
  "book", "newspaper", "envelope", "pencil", "paintbrush", "eraser", "ruler", "globe", "map", "calendar",
  "chair", "table", "bed", "sofa", "door", "window", "stairs", "ladder", "fence", "mailbox",
  "bucket", "broom", "mop", "vacuum", "iron", "pan", "pot", "plate", "cup", "fork",
  "spoon", "bottle", "jar", "basket", "rope", "net", "hook", "bell", "whistle", "drum",

  // Clothing & Accessories
  "hat", "crown", "helmet", "scarf", "gloves", "boots", "sneakers", "sandals", "tie", "belt",
  "dress", "shirt", "jacket", "sweater", "jeans", "skirt", "ring", "necklace", "bracelet", "earring",

  // Music & Instruments
  "guitar", "piano", "violin", "drums", "trumpet", "flute", "saxophone", "harp", "accordion", "microphone",

  // Sports & Games
  "football", "basketball", "tennis", "baseball", "golf", "boxing", "surfing", "skiing", "chess", "dice",
  "trophy", "medal", "dartboard", "bowling", "volleyball", "hockey", "archery", "skateboard", "trampoline", "parachute",

  // People & Body
  "baby", "astronaut", "pirate", "knight", "wizard", "ninja", "clown", "chef", "firefighter", "pilot",
  "eye", "hand", "heart", "brain", "skull", "skeleton", "muscle", "tooth", "ear", "nose",

  // Fantasy & Mythology
  "dragon", "unicorn", "mermaid", "phoenix", "fairy", "ghost", "vampire", "werewolf", "alien", "robot",
  "treasure", "crystal", "potion", "wand", "spell", "throne", "dungeon", "maze", "portal", "spaceship",

  // Technology
  "satellite", "antenna", "battery", "magnet", "laser", "radar", "drone", "printer", "projector", "speaker",
  "headphones", "joystick", "controller", "monitor", "server", "circuit", "chip", "cable", "plug", "switch",

  // Space
  "planet", "saturn", "mars", "jupiter", "comet", "asteroid", "galaxy", "nebula", "constellation", "eclipse",
  "meteor", "black hole", "astronaut", "telescope", "orbit", "crater", "solar panel", "space station", "rover", "satellite",

  // Emotions & Concepts (visual)
  "fire", "explosion", "smoke", "wave", "spiral", "bubble", "shadow", "reflection", "silhouette", "fingerprint",
  "puzzle", "maze", "target", "arrow", "crown", "flag", "anchor", "compass", "hourglass", "infinity",

  // Everyday Scenes
  "playground", "garden", "kitchen", "bathroom", "bedroom", "garage", "balcony", "rooftop", "basement", "attic",
  "market", "carnival", "circus", "parade", "concert", "wedding", "birthday", "campfire", "picnic", "barbecue",

  // Misc
  "diamond", "gold", "silver", "pearl", "ruby", "emerald", "sapphire", "crystal ball", "snowman", "scarecrow",
  "totem", "mask", "puppet", "kite", "balloon", "fireworks", "confetti", "ribbon", "gift", "treasure chest",
  "piano", "violin", "typewriter", "gramophone", "jukebox", "pinball", "arcade", "carousel", "ferris wheel", "rollercoaster"
]

async function seed() {
  const client = new MongoClient(process.env.MONGO_URI)

  try {
    await client.connect()
    const db = client.db(process.env.DB_NAME)
    const collection = db.collection('words')

    // Remove duplicates from array
    const uniqueWords = [...new Set(words.map(w => w.toLowerCase().trim()))]

    // Check existing words
    const existing = await collection.find({}).toArray()
    const existingSet = new Set(existing.map(w => w.word))

    const newWords = uniqueWords
      .filter(w => !existingSet.has(w))
      .map(w => ({ word: w, createdAt: new Date() }))

    if (newWords.length === 0) {
      console.log('⚠️  No new words to add. All words already exist.')
    } else {
      const result = await collection.insertMany(newWords)
      console.log(`✅ Inserted ${result.insertedCount} new words`)
    }

    const total = await collection.countDocuments()
    console.log(`📊 Total words in database: ${total}`)

  } catch (err) {
    console.error('❌ Seed error:', err.message)
  } finally {
    await client.close()
  }
}

seed()
