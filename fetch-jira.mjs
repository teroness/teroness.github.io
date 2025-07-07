import fetch from 'node-fetch';const email = process.env.JIRA_EMAIL;
const token = process.env.JIRA_TOKEN;
const domain = process.env.JIRA_DOMAIN;

const auth = Buffer.from(`${email}:${token}`).toString('base64');

const jql = 'project = RISK AND issuetype = Riski';

const url = `https://${domain}/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=summary,customfield_10050,customfield_10037,customfield_10038`;

fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => {
  console.log(JSON.stringify(data, null, 2)); // debug
  if (!data.issues) {
    console.error('JIRA palautti odottamattoman vastauksen:', data);
    return;
  }
  data.issues.forEach(issue => {
    console.log({
      avain: issue.key,
      nimi: issue.fields.summary,
      riskiarvo: issue.fields.customfield_10050,
      todennäköisyys: issue.fields.customfield_10037,
      vaikutus: issue.fields.customfield_10038
    });
  });
})

