const fetch = require("node-fetch");

app.get('/calendar', async (req, res) => {
  if (!syzoj.config.calendar.enable) {
    res.render('error', {
      err: null
    });
  } else {
    const data = (await fetch(syzoj.config.calendar.api_url))
      .then(function(resp) {
        return resp.json();
      });

    if (data.status !== 'OK') {
      res.render('error', {
        err: data.message
      });
    } else {
      let contests = [];
      for (let oj of data.oj) {
        for (let contest of oj.contests) {
          contest.oj = oj;
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
