const fetch = require("node-fetch");
const moment = require('moment');

function parseMinutes(minutes) {
  const days = parseInt(minutes / 60 / 24), hours = parseInt(minutes / 60) % 24;
  minutes = minutes % 60;
  return [
    days && `${days} 天`,
    hours && `${hours} 小时`,
    minutes && `${minutes} 分钟`
  ].filter(str => !!str).join(' ');
}

app.get('/calendar', async (req, res) => {
  if (!syzoj.config.calendar.enable) {
    res.render('error', {
      err: null
    });
  } else {
    const data = await(await fetch(syzoj.config.calendar.api_url)).json();

    if (data.status !== 'OK') {
      res.render('error', {
        err: data.message
      });
    } else {
      let contests = [];
      for (let oj of data.oj) {
        for (let contest of oj.contests) {
          contest.oj = oj;
          contest.lastTime = parseMinutes(moment(contest.endTime).diff(contest.startTime, 'm'));
          contest.startTime = moment(contest.startTime).format('MM 月 DD 日 HH:mm');
          contest.endTime = moment(contest.endTime).format('MM 月 DD 日 HH:mm');
          contests.push(contest);
        }
      }
      contests.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      res.render('calendar', {
        contests: contests
      });
    }
  }
});
