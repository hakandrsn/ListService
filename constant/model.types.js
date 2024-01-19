// activities.js
const activity_types = ["personal", "indoor", "outdoor", "sport", "art-craft"];
const activity_category = ["home", "out", "daily"];

// hobbies.js
const hobby_types = [
  "personal",
  "home",
  "sport",
  "music",
  "painting",
  "writing",
];
const hobby_category = ["home", "out", "daily"];

// foods.js
const food_category = ["lunch", "breakfast", "dinner"];

// games.js
const game_category = ["home", "out", "daily"];
const gameplay = ["group", "personel", "team", "family"];

// travels.js
const travel_types = ["adventure", "leisure", "business", "camping"];
const travel_category = ["home", "out", "daily"];

//kullanılanlar !!
const skill_level = ["beginner", "intermediate", "advanced"];

const eventGameTypes = [
  "intelligent",
  "card",
  "talk",
  "skill",
  "sport",
  "action",
  "adventure",
  "puzzle",
  "strategy",
  "group",
  "outdoor",
  "box",
]; // okey
const eventLocation = ["personal", "indoor", "outdoor", "sport", "art-craft"];
const eventWithWho = ["alone", "family", "friends", "beloved"];
const eventKind = [
  "breakfast",
  "appetizer",
  "salad",
  "drink",
  "hot_appetizers",
  "main_food",
  "pastry",
  "soup",
]; //okey
const eventTime = ["monthly", "daily", "yearly", "regular"];
const eventTravellocation = ["anywhere", "country"];

module.exports = {
  eventLocation,
  eventWithWho,
  eventTravellocation,
  eventTime,
  activity_types,
  activity_category,
  hobby_types,
  hobby_category,
  eventKind,
  food_category,
  eventGameTypes,
  game_category,
  travel_types,
  travel_category,
  gameplay,
  skill_level,
};
