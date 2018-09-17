const request = require('request');
const async = require('async');
const fs = require('fs');

const sources = [
  {
    key: "achievements",
    url: "https://raw.githubusercontent.com/HypixelDev/PublicAPI/master/Documentation/misc/Achievements.json"
  },
  {
    key: "achievements_extended",
    url: "https://raw.githubusercontent.com/HypixelDev/PublicAPI/master/Documentation/misc/Achievements.json",
    transform: respObj => {
      const {achievements} = respObj;
      Object.keys(achievements).forEach((game) => {
        // Total amount of achievements
        const one_time = Object.keys(achievements[game].one_time);
        const tiered = Object.keys(achievements[game].tiered);
        achievements[game].total_one_time = one_time.length;
        achievements[game].total_tiered = 0;
        achievements[game].total = 0;
        tiered.forEach((ach) => {
          achievements[game].total_tiered += achievements[game].tiered[ach].tiers.length;
        });
        achievements[game].total = achievements[game].total_one_time + achievements[game].total_tiered;
        // Total available points for tiered and onetime
        achievements[game].total_points_one_time = 0;
        achievements[game].total_points_tiered = 0;
        one_time.forEach((ach) => {
          achievements[game].total_points_one_time += achievements[game].one_time[ach].points;
        });
        tiered.forEach((ach) => {
          achievements[game].tiered[ach].tiers.forEach((tier) => {
            achievements[game].total_points_tiered += tier.points;
          })
        })
      });
      return achievements;
    }
  },
  {
    key: "quests",
    url: "https://github.com/HypixelDev/PublicAPI/raw/master/Documentation/misc/Quests.json"
  },
  {
    key: "challenges",
    url: "https://github.com/HypixelDev/PublicAPI/raw/master/Documentation/misc/Challenges.json"
  }
];

async.each(sources, function (s, cb) {
    const url = s.url;
    //grab raw data from each url and save
    console.log(url);
    if (typeof url === 'object') {
      async.map(url, (urlString, cb) => {
        request(urlString, (err, resp, body) => {
          cb(err, JSON.parse(body));
        });
      }, (err, resultArr) => {
        handleResponse(err, {
          statusCode: 200
        }, JSON.stringify(resultArr));
      });
    }
    else {
      request(url, handleResponse);
    }

    function handleResponse(err, resp, body) {
      if (err || resp.statusCode !== 200) {
        return cb(err);
      }
      body = JSON.parse(body);
      if (s.transform) {
        body = s.transform(body);
      }
      fs.writeFileSync('./build/' + s.key + '.json', JSON.stringify(body, null, 2));
      cb(err);
    }
  },
  function (err) {
    if (err) {
      throw err;
    }
    // Copy manual json files to build
    const jsons = fs.readdirSync('./json');
    jsons.forEach((filename) => {
      fs.writeFileSync('./build/' + filename, fs.readFileSync('./json/' + filename, 'utf-8'));
    });
    // Reference built files in index.js
    const cfs = fs.readdirSync('./build');
    // Exports aren't supported in Node yet, so use old export syntax for now
    // const code = cfs.map((filename) => `export const ${filename.split('.')[0]} = require(__dirname + '/json/${filename.split('.')[0]}.json');`).join('\n';
    const code = `module.exports = {
${cfs.map((filename) => `${filename.split('.')[0]}: require(__dirname + '/build/${filename.split('.')[0]}.json')`).join(',\n')}
};`;
    fs.writeFileSync('./index.js', code);
    process.exit(0);
  });