# Stargrazer - GitHub Stats Collector/ Aggreator
```
🦺 This is experimental code, that has not been tested extensively.
```

- We are running this on render.com
- One database
- One webservice
- One cronjob service
- We run this once a day, but aggregate to monthly so far
- Forks and Merges sadly can't be retrieved for older dates and tracking will start in August 2023
- Feel free to suggest changes/ addition, we can't guarantee how time we will put into this
- Also feel free to use, but please mind that this is not thoroughly tested code

# Endpoints
- /api/poll: Trigger datapoint collection for this moment
- /api/stat: Get a monthly aggregated timeline of previously collected stats. Highest value for month is used.
