# RedAlertStatusChanger

RedAlertStatusChanger is a node js library for automatic change your slack status incase of a red alert (צבע אדום) in your city

## Installation

clone the project and install it 

```
npm install
```

## Prerequisite

you need to create a personal token, 
 - first visit [slack api portal](https://api.slack.com/apps) to create your app
 - follow [this guide](https://medium.com/@andrewarrow/how-to-get-slack-api-tokens-with-client-scope-e311856ebe9) to get the slack api token 
- update [./.env](.env) file with your personal token, city, ALARM_MESSAGE and CLEAR_MESSAGE

## Usage
```
npm run start
```

in any case of red alert in your city - the script will change your slack status for 10 minutes, 

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
