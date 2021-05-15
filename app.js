require('dotenv').config();
const chalk = require('chalk');
const axios = require('axios').default;
const cron = require('node-cron');
const fs = require('fs');
const logFile = 'log.json';
fs.writeFileSync(logFile, JSON.stringify([]))
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
  let d = new Date();
  let diff = 10;
  let newDateObj = new Date(d.getTime() + diff * 60000);

  axios.post('https://slack.com/api/users.profile.set', {
    "profile": {
      "status_text": txt,
      "status_emoji": emoji,
      "status_expiration": newDateObj.getTime()
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
    storeData(rowData.data)

    for (let i = 0; i < rowData.data.length; i++) {
      if (res.data[i] == process.env.CITY) {
        logger(res.data[i], LEVEL.WARN)
        changeStatus(`אזעקה ב${rowData.data[i]}`, ':alert:')
      }

    }
  });
}


const storeData = (data) => {
  let rawdata = fs.readFileSync(logFile);
  let logs = JSON.parse(rawdata);
  logs.push({ id: data.id, data: data.data })
  try {
    fs.writeFileSync(logFile, JSON.stringify(logs))
  } catch (err) {
    console.error(err)
  }
}
changeStatus('הכל רגוע', ':happy:')
getAlert()
cron.schedule('*/10 * * * * *', () => {
  logger('running a task every 10 second', LEVEL.INFO);
  getAlerts()
});

