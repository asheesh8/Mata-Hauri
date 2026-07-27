export type DogStatus = "current" | "previous";

export type Dog = {
  id: string;
  name: string;
  callName: string;
  year: string;
  pedigree: string;
  image: string;
  status: DogStatus;
  notes?: string;
  alt: string;
};

export type Spotlight = {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  callout: string;
  dogStory: string;
  competitionStory: string;
  imageCaption: string;
  meta: string[];
  wins: string[];
  body: string[];
  images: string[];
};

export type Inquiry = {
  id: number;
  name: string;
  interest: string;
  stage: "New" | "Screening" | "Visit" | "Matched" | "Waitlist";
  score: number;
  notes: string;
};

export type AdminSettings = {
  heroStatus: string;
  puppyAnnouncement: string;
  litterDue: string;
  priceRange: string;
  adultAvailability: string;
  shippingPolicy: string;
  contactEmail: string;
  contactPhone: string;
  publishPuppies: boolean;
  publishAdults: boolean;
};

export const media = (path: string) => `/matahauri-media/${path}`;
export const image = (path: string) => media(`images/${path}`);

const dog = (
  name: string,
  callName: string,
  year: string,
  pedigree: string,
  src: string,
  status: DogStatus,
  notes = "",
  alt = `Basenji named ${callName}`,
): Dog => ({
  id: `${callName}-${year}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  callName,
  year,
  pedigree,
  image: image(src),
  status,
  notes,
  alt,
});

export const registryDogs: Dog[] = [
  dog("Mata Hauri Juba", "Juba", "2025", "CH Mata Hauri Shall We Dance X CH Mata Hauri Salsa in the Jungle", "our-basenjis/Juba.jpg", "current"),
  dog("Mata Hauri Oso Sassy", "Sassy", "2025", "GCHG CH Mata Hauri Virtuoso in the Jungle X GCH CH Mata Hauri Esprit Holly Berry", "our-basenjis/Sassy.jpg", "current"),
  dog("CH Mata Hauri Hazelwood", "Hazel", "2024", "GCH CH Mata Hauri Didgeridoo X GCH CH Mata Hauri Esprit Holly Berry", "our-basenjis/Hazel.jpg", "current"),
  dog("CH Mata Hauri Salsa in the Jungle", "Salsa", "2023", "GCHG CH Eldorado N'Akuaba Bungle in the Jungle X GCH CH Mata Hauri Waltzing Matilda", "our-basenjis/Salsa.jpg", "current"),
  dog("CH Mata Hauri Super Super Star", "Hollywood / Happy", "2023", "GCH CH Kivu Habit Rouge X GCH CH Mata Hauri Esprit Holly Berry", "our-basenjis/HollywoodHappy.jpg", "current"),
  dog("CH Mata Hauri Super Dill", "Pickles", "2023", "GCHB CH Mata Hauri Klassy's Last Tango X GCH CH Mata Hauri Super Nova Too", "our-basenjis/Pickles.jpg", "current"),
  dog("GCH CH Mata Hauri Super Swagman", "Swaggy", "2023", "GCHG CH Eldorado N' Akuaba Bungle in the Jungle X GCH CH Mata Hauri Waltzing Matilda", "our-basenjis/Swaggy.jpg", "current"),
  dog("GCH CH Mata Hauri Anything Goes", "Reno", "2022", "GCH CH Eldorado N Akuaba Night and Day X CH Mata Hauri Super Chi Chi", "our-basenjis/reno.jpg", "current"),
  dog("GCH CH Mata Hauri Trylight", "Tryla", "2022", "GCH CH Eldorado N Akuaba Night and Day X CH Mata Hauri Super Chi Chi", "our-basenjis/tryla.jpg", "current"),
  dog("GCH CH Mata Hauri Didgeridoo", "Didget", "2022", "GRCH CH Kivu's Habit Rouge X GRCH CH Mata Hauri Waltzing Matilda", "our-basenjis/didget.jpg", "current"),
  dog("GrCh Mata Hauri Super Nova Too", "Nova", "2021", "GR CH Kokopelli Wyans X Mata Hauri Holly Berry", "our-basenjis/Nova.jpg", "current"),
  dog("GrCh Mata Hauri Waltzing Matilda", "Matilda", "2020", "CH Eldorado N Akuaba Lucky Charmer X CH Mata Hauri Quick Step", "our-basenjis/maltilda.jpg", "current"),
  dog("GrCh Mata Hauri Holly Berry", "Holly", "2019", "GR CH Akuaba N Eldorado Night and Day X GR CH Mata Hauri Serenade in the Jungle", "our-basenjis/Holly.jpg", "current", "New Champion with Julia Bill."),
  dog("GrCh Mata Hauri Virtuoso in the Jungle", "Oso", "2018", "GrCh Eldorado N'Akuaba Bungle in the Jungle X Ch Mata Hauri Quick Step", "our-basenjis/oso.jpg", "current"),
  dog("Ch Mata Hauri Super Chi Chi", "Chi Chi", "2018", "Ch Mata Hauri Jenga X Ch Mata Hauri Super Chic Cheekie", "our-basenjis/chichi.jpg", "current"),
  dog("Gr Ch Mata Hauri Klassy's Last Tango", "Marlon", "2014", "CH Mata Hauri Shall We Dance X DC Klassic's Ms Mata Hauri", "our-basenjis/MarlonShow.jpg", "current", "Top Ten 2016."),
  dog("Gr Ch Mata Hauri Autumn Breeze", "Bree", "2013", "GGH Ch Akuaba N Eldorado Bungle in the Jungle X DC Klassic's MS Mata Hauri SC", "our-basenjis/BreeShow.jpg", "current", "Pictured at 7 weeks and as an adult."),
  dog("Ch Mata Hauri Quickstep", "Ginger", "2012", "Ch Mata Hauri Shall We Dance X DC Klassic's MS Mata Hauri SC", "our-basenjis/ginger.jpg", "current"),
  dog("Ch Mata Hauri Shall We Dance", "Tango", "2006", "Ch C-Quest Soul Driver x Ch Mata Hauri Masai Mara", "our-basenjis/tango.jpg", "current", "Shown sparingly. Winner of stud dog Re-Up Award 2014."),
  dog("CH Mata Hauri Unstoppable", "Denzel", "2022", "GRCH CH Kivu's Habit Rouge X GRCH CH Mata Hauri Waltzing Matilda", "our-basenjis/Denzel.jpg", "previous", "At first puppy show. Owned by Janice Magalis."),
  dog("Ch Pandora's Toot Toot Tootsie to Mata Hauri", "Tootsie", "2022", "GR CHG CH Mata Hauri Virtuoso in the Jungle X GR CH CH Pandora's Dark Dessert Highway", "our-basenjis/tootsie.jpg", "previous"),
  dog("Mata Hauri Esprit Cherry Blossom", "Blossom", "2021", "GRCH CH Mata Hauri Klassy's Last Tango X GRCH CH Mata Hauri Esprit Tiptoe Thru the Tulips", "our-basenjis/Blossom.jpg", "previous"),
  dog("Mata Hauri Super Sleek", "Skittles", "2018", "Ch Mata Hauri Jenga X Ch Mata Hauri Super Chic Cheekie", "our-basenjis/skittles.jpg", "previous"),
  dog("GrCh Mata Hauri Esprit Tulip", "Tulip", "2017", "GrCh Eldorado's Intrigue X GrCh Mata Hauri Seranade in the Jungle", "our-basenjis/tulip.jpg", "previous", "Co-owned with Liz Reed."),
  dog("Ch Mata Hauri Jenga", "Jenga", "2017", "GrCh Meisterhaus Puzzle Piece X Ch Mata Hauri Quick Step", "our-basenjis/jenga.jpg", "previous"),
  dog("Ch Mata Hauri Esprit Hearts and Flowers", "Fleur", "2017", "GrCh Eldorado Intrigue X GrCh Mata Hauri Seranade in the Jungle", "our-basenjis/fleur.jpg", "previous"),
  dog("Ch Mata Hauri Baloo", "Baloo", "2016", "Ch Mata Hauri Mowgli X Ch Mata Hauri Dreaming Out Loud", "our-basenjis/BalooShow.jpg", "previous", "Co-owned with Liz Reed."),
  dog("Ch Mata Hauri Fun and Frolic", "Frolic", "2016", "CH Mata Hauri Shall We Dance X GCH Mata Hauri Autumn Breeze", "our-basenjis/FunFrolicShow.jpg", "previous", "Co-owned with Liz Reed."),
  dog("Ch Mata Hauri Cinnabon", "Bonnie", "2016", "CH Mata Hauri Shall We Dance X GCH Mata Hauri Autumn Breeze", "our-basenjis/Cinnabon.jpg", "previous", "Owned and shown by Jane Cameron Johnson, with Owner Handler Best in Show."),
  dog("Ch Mata Hauri Mowgli", "Mowgli", "2015", "GCh Akuaba N Eldorado Bungle in the Jungle X CH Mata Hauri Quick Step", "our-basenjis/MowgliShow.jpg", "previous"),
  dog("Ch Mata Hauri Seranade", "Sera", "2015", "GCh Akuaba N Eldorado Bungle in the Jungle X CH Mata Hauri Quick Step", "our-basenjis/SeranadeShow.jpg", "previous", "Co-owned with Liz Reed."),
  dog("Ch Mata Hauri Coal Porter", "Porter", "2015", "GCH Eldorado N Akuaba Night And Day X Ch Mata Hauri Dreaming Out Loud", "our-basenjis/CoalPorterShow.jpg", "previous", "Co-owned with Liz Reed."),
  dog("Ch Mata Hauri Prim and Proper", "Prim", "2015", "GCh Mata Hauri Klassy's Last Tango X Ch Mata Hauri Super Chic", "our-basenjis/PrimShow.jpg", "previous", "Owned by Bob and Heidi Gill."),
  dog("Ch Mata Hauri Calypso", "So So", "2014", "Mata Hauri Super Hero at Dark Skies X CH Mata Hauri Quickstep", "our-basenjis/CalypsoShow.jpg", "previous", "Co-owned with Liz Reed."),
  dog("Ch Mata Hauri Super Chic", "Cheekie", "2013-2022", "Mata Hauri Super Hero at Dark Skies X Ch Reveille Rewind to Mata Hauri", "our-basenjis/cheeky.jpg", "previous", "Got both majors her first weekend out."),
  dog("Ch Mata Hauri Dreaming Out Loud", "Dottie", "2012", "Mata Hauri Super Swag X Ch Eldorado's In Your Dreams", "our-basenjis/dottie.jpg", "previous", "Owned and loved by Connie Allen."),
  dog("Ch Mata Hauri Playboy", "Jack", "2010", "Mata Hauri Butter Brickle X Ch Reveille Rewind to Mata Hauri", "our-basenjis/jack.jpg", "previous", "Owned by Evelyn Longo and Debbie Hauri."),
  dog("Mata Hauri Super Swag", "Jasper", "2010", "Ch Reveille Tricycle Two X DC Klassic's MS Mata Hauri SC", "our-basenjis/jasper.jpg", "previous"),
  dog("Ch Eldorado's In Your Dreams", "Dora", "2006", "Am/Can Ch Sternhimmel Generus Sui x Ch Eldorado's OhLaLa", "our-basenjis/dora.jpg", "previous"),
  dog("Ch Reveille Rewind To Mata Hauri", "Windy", "2006", "Ch C-Quest Push Play x Ch Reveille Accord", "our-basenjis/windy.jpg", "previous"),
  dog("Ch Mata Hauri Flim Flam", "Flim Flam", "2006", "Ch Vokuba-Aisa's The Reign of Freedom x Ch Mata Hauri Masai Mara", "our-basenjis/flimflam.jpg", "previous"),
  dog("Ch Mata Hauri Neapolitan", "Scoop", "2005", "DC Proudlaan Kipenzi of Taji CD MC x Mata Hauri Jester's Quetzal", "our-basenjis/scoop.jpg", "previous"),
  dog("Ch Klassic's Ms Mata Hauri SC", "Klassy", "2004-2021", "Ch. Penda Taji's Tri-Umphant One JC x MBIS Ch Klassic's Rooty Toot Toot", "our-basenjis/klassy.jpg", "previous"),
  dog("Ch Dark Skies Ablaze at Mata Hauri", "Rooster", "2004", "Mata Hauri Armani x Ch Dark Skies Zinnia", "our-basenjis/rooster.jpg", "previous", "Loved by Katy Kenny."),
  dog("Mata Hauri Armani", "Armani", "2003", "Am/Can Ch Terrarust N Beaubri Tailr Made x Ch Mata Hauri Masai Mara", "our-basenjis/armani.jpg", "previous"),
  dog("Ch Mata Hauri Samuel", "Sammy", "2003", "Ch Terrarust N Beabri Tailrmade x Ch Mata Hauri Masai Mara", "our-basenjis/sammy.jpg", "previous"),
  dog("Ch Mata Hauri Happy Camper", "Happy", "2003", "Mata Hauri Lunar Eclipse x Mata Hauri Versaci", "our-basenjis/happy.jpg", "previous"),
  dog("Ch Mata Hauri Pumpernickel", "Pumpernickel", "2002", "Ch C-Quests Last Laugh x Ch Mata Hauri Jerlin's True Fire", "our-basenjis/pumpernickel.jpg", "previous"),
  dog("Ch C-Quest Mata Hauri Dream On", "Dreamer", "2002", "Ch Alista-Arubmec Integrety x Ch C-Quest's Brilliant Disguise", "our-basenjis/dreamer.jpg", "previous"),
  dog("Ch Mata Hauri Masai Mara", "Mara", "2002", "Avongara Kasabu x Ch Mata Hauri Ambara C-Splash", "our-basenjis/mara.jpg", "previous", "First half-African and first half-African champion."),
  dog("Ch Mata Hauri Jerlin's True Light", "Flash", "2001", "Ch Reveille Tried and True x Ch Ronels Candles N Roses Verlin", "our-basenjis/flash.jpg", "previous", "Handled by Andrew Sawler to the Top Ten."),
  dog("Ch Mata Hauri True Fire", "Sparkle", "2001", "Ch Reveille Tried and True x Ch Ronels Candles N Roses Jerlin", "our-basenjis/sparkle.jpg", "previous"),
  dog("Ch Mata Hauri Ambara C-Splash", "Splash", "2000", "Ch C-Quests Soul Driver x Mata Hauri Ambara Wimbi", "our-basenjis/splash.jpg", "previous"),
  dog("Ch Mata Hauri Ambara C-Ripples", "Ripple", "2000", "Ch C-Quests Soul Driver x Mata Hauri Ambara Wimbi", "our-basenjis/ripples.jpg", "previous", "Owned by Dee Foster."),
  dog("Ch Mata Hauri Briar-Patch", "Briar", "1996", "Ch Changa's Dan Patch x Mata Hauri Baladi", "our-basenjis/briar.jpg", "previous", "Debbie's first Brindle and buddy for almost 14 years."),
  dog("Winart's Prince of the Hearts CD", "Gigolo", "1992", "Winart's KC x Winart's Destiny", "our-basenjis/gigolo.jpg", "previous", "Fun in obedience."),
  dog("Ch Mata Hauri Carbonation", "Carbonation", "1987", "Am/Can Ch Mata Hauri Attalah Moxie x Ch Madhara Mata Hauri Silhouette", "our-basenjis/carbonation.jpg", "previous"),
  dog("Ch Mata Hauri Miss Teree", "Re", "1986", "Am/Can Ch Mata Hauri Super Sheik CD x Ch Madhara Mata Hauri Silhouette", "our-basenjis/re.jpg", "previous"),
  dog("Am/Can Ch Mata Hauri First Derby", "Derby", "1986", "Ch Mata Hauri Hearthside Sheba", "our-basenjis/derby.jpg", "previous"),
  dog("Am/Can Ch Mata Hauri Rosette", "Rose", "1986", "Ch Arabrac's Run for the Roses x Ch Mata Hauri Hearthside Sheba", "our-basenjis/rose.jpg", "previous", "Owned, shown and loved by junior handler Katrin Hauri for 15 years."),
  dog("Am/Can Ch Mata Hauri Attallah Moxie", "Moxie", "1985", "Ch Keset's Wayfarer from Asbah x Ch Mata Hauri Hearthside Sprite", "our-basenjis/moxie.jpg", "previous", "One of five Soda Pups to finish from Sprite's first litter."),
  dog("Am/Can Ch Mata Hauri Super Sheik CD", "Sheik", "1980", "Am/Can Ch Khajah's Gay Santiago x Mata Hauri Sweet Surprise", "our-basenjis/sheik.jpg", "previous", "Debbie's first Tri and a wonderful obedience companion."),
  dog("Am/Can Ch Mata Hauri Hai Karate", "Karate", "1979", "Ch Trotwood's Hercules of Anubis x Am/Mex Ch Mata Hauri Christabel", "our-basenjis/karate.jpg", "previous", "1981 number one Basenji in BOB and number five in Wessan's points. Handled by Bob House."),
  dog("Am/Can Ch Mata Hauri Super Sleuth", "Sleuth", "1974", "Ch Khajah's Gay Excalibur x Can Ch Foxy Mata Hauri", "our-basenjis/sleuth.jpg", "previous", "Debbie's first champion and Top Ten Basenji."),
];

export const spotlights: Spotlight[] = [
  {
    id: "oso",
    name: "Oso",
    title: "BIS BISS GCHG CH Mata Hauri Virtuoso in the Jungle",
    subtitle: "Best in Show at the 2022 Basenji Club of America National Specialty and Number 1 Basenji in 2021.",
    callout: "A fast-maturing special with a national win, a deep show record, and a practical role back at Mata Hauri.",
    dogStory: "Oso is a homebred son of Jethro and Ginger with the athletic, alert outline Debbie has built around for decades. He finished his Championship and Grand Championship by 7.5 months, then came home to New Hampshire as a CHIC-cleared stud dog with puppies carrying the line forward.",
    competitionStory: "The 2022 National Specialty Best in Show was not just another ribbon; it put Oso in front of the Basenji community at the breed's biggest stage. Before that, he was the Number 1 Basenji in 2021, earned a Group 1 the first time out as a Special, and collected hound group placements, Bests in Show, and Best of Breed wins.",
    imageCaption: "Oso at the 2022 BCOA National Specialty, where his Best in Show win anchored the modern Mata Hauri show story.",
    meta: ["Owner: Debbie Hauri", "Breeder: Debbie Hauri", "Shown by: Kim Byrd", "At stud in New Hampshire with CHIC health clearances"],
    wins: ["2022 National Specialty Best in Show", "Number 1 Basenji in 2021", "Championship and Grand Championship by 7.5 months", "Group 1 first time out as a Special"],
    body: [
      "Oso finished early, collected Best of Breed wins, and became a standout stud dog back in New Hampshire.",
      "His babies are represented at KISA and Marenga, continuing the Mata Hauri line with health testing in place.",
    ],
    images: [
      image("oso/Oso-2022-BIS.jpg"),
      image("oso/Oso-puppies.jpg"),
      image("oso/Oso-2022.jpg"),
      image("oso/oso-face.jpg"),
      image("oso/oso-puppy-pile.jpg"),
      image("oso/oso-puppy.jpg"),
    ],
  },
  {
    id: "marlon",
    name: "Marlon",
    title: "Gr Ch Mata Hauri Klassy's Last Tango",
    subtitle: "Top Ten Basenji in 2016 and a Mata Hauri stud dog from the Tango x Klassy cross.",
    callout: "A direct bridge from Tango and Klassy into the next generation of Mata Hauri dogs.",
    dogStory: "Marlon is by CH Mata Hauri Shall We Dance and out of DC Klassic's Ms Mata Hauri, so his page is really a family-line page too. He carries the clean, elegant show-dog side of the kennel while staying useful as a stud dog.",
    competitionStory: "His Top Ten 2016 placement makes him more than a pedigree note. Marlon was campaigned, photographed in the ring, and recognized among the top Basenjis that year, keeping the Klassy line visible in active competition.",
    imageCaption: "Marlon's show photos connect his Top Ten 2016 recognition back to the Tango x Klassy pedigree behind him.",
    meta: ["Owner: Debbie Hauri", "Breeder: Debbie Hauri", "Shown by: Liz Reed", "Born 2014"],
    wins: ["Top Ten 2016", "Grand Champion", "At stud", "From Tango x Klassy"],
    body: [
      "Marlon carries a pedigree rooted in CH Mata Hauri Shall We Dance and DC Klassic's Ms Mata Hauri.",
      "The redesign treats these individual dog pages as profile stories instead of isolated legacy HTML pages.",
    ],
    images: [
      image("marlon/marlon2.jpg"),
      image("marlon/marlon4.jpg"),
      image("marlon/marlon3.jpg"),
      image("marlon/marlon1.jpg"),
      image("our-basenjis/MarlonShow.jpg"),
    ],
  },
  {
    id: "klassy",
    name: "Klassy",
    title: "Ch Klassic's Ms Mata Hauri SC",
    subtitle: "The top-winning tri-color Basenji of all time and the top-winning Basenji bitch of all time.",
    callout: "The foundation superstar behind much of the modern Mata Hauri story.",
    dogStory: "Klassy came to Mata Hauri from Sue Kite and Jeff Gillespie's breeding, then became one of the kennel's defining dogs. Her record is tied to the dog herself: a tri-color bitch with the presence, outline, and consistency to keep winning across several seasons.",
    competitionStory: "Her run built year by year: National Specialty Sweepstakes Winner and Award of Merit in 2005, National Specialty Best of Breed and Number One Basenji by Breed System in 2006, Number One Basenji all systems and Number 11 Hound in 2007, then America's Number 1 Basenji and Number 10 Hound in 2008.",
    imageCaption: "Klassy's record includes 6 Bests in Show, 42 Group Firsts, and a multi-year national rankings run with handlers who knew her well.",
    meta: ["Owner: Debbie Hauri", "Breeders: Sue Kite and Jeff Gillespie", "11/21/2004 - 3/17/2021"],
    wins: ["Top-winning tri-color Basenji of all time", "Top winning Basenji bitch of all time", "6 Bests in Show", "42 Group firsts"],
    body: [
      "Klassy won the National Specialty Sweepstakes and Award of Merit in 2005, Best of Breed in 2006, and America's Number 1 Basenji in 2008.",
      "Her page keeps the show-history spine intact while making it easier to scan on mobile.",
    ],
    images: [
      image("klassy-tricolor-basenji.jpg"),
      image("klassy-top-basenji.jpg"),
      image("klassy-russella.jpg"),
      image("klassy-russella-champion-basenji.jpg"),
      image("klassy-andrew1.jpg"),
      image("klassy-andrew2.jpg"),
    ],
  },
];

export const puppyHighlights = [
  "Puppies are expected to be born late November 2026.",
  "All breeding stock are health tested and clear of carrying Fanconi and PRA.",
  "Hips are OFA excellent or good, with hips tested at 2 years old.",
  "Elbows normal and thyroid normal.",
  "Puppies are available at 8 weeks old or older with first shot and health certificate.",
  "Temperament is the top priority.",
  "Expected colors include red and white, brindle and white, tricolor, or black, tan and white.",
  "$2200 - $2500.",
];

export const puppyImages = [
  image("basenji-puppies-for-sale/Mata-Hauri-puppies2024.jpg"),
  image("basenji-puppies-for-sale/pupsstrip.jpg"),
  image("basenji-puppies-for-sale/puppies2012/basenjipuppy5.jpg"),
  image("basenji-puppies-for-sale/puppies2012/basenjipuppy1.jpg"),
  image("basenji-puppies-for-sale/puppies2012/basenjipuppy7.jpg"),
  image("basenji-puppies-for-sale/puppies2012/basenjipuppy4.jpg"),
  image("basenji-puppies-for-sale/puppies2012/basenjipuppy8.jpg"),
];

export const breedPanels = [
  {
    id: "want",
    title: "So you think you want a Basenji",
    kicker: "Smart, affectionate, independent, and very much their own little person.",
    points: [
      ["They do not bark", "They can still scream, howl, cry, yodel, and make their opinions clear."],
      ["They are small", "They are fast, strong, athletic dogs in a compact package."],
      ["They are intelligent", "They get bored easily and need training, structure, and safe outlets."],
      ["They are unusual", "They bond hard, but they need owners who understand the breed."],
    ],
    paragraphs: [
      "Basenjis are active, intelligent, demanding dogs that require attention, training, and affection. If you are not willing to spend time and effort to train and enjoy them, a Basenji is not the right fit.",
      "They build strong bonds with their families and are often friendly with strangers and children. They are not guard dogs, but they are alert and observant.",
      "They are mischievous and easily bored. A crate, training plan, and safe confinement can protect both the dog and the home.",
      "Basenjis love to run. A fenced yard or leash is essential because many will choose adventure first and recall later.",
      "Buying a Basenji is a 10 to 15 year commitment. For the right person, they become wonderfully habit-forming.",
    ],
  },
  {
    id: "masterpiece",
    title: "Nature's Masterpiece",
    kicker: "A compact natural breed with ancient roots and modern charm.",
    points: [
      ["Look", "Prick ears, wrinkled forehead, curled tail, and a clean short coat."],
      ["Movement", "Slender legs, arched toes, and a proud, light gait."],
      ["Voice", "Often quiet, but capable of yodels, crows, growls, and expressive conversation."],
      ["Care", "Clean, low odor, and usually content with brushing and simple grooming."],
    ],
    paragraphs: [
      "The Basenji is described as one of nature's original dog designs, with a small foxy outline, curled tail, and alert expression.",
      "The breed was treasured in Africa and appeared in ancient art. Modern Basenjis still keep the clean outline, independence, and self-possession that make the breed distinct.",
      "A male is approximately 17 inches at the shoulder and a female approximately 16 inches, with preferred weights around 24 and 22 pounds.",
      "Colors include red and white, black and white, tricolor, and brindle, always with the breed's crisp markings and elegant silhouette.",
      "Basenjis are famously clean and almost odorless, often grooming themselves with a catlike attention to detail.",
    ],
  },
  {
    id: "fit",
    title: "Is the Breed for You",
    kicker: "The good part starts after the honest part.",
    points: [
      ["Independence", "They were bred to make decisions in the field, so training needs patience."],
      ["Mouthy puppy stage", "They need their own toys, crate comfort, and house rules early."],
      ["Dog selectivity", "Early socialization helps, especially around other dogs and leashes."],
      ["Vertical living", "They like being up high, near windows, and close to their people."],
    ],
    paragraphs: [
      "Basenjis should not be trusted off leash without secure boundaries. They are intelligent and quick at figuring things out, which can work against strict obedience.",
      "Puppies need to learn what is theirs to chew and where to rest when people are gone. Crate training can help during that stage.",
      "Many Basenjis are selective with other dogs, especially when confined or on leash. Early socialization and neutral introductions matter.",
      "For the right household, Basenjis are clean, quiet, athletic, affectionate companions who adjust to apartment or country living.",
      "They love to do what the family is doing: traveling, camping, outdoor time, or curling up near warmth in a New England winter.",
    ],
  },
];

export const defaultSettings: AdminSettings = {
  heroStatus: "Breeder of top Basenjis since 1969",
  puppyAnnouncement: "Puppies are expected to be born late November 2026.",
  litterDue: "Late November 2026",
  priceRange: "$2200 - $2500",
  adultAvailability: "A 2 year old Grand Champion and some older girls may be available in winter 2026 and 2027 for homes familiar with Basenjis.",
  shippingPolicy: "Puppies must be picked up at Mata Hauri or by a pet transport service. Puppies can no longer be shipped alone by air.",
  contactEmail: "matahauri@gmail.com",
  contactPhone: "603.632.4166",
  publishPuppies: true,
  publishAdults: true,
};

export const seedInquiries: Inquiry[] = [
  { id: 108, name: "Maya R.", interest: "Late 2026 puppy", stage: "Screening", score: 92, notes: "Owned a Basenji previously; fenced yard." },
  { id: 109, name: "Jon and Priya", interest: "Retired adult", stage: "New", score: 71, notes: "Ask about experience with independent hounds." },
  { id: 110, name: "Ellen S.", interest: "Show prospect", stage: "Waitlist", score: 85, notes: "Needs pedigree packet and planned litter update." },
  { id: 111, name: "Chris M.", interest: "Companion puppy", stage: "Visit", score: 88, notes: "Available for Enfield pickup." },
];

export const contact = {
  phone: "603.632.4166",
  email: "matahauri@gmail.com",
  address: ["81 Wescott Road", "Enfield, NH 03748"],
};

export const stats = [
  ["Since", "1969"],
  ["Registry", `${registryDogs.length} dogs`],
  ["Klassy", "6 BIS"],
  ["Puppies", "Late Nov 2026"],
];
