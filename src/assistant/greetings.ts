const greetings = new Map<string, string>([
  ["hi", "Hello!"],
  ["hello", "Hello!"],
  ["hey", "Hello!"],
  ["howdy", "Hello!"],
  ["good morning", "Good morning!"],
  ["good afternoon", "Good afternoon!"],
  ["good evening", "Good evening!"],
  ["namaste", "Namaste!"],
  ["namaskar", "Namaskar!"],
  ["pranam", "Pranam!"],
  ["hari om", "Hari Om!"],
  ["hari on", "Hari Om!"],
  ["ram ram", "Ram Ram!"],
  ["ram ram ji", "Ram Ram!"],
  ["jai shri ram", "Jai Shri Ram!"],
  ["jai shree ram", "Jai Shri Ram!"],
  ["radhe radhe", "Radhe Radhe!"],
  ["sat sri akal", "Sat Sri Akal!"],
  ["salaam", "Salaam!"],
  ["assalaam alaikum", "Wa alaikum salaam!"],
  ["हरि ॐ", "Hari Om!"],
  ["हरि ओम", "Hari Om!"],
  ["हरिओम", "Hari Om!"],
  ["राम राम", "Ram Ram!"],
  ["जय श्री राम", "Jai Shri Ram!"],
  ["राधे राधे", "Radhe Radhe!"],
  ["नमस्ते", "Namaste!"],
  ["नमस्कार", "Namaskar!"],
  ["प्रणाम", "Pranam!"],
]);

export function getGreetingReply(message: string): string | undefined {
  const normalizedMessage = message
    .trim()
    .replace(/[!,.?।॥]+$/u, "")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase();
  const greeting = greetings.get(normalizedMessage);

  if (!greeting) {
    return undefined;
  }

  return `${greeting} I'm Ranjeet's personal assistant. How can I help you today?`;
}
