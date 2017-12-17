var twitter_base_url = "https://api.twitter.com/1.1/";

function run(){
  auth();
  var twiSearchCountMax =  100;//TwitterSearchAPIでは検索上限が100件のため
  var searchPayload = {
    q:"#歌鈴vsバナナ -rt",
    count:twiSearchCountMax
  }
  var scores = [];
  while(true){
    var response  = JSON.parse(getAccessTwitter("search/tweets", searchPayload));
    for(var i = 0; i<response.statuses.length;i++ ){
      var text = response.statuses[i].text
      text = text.slice(text.indexOf("Score:"), text.indexOf("\n"))
      text = text.slice("Score:".length)
      if(text!==""){
        scores.push(text)
      }
    }   
    if(response.statuses.length !== twiSearchCountMax){
      break;      
    }
    searchPayload.max_id = response.statuses[twiSearchCountMax-1].id_str;
  }
  var maxScore = Math.max.apply(null, scores);
  
  var spreadsheet = getKVBSheet();
  var sheet = spreadsheet.getActiveSheet();
  var currentMaxScore = sheet.getRange("A1").getValue();
  if(maxScore > currentMaxScore){
    var currentMaxScore = sheet.getRange("A1").setValue(maxScore);
    var payload = {
      status:"#歌鈴vsバナナ の最大スコアが更新されました．現在の最大スコアは" + maxScore.toString() + "です．"
    };
    postAccessTwitter("statuses/update", payload);
  }
  
  
}

function getKVBSheet(){
  return SpreadsheetApp.openById('19TPcSmh_WbB0501k2GvJ3XSrcVxGookOsr4oET2II-4');
}

function getTwitterService(){
  return OAuth1.createService("twitter")
  .setAccessTokenUrl("https://api.twitter.com/oauth/access_token")
  .setRequestTokenUrl("https://api.twitter.com/oauth/request_token")
  .setAuthorizationUrl("https://api.twitter.com/oauth/authorize")
  .setConsumerKey("xxxxxxxx")
  .setConsumerSecret("xxxxx")
  .setCallbackFunction("authCallback")
  .setPropertyStore(PropertiesService.getScriptProperties());
}

function authCallback(request){
  var service = getTwitterService();
  var isAuth = service.handleCallback(request);
  if (isAuth) return HtmlService.createHtmlOutput("OK");
  return HtmlService.createHtmlOutput("NG");
}

function auth(){
  var service = getTwitterService();
  if (service.hasAccess()) return;
  var authorizationUrl = service.authorize();
  Logger.log(authorizationUrl);
}

function postAccessTwitter(endPoint, payload){
  var service = getTwitterService();
  var payload_str = payloadToString(payload);
  var options = {
    method:"post",
    escaping:false,
    payload:payload_str
  };
  var url = twitter_base_url + endPoint + ".json";
  return service.fetch(url, options);
}

function getAccessTwitter(endPoint, payload){
  var service  = getTwitterService();
  var payload_str = payloadToString(payload);
  var options = { method:'get', escaping:false};
  var url = twitter_base_url+endPoint+'.json?'+payload_str;
  return service.fetch(url, options)
};

function payloadToString(payload){
  return Object.keys(payload).map(function(key){
    return encodeToRfc3986(key) + "=" + encodeToRfc3986(payload[key]);
  }).join("&");
}

function encodeToRfc3986(str){
  return encodeURIComponent(str).replace(/[!'()]/g,function(char){
    return escape(char);
  }).replace(/\*/g, "%2A");
}

          
          