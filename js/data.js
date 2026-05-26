/* ═══════════════════════════════════════════════════════════
   SURVIVOR'S GAMBIT — DATA
   ═══════════════════════════════════════════════════════════ */

const AVATARS = [
  '🦁','🐺','🦊','🐯','🐻','🐼','🦝','🐸',
  '🦅','🐢','🐋','🦈','🦎','🦉','🐗','🦬'
];

const DISCUSSION_PROMPTS = [
  "Which of your traits helped in more than one challenge? Why do you think it was so useful?",
  "Did a trait that seemed strong suddenly become weak? What does that tell us about changing environments?",
  "If you could swap one of your three traits after seeing all the challenges, which would you change — and what would you give up?",
  "Why do you think no animal in real life is perfectly adapted to every environment?"
];

const TRAITS = [
  // STRUCTURAL
  { id:1,  name:"Thick Fur",        icon:"🧥", type:"structural",  typeLabel:"🐾 Body",     desc:"Keeps you warm in freezing weather." },
  { id:2,  name:"Sharp Claws",      icon:"🦅", type:"structural",  typeLabel:"🐾 Body",     desc:"Fight attackers and grip prey tightly." },
  { id:3,  name:"Long Legs",        icon:"🦒", type:"structural",  typeLabel:"🐾 Body",     desc:"Run fast, wade through deep water or snow." },
  { id:4,  name:"Webbed Feet",      icon:"🦆", type:"structural",  typeLabel:"🐾 Body",     desc:"Swim quickly through floods and marshes." },
  { id:5,  name:"Camouflage Coat",  icon:"🦎", type:"structural",  typeLabel:"🐾 Body",     desc:"Blends into the background — hard to spot." },
  { id:6,  name:"Long Neck",        icon:"🦒", type:"structural",  typeLabel:"🐾 Body",     desc:"Reach food high up in trees." },
  { id:7,  name:"Big Ears",         icon:"🐇", type:"structural",  typeLabel:"🐾 Body",     desc:"Hear danger far away; also lose heat in hot weather." },
  { id:8,  name:"Strong Beak",      icon:"🦜", type:"structural",  typeLabel:"🐾 Body",     desc:"Crack hard seeds, nuts, or shells." },
  { id:9,  name:"Large Eyes",       icon:"🦉", type:"structural",  typeLabel:"🐾 Body",     desc:"See very well in the dark." },
  { id:10, name:"Hard Shell",       icon:"🐢", type:"structural",  typeLabel:"🐾 Body",     desc:"Tough armour predators cannot bite through." },
  { id:11, name:"Thick Fat Layer",  icon:"🐋", type:"structural",  typeLabel:"🐾 Body",     desc:"Stores energy and keeps you warm in cold water." },
  { id:12, name:"Sticky Tongue",    icon:"🐸", type:"structural",  typeLabel:"🐾 Body",     desc:"Grab insects or small prey from a distance." },
  // BEHAVIOURAL
  { id:13, name:"Nocturnal",        icon:"🌙", type:"behavioural", typeLabel:"🧠 Behaviour",desc:"Sleep in the day; hunt and move at night." },
  { id:14, name:"Burrowing",        icon:"🐹", type:"behavioural", typeLabel:"🧠 Behaviour",desc:"Dig underground to hide, keep cool, or stay safe." },
  { id:15, name:"Playing Dead",     icon:"🎭", type:"behavioural", typeLabel:"🧠 Behaviour",desc:"Freeze and pretend to be dead so predators lose interest." },
  { id:16, name:"Hibernation",      icon:"😴", type:"behavioural", typeLabel:"🧠 Behaviour",desc:"Sleep deeply through winter on stored body fat." },
  { id:17, name:"Alarm Call",       icon:"📢", type:"behavioural", typeLabel:"🧠 Behaviour",desc:"Loud cry that tells your family to hide." },
  { id:18, name:"Pack Hunting",     icon:"🐺", type:"behavioural", typeLabel:"🧠 Behaviour",desc:"Work as a team to catch prey bigger than yourself." },
  { id:19, name:"Seasonal Migration",icon:"🦅",type:"behavioural", typeLabel:"🧠 Behaviour",desc:"Travel far to find warmer weather or more food." },
  { id:20, name:"Storing Food",     icon:"🐿️", type:"behavioural", typeLabel:"🧠 Behaviour",desc:"Hide extra food to eat later when supplies run out." }
];

const CHALLENGES = [
  {
    id:"c1", title:"Blistering Heat Wave", icon:"☀️",
    desc:"The sun beats down. Puddles dry up in hours. Shade is impossible to find.",
    strong:["Big Ears","Burrowing","Nocturnal"],
    weak:["Thick Fur","Thick Fat Layer"],
    explanations:{
      strong:"Big Ears lose heat fast. Burrowing lets you escape underground where it's cool. Being Nocturnal means you avoid the hottest part of the day.",
      weak:"Thick Fur and a Thick Fat Layer trap heat inside your body — the exact opposite of what you need!",
      partial:"Your trait gives a small edge, but doesn't directly help with the burning heat."
    }
  },
  {
    id:"c2", title:"Freezing Blizzard", icon:"❄️",
    desc:"Snow piles up. Wind howls. Food is hidden deep under thick snow.",
    strong:["Thick Fur","Thick Fat Layer","Hibernation","Storing Food"],
    weak:["Big Ears","Camouflage Coat"],
    explanations:{
      strong:"Thick Fur and Fat keep warmth in. Hibernation lets you sleep through winter. Storing Food means you have supplies even when everything is buried.",
      weak:"Big Ears lose precious body heat fast. A dark Camouflage Coat stands out against white snow — making you easy to spot!",
      partial:"Your trait helps a little, but doesn't directly tackle the cold or the food shortage."
    }
  },
  {
    id:"c3", title:"Raging Flood", icon:"🌊",
    desc:"Rivers burst their banks. Land is covered in fast-flowing water.",
    strong:["Webbed Feet","Long Legs","Seasonal Migration"],
    weak:["Burrowing","Strong Beak"],
    explanations:{
      strong:"Webbed Feet let you swim through the flood. Long Legs help you wade without being swept away. Migration lets you leave before the worst hits.",
      weak:"Burrowing is useless — your burrow fills with water! A Strong Beak can't help you swim.",
      partial:"Your trait doesn't directly help you move through or escape the floodwaters."
    }
  },
  {
    id:"c4", title:"Ambush Predator!", icon:"🐆",
    desc:"A predator waits silently behind a bush, ready to pounce.",
    strong:["Camouflage Coat","Big Ears","Alarm Call"],
    weak:["Pack Hunting","Playing Dead"],
    explanations:{
      strong:"A Camouflage Coat means the predator doesn't see you. Big Ears pick up the sound of creeping. An Alarm Call warns you in time to flee.",
      weak:"Pack Hunting needs teammates — you're alone! Playing Dead against a powerful ambush hunter is very risky.",
      partial:"Your trait gives a small benefit but doesn't directly stop or avoid the ambush."
    }
  },
  {
    id:"c5", title:"Night-time Attack", icon:"🦉",
    desc:"A hungry owl hunts in total darkness. It can see and hear perfectly.",
    strong:["Large Eyes","Nocturnal","Burrowing"],
    weak:["Long Neck","Strong Beak"],
    explanations:{
      strong:"Large Eyes let you see the owl coming. Being Nocturnal means you're alert at night. Burrowing keeps you safe from aerial attack.",
      weak:"A Long Neck makes you more visible. A Strong Beak is no use against an owl swooping silently from above.",
      partial:"Your trait gives a small edge but doesn't help you detect or escape a silent night-time hunter."
    }
  },
  {
    id:"c6", title:"Deep Snow & Buried Food", icon:"🌨️",
    desc:"A thick white blanket covers everything. Seeds and plants are trapped underneath.",
    strong:["Long Legs","Storing Food","Hibernation"],
    weak:["Webbed Feet","Camouflage Coat"],
    explanations:{
      strong:"Long Legs let you wade through deep snow. Storing Food means you already have a stash! Hibernation lets you sleep until the snow melts.",
      weak:"Webbed Feet are built for water, not snow. A dark Camouflage Coat makes you stand out against white snow.",
      partial:"Your trait doesn't directly help you find buried food or cope with deep snow."
    }
  },
  {
    id:"c7", title:"Drought — Water Disappears", icon:"🏜️",
    desc:"No rain for months. Waterholes shrink to cracked mud.",
    strong:["Thick Fat Layer","Storing Food","Seasonal Migration"],
    weak:["Webbed Feet","Sharp Claws"],
    explanations:{
      strong:"A Thick Fat Layer stores energy when resources vanish. Storing Food helps you last. Migration lets you travel to a wetter region.",
      weak:"Webbed Feet need water — totally useless in a drought! Sharp Claws can't help you survive without a drink.",
      partial:"Your trait offers a minor advantage but doesn't tackle the core problem of water scarcity."
    }
  },
  {
    id:"c8", title:"Forest Fire!", icon:"🔥",
    desc:"Flames race through the trees. Smoke fills the air. Escape fast!",
    strong:["Long Legs","Seasonal Migration","Alarm Call"],
    weak:["Hibernation","Hard Shell"],
    explanations:{
      strong:"Long Legs let you outrun the fire. Migration means you can travel far away quickly. An Alarm Call warns your family — everyone gets a head start.",
      weak:"Hibernation is catastrophic — you can't wake up quickly enough! A Hard Shell is too heavy to sprint in.",
      partial:"Your trait helps a little but isn't ideal for escaping a fast-moving wildfire."
    }
  },
  {
    id:"c9", title:"Dense Thick Forest", icon:"🌳",
    desc:"Trees so close together you can barely squeeze through. Shadows everywhere.",
    strong:["Camouflage Coat","Playing Dead","Nocturnal"],
    weak:["Long Legs","Long Neck"],
    explanations:{
      strong:"A Camouflage Coat lets you vanish among dappled shadows. Playing Dead works brilliantly in dense undergrowth. Being Nocturnal gives you the advantage after dark.",
      weak:"Long Legs trip on roots. A Long Neck keeps catching on low branches!",
      partial:"Your trait offers a small benefit but the dense forest limits most advantages."
    }
  },
  {
    id:"c10", title:"Open Grassland — Nowhere to Hide", icon:"🌾",
    desc:"A flat plain with no bushes, no rocks. A hawk circles high above.",
    strong:["Camouflage Coat","Alarm Call","Pack Hunting"],
    weak:["Playing Dead","Burrowing"],
    explanations:{
      strong:"A Camouflage Coat blends you into pale grass. An Alarm Call gives your group time to scatter. Pack Hunting makes you a bigger, more intimidating target.",
      weak:"Playing Dead in plain sight just makes you look like an easy meal! Burrowing is too slow when you're completely exposed.",
      partial:"Your trait helps a little on open ground but doesn't directly help you hide or deter the hawk."
    }
  },
  {
    id:"c11", title:"Food Bonanza — Hard Seeds!", icon:"🌰",
    desc:"A huge crop of tough, hard-shelled seeds covers the ground.",
    strong:["Strong Beak","Storing Food","Sharp Claws"],
    weak:["Sticky Tongue","Big Ears"],
    explanations:{
      strong:"A Strong Beak cracks shells easily. Storing Food lets you collect masses and save them. Sharp Claws help crack and grip tough seeds.",
      weak:"A Sticky Tongue catches insects — useless against hard seeds. Big Ears are no help at all for cracking shells.",
      partial:"Your trait gives a minor advantage but isn't built for cracking hard shells."
    }
  },
  {
    id:"c12", title:"Swampy Marshland", icon:"🐊",
    desc:"Soft, squelchy mud everywhere with pools of murky water.",
    strong:["Webbed Feet","Long Legs","Sticky Tongue"],
    weak:["Thick Fur","Hard Shell"],
    explanations:{
      strong:"Webbed Feet let you swim through muddy pools. Long Legs keep your body above soggy ground. A Sticky Tongue is perfect for snapping up frogs and marsh insects.",
      weak:"Thick Fur soaks up water and becomes extremely heavy! A Hard Shell sinks in soft mud.",
      partial:"Your trait gives a small edge but the swamp still makes life very difficult."
    }
  }
];

/* Pre-compute strong/weak id arrays */
CHALLENGES.forEach(ch => {
  ch.strongIds = ch.strong.map(name => {
    const t = TRAITS.find(t => t.name === name);
    if (!t) console.warn('No trait found for:', name);
    return t ? t.id : null;
  }).filter(Boolean);

  ch.weakIds = ch.weak.map(name => {
    const t = TRAITS.find(t => t.name === name);
    if (!t) console.warn('No trait found for:', name);
    return t ? t.id : null;
  }).filter(Boolean);
});

/* Fisher-Yates shuffle */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}