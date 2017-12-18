# KarinVSBananaMaxScoreBot
[歌鈴vsバナナ ](https://efutei.github.io/KarinVsBanana/) の最大スコアがツイートされると更新する感じのbotです

## 使い方

### 必要なライブラリ
|ライブラリ名|プロジェクトキー|
|:-|:-|
|OAuth1|Mb2Vpd5nfD3Pz-_a-39Q4VfxhMjh3Sh48|
|TwitterWebService|MFE2ytR_vQqYfZ9VodecRE0qO0XQ_ydfb|

### スプレッドシートとCS/CKの書き換え
最大スコアのデータはスプレッドシートで管理するようにしているので`getKVBSheet()`関数内の`SpreadsheetApp.openById('xxxxxx')`を使いたいスプレッドシートのIDに変更しましょう．

また，スプレッドシートについてですが最初は`A1`に0の値を入れておいてください．(`A1`の値と比較して最大スコアかどうかを判定するため)

次にTwitterのCS/CKを書き換えましょう．書き換える場所は`getTwitterService()`関数内の`.setConsumerKey("xxxxxxxx")`と`.setConsumerSecret("xxxxx")`です．

また，CS/CKが記述されているTwitterのアプリ管理画面では`CallBack URL`を設定しましょう．指定するURLは`https://script.google.com/macros/d/{GASのPROJECT KEY}/usercallback`の形式です．

![](https://i.imgur.com/iJhTaAu.png)


### 使うための認証
botとして使うにはTwitterのアプリ連携をする必要があります．なので最初は`auth()`関数を実行して`Logger.log(authorizationUrl);`で吐き出されるURLを踏んでください．これで連携画面に飛びます

### botを動かす関数
`run()`でツイートからスコアチェックを行っています．なので例えばこの関数を5分置きに起動するトリガーを設定にしておくといい感じに動きます．


