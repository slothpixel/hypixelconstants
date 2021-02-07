# hypixelconstants
<a href="https://badge.fury.io/js/hypixelconstants">
   <img src="https://badge.fury.io/js/hypixelconstants.svg" alt="npm version" height="18">
</a>
<a href="https://www.npmjs.com/package/hypixelconstants">
   <img src="https://img.shields.io/npm/dm/hypixelconstants.svg" alt="downloads" height="18">
</a>

Constant data for Hypixel applications. Useful for processing data from the Hypixel API.

List of Content
----
| Resource | Description           |
|-----------|----------------------|
| achievements | Achievement data mirrored from the Hypixel Documentation |
| achievements_extended | Extended achievement data that includes things such as total achievements and points per game |
| guild_achievements | Guild achievements |
| challenges | Challange data mirrored from the Hypixel Documentation |
| game_types | Data useful for conversion between different game type names |
| skyblock_collections | SkyBlock collections |
| skyblock_skills | SkyBlock skills |
| skyblock_items | SkyBlock item ID conversion table |
| skyblock_bazaar | SkyBlock bazaar item info |
| languages | Data of languages Hypixel is currently translated to |
| modes | Hypixel minigame modes |
| pet_xp | Array containing the required xp to pet leveling |
| quests | Quest data mirrored from the Hypixel API Documentation |

Example usage
----
* Run `npm install hypixelconstants`

The following code snippet prints quest data to the console.

```js
const constants = require('hypixelconstants');
const { quests } = constants.quests;

console.log(quests);
```

Notes
----
* Manually maintained files are located in the `json` directory
* Some data is fetched from remote sources
* Update and regenerate build: `npm run build`
