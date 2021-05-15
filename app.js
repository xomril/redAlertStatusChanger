require('dotenv').config();
const chalk = require('chalk');
const axios = require('axios').default;
const cron = require('node-cron');


const LEVEL = {
  INFO: 'info',
  WARN: 'warn',
  ALERT: 'alert'
}

const logger = (txt, level) => {
  let p = chalk.green;
  switch (level) {
    case LEVEL.ALERT: p = chalk.red; break;
    case LEVEL.WARN: p = chalk.yellow; break;
  }
  console.log(p(txt))
}
const options = {
  headers: {
    'Content-type': 'application/json; charset=utf-8',
    'Authorization': `Bearer ${process.env.TOKEN}`
  }
};

const changeStatus = async (txt, emoji) => {
  let currentDate = new Date().toLocaleString("en-US", {timeZone: 'Asia/Jerusalem'});
  let futureDate = new Date(currentDate).getTime() + 10 * 60000;

  console.log([{
    "status_text": txt,
    "status_emoji": emoji,
    "status_expiration": futureDate / 1000
  }])
  axios.post('https://slack.com/api/users.profile.set', {
    "profile": {
      "status_text": txt,
      "status_emoji": emoji,
      "status_expiration": futureDate / 1000 /* I'm not sure why i need to devide this number to 1000 but it works */
    }
  }, options).then((res) => {
    if (!res.data.ok) {
      logger(res.data.error, LEVEL.ALERT)
    }
  });
}



const getAlerts = async () => {
  const url = 'https://www.oref.org.il/WarningMessages/alert/alerts.json'
  const options = {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Referer': 'https://www.oref.org.il/12481-he/Pakar.aspx'
    }
  };

  axios.get(url, options).then((res) => {
    const rowData = res.data;
    if (rowData.length == 0) return;
    logger(rowData)

    for (let i = 0; i < rowData.data.length; i++) {
      if (res.data[i] == process.env.CITY) {
        logger(res.data[i], LEVEL.WARN)
        changeStatus(process.env.ALERT_MESSAGE, ':loudspeaker:')
      }

    }
  });
}



changeStatus(process.env.CLEAR_MESSAGE, ':smile:')
getAlerts()
cron.schedule('*/10 * * * * *', () => {
  logger('running a task every 10 second', LEVEL.INFO);
  getAlerts()
});
