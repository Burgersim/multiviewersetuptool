<template>
  <div class="singleChannel-item">
    <h1 class="is-size-5">Row {{ rowId }}</h1>
    <div class="field has-addons">
      <div class="control">
        <b-select v-model="hlsSourceValue" placeholder="HLS Source" v-on:change.native="setHlsSource(hlsSource)">
          <option value="rbtv">RBTV</option>
          <option value="stv">STV</option>
        </b-select>
      </div>
      <div class="control is-expanded">
        <b-select v-model="selected" v-on:change.native="initialiseState(selected)" placeholder="Select HLS link" expanded>
          <optgroup v-for="(eventSegment, key) in livePrograms" v-bind:label="eventSegment.groupData.dateCode + ' ' + eventSegment.groupData.fullTitle" v-bind:key="key">
            <option
                v-for="hlsLink in eventSegment.hlsLinks"
                :value="{...hlsLink,...eventSegment.groupData}"
                :key="hlsLink.id">
              {{ hlsLink.fieldName.replace(/:\s*$/, "")}}
            </option>
          </optgroup>
        </b-select>
      </div>
      <div class="control">
        <b-button type="is-danger" v-on:click="clearChannel()">CLEAR CHANNEL</b-button>
      </div>
      <div class="control">
        <b-button type="is-success" v-on:click="updateEvertz()">SAVE</b-button>
      </div>
    </div>
    <div class="field">
      <b-field label="Name">
        <b-input v-model="channelData.title" placeholder="Name"></b-input>
      </b-field>
    </div>
    <div class="field">
      <b-field label="HLS Link">
        <b-input v-model="channelData.mediaLink" placeholder="https://"></b-input>
      </b-field>
    </div>
    <div class="field is-horizontal">
      <div class="field-body">
        <div class="field is-narrow">
          <div class="control">
            <b-button type="is-info" v-on:click="checkMultiaudio()" :class="{'is-loading' : isLoading}">CHECK AUDIO</b-button>
          </div>
        </div>
        <div class="field is-narrow">
          <div class="control" v-if="multiAudio.data.length > 0">
            <b-select v-model="targetAudioChSelected" placeholder="Channel">
              <option v-for="(option, key) in targetAudioChOptions" v-bind:value="option.value" v-bind:key="key">
                {{ option.text }}
              </option>
            </b-select>
          </div>
          <div class="control"  v-else-if="multiAudio.hasOwnProperty('error')">
            <b-button class="is-danger is-uppercase" disabled expanded>{{multiAudio.error}}</b-button>
          </div>
        </div>
        <div class="field" v-for="(language, key) in multiAudio.data" v-bind:key="key">
          <div class="control">
            <b-button  class="is-uppercase is-fullwidth" disabled>{{language.id}}</b-button>
          </div>
        </div>
      </div>
    </div>
    <div class="box is-size-7" v-if="multiAudio.data.length > 0">
      <p v-for="(language, key) in multiAudio.data" v-bind:key="key">
        {{language.url}}
      </p>
    </div>
  </div>
</template>

<script>
//TODO: refactoring
//  separate methods for initializing, audio comments, resetting select
//  add Layout Change Methods
//
const parseString = require('xml2js').parseString;
//const chalk = require('chalk');
import axios from "axios";

export default {
  name: "MultiverzeSingleChannel",
  data() {
    return {
      selected: null,
      updateResponse: [],
      multiAudio: {data:[]},
      isLoading: false,
      isActiveSource: false,
      languageStrArr: [],
      languageStr: "",
      targetAudioChOptions: [
        { initCh: 0, text: '', value: 0 },
        { initCh: 1, text: 'ROW1: CH49', value: 48 },
        { initCh: 2, text: 'ROW2: CH50', value: 49 },
        { initCh: 3, text: 'ROW3: CH51', value: 50 },
        { initCh: 4, text: 'ROW4: CH52', value: 51 },
        { initCh: 5, text: 'ROW5: CH53', value: 52 },
        { initCh: 6, text: 'ROW6: CH54', value: 53 },
        { initCh: 7, text: 'ROW7: CH55', value: 54 },
        { initCh: 8, text: 'ROW8: CH56', value: 55 }
      ],
      targetAudioChSelected: null,
      channelData: {
        title: "",
        mediaLink: ""
      },
      rowId: this.mvrzSingleChannelData.i,
      hlsSourceValue: "rbtv"
    }
  },
  selectedEvent: {},
  props: ["mvrzSingleChannelData"],
  methods: {
    initialiseState(){
      console.log("Initialise State...");
      this.multiAudio = {data:[]};
      this.languageStrArr = [];
      this.languageStr = "";
      this.livePrograms = this.mvrzSingleChannelData.allLivePrograms[this.hlsSourceValue]
      this.setChannelDataHlsLink(this.selected);
      this.setChannelDataTitle(this.selected)
      this.checkMultiaudio(this.channelData.mediaLink);
    },
    setChannelDataHlsLink(obj){
      this.channelData.mediaLink =  obj.url;
    },
    setHlsSource(){
      console.log("setHlsSource...")
      this.multiAudio = {data:[]};
      this.languageStrArr = [];
      this.languageStr = "";
      this.hlsSource = null;
      this.channelData.title = this.channelData.mediaLink = "";
      this.livePrograms = this.mvrzSingleChannelData.allLivePrograms[this.hlsSourceValue];
    },
    setChannelDataTitle(obj){
      this.channelData.title =  "CH " + this.rowId
          + " - " + obj.dateCode
          //+ " - " + obj.eventCode //obsolete
          + " - " + obj.rbtvTitle.replace(/[^a-zA-Z0-9 -]/g, "") //filtering out everything that is not a regular letter, number, blank or dash.
          + this.languageStr
          + " - " + obj.breaks.toUpperCase()
          + " - " + obj.type.toUpperCase().slice(0, 3);
    },

    updateEvertz() {

      //let time = Date.now();
      let descriptionFieldId = 82;
      let urlFieldId = 83;
      let typeFieldId = 102;
      let autoManageAudioStreamsFieldId = 113;
      //let decodeAudioOnlyFieldId = 126;
      let audioStreamActiveFieldId = 346;
      //let audioStreamActivePidFieldId = 92;
      //let audioStreamRequestedPidFieldId = 93;
      let programListFieldId = 107;
      let updateHost = "https://10.5.68.132/cgi-bin/cfgjsonrpc";
      let chanIdx = this.rowId;
      let chanStartIdx =  (this.rowId > 1) ? (chanIdx * 6) - 6 : 0;
      let i;

      //add Multi/Single to channel names for convenience
      if(this.multiAudio.data.length > 0){
        if(this.channelData.mediaLink.endsWith('.m3u8') || this.channelData.mediaLink.endsWith('.mpd')){
          for (i = 0; i < 6; i++) {
            let jsonData = {
              "jsonrpc": "2.0",
              "method": "set",
              "params": {
                "parameters": [{
                  "id": "82.0@s",
                  "type": "string",
                  "name": "Name",
                  "value": "CH1 TEST0000 XXX XXXXXX PRI/SEC R1",
                  "value-length": 34
                }, {
                  "id": "83.0@s",
                  "type": "string",
                  "name": "URL",
                  "value": "https://localhost test",
                  "value-length": 22
                }, {
                  "id": "113.0@i",
                  "name": "Auto Manage Audio Streams",
                  "type": "integer",
                  "value": 1,
                  "value-length": 1
                }, {
                  "id": "126.0@i",
                  "name": "Decode Audio Only",
                  "type": "integer",
                  "value": 0,
                  "value-length": 1
                }, {
                  "id": "346.0.0@i",
                  "name": "Active",
                  "type": "integer",
                  "value": 0,
                  "value-length": 1
                }, {
                  "id": "346.0.1@i",
                  "name": "Active",
                  "type": "integer",
                  "value": 0,
                  "value-length": 1
                }, {
                  "id": "346.0.2@i",
                  "name": "Active",
                  "type": "integer",
                  "value": 0,
                  "value-length": 1
                }, {
                  "id": "346.0.3@i",
                  "name": "Active",
                  "type": "integer",
                  "value": 0,
                  "value-length": 1
                }, {
                  "id": "346.0.4@i",
                  "name": "Active",
                  "type": "integer",
                  "value": 0,
                  "value-length": 1
                }, {
                  "id": "346.0.5@i",
                  "name": "Active",
                  "type": "integer",
                  "value": 0,
                  "value-length": 1
                }, {
                  "id": "346.0.6@i",
                  "name": "Active",
                  "type": "integer",
                  "value": 0,
                  "value-length": 1
                }, {
                  "id": "346.0.7@i",
                  "name": "Active",
                  "type": "integer",
                  "value": 0,
                  "value-length": 1
                }, {
                  "id": "107.0@s",
                  "type": "string",
                  "value": 1,
                  "value-length": 1
                }, {
                  "id": "102.0@i",
                  "type": "integer",
                  "name": "Type",
                  "value": 5,
                  "value-length": 1
                }]
              },
              "id": 57,
              "username": "admin"
            }
            let description = this.channelData.title + " - MULTI" + " - R" + (i + 1);
            /*                    let updateUrl = updateHost
                + descriptionFieldId + "." + (chanStartIdx + i)  + '@s=' + encodeURI(description) + ","
                + urlFieldId + "." + (chanStartIdx + i)  + '@s=' + encodeURI(this.channelData.hlsLink)
                + ";time=&" + time;*/
            jsonData["params"]["parameters"][0]["id"] = descriptionFieldId + "." + (chanStartIdx + i) + "@s";
            jsonData["params"]["parameters"][0]["value"] = description;
            jsonData["params"]["parameters"][0]["value-length"] = jsonData["params"]["parameters"][0]["value"].length;
            jsonData["params"]["parameters"][1]["id"] = urlFieldId + "." + (chanStartIdx + i) + "@s";
            jsonData["params"]["parameters"][1]["value"] = this.channelData.mediaLink;
            jsonData["params"]["parameters"][1]["value-length"] = jsonData["params"]["parameters"][1]["value"].length;
            jsonData["params"]["parameters"][2]["id"] = autoManageAudioStreamsFieldId + "." + (chanStartIdx + i) + "@i";
            jsonData["params"]["parameters"][2]["value"] = 0;
            jsonData["params"]["parameters"][2]["value-length"] = jsonData["params"]["parameters"][2]["value"].length;
            jsonData["params"]["parameters"][12]["id"] = programListFieldId + "." + (chanStartIdx + i) + "@s";
            jsonData["params"]["parameters"][12]["value"] = i.toString();
            jsonData["params"]["parameters"][12]["value-length"] = jsonData["params"]["parameters"][12]["value"].length;
            jsonData["params"]["parameters"][13]["id"] = typeFieldId + "." + (chanStartIdx + i) + "@i";
            jsonData["params"]["parameters"][13]["value"] = 5;
            jsonData["params"]["parameters"][13]["value-length"] = jsonData["params"]["parameters"][13]["value"].length;

            let j, k;
            for( j = 4, k = 0; j < 12; j++, k++){
              jsonData["params"]["parameters"][j]["id"] = audioStreamActiveFieldId + "." + (chanStartIdx + i) + "." + k + "@i";
              jsonData["params"]["parameters"][j]["value"] = 0;
              jsonData["params"]["parameters"][j]["value-length"] = jsonData["params"]["parameters"][j]["value"].length;
            }

            console.log(jsonData);
            fetch(updateHost, {
              method: 'POST',
              //mode: 'no-cors',
              headers: {
                'Accept': 'application/json',
                //'Content-Type': 'application/json'
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                //'Cookie': 'PHPSESSID=v5vpc159mqeuj1dijlul0r05u7; webeasy-loggedin=true;',
                //'Authorization:': 'Session v5vpc159mqeuj1dijlul0r05u7',
                'Sec-Fetch-Mode': 'cors'
              },
              body: JSON.stringify(jsonData)
            }).then(function (response) {
              console.log(response);
            })
          }
          if (this.multiAudio.data.length > 0 && this.targetAudioChSelected > 0) {
            chanStartIdx = this.targetAudioChSelected;
            let jsonDataAudio = {
              "jsonrpc": "2.0",
              "method": "set",
              "params": {
                "parameters": [{
                  "id": "83.0@s",
                  "type": "string",
                  "name": "URL",
                  "value": "https://localhost test",
                  "value-length": 22
                }, {
                  "id": "113.0@i",
                  "name": "Auto Manage Audio Streams",
                  "type": "integer",
                  "value": 1,
                  "value-length": 1
                }]
              },
              "id": 57,
              "username": "admin"
            }
            jsonDataAudio["params"]["parameters"][0]["id"] = urlFieldId + "." + chanStartIdx + "@s";
            jsonDataAudio["params"]["parameters"][0]["value"] = this.channelData.mediaLink;
            jsonDataAudio["params"]["parameters"][0]["value-length"] = jsonDataAudio["params"]["parameters"][0]["value"].length;
            jsonDataAudio["params"]["parameters"][1]["id"] = autoManageAudioStreamsFieldId + "." + chanStartIdx + "@i";
            jsonDataAudio["params"]["parameters"][1]["value"] = 1;
            jsonDataAudio["params"]["parameters"][1]["value-length"] = jsonDataAudio["params"]["parameters"][1]["value"].length;

            fetch(updateHost, {
              method: 'POST',
              mode: 'no-cors',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(jsonDataAudio)
            }).then(function (response) {
              console.log(response);
            })
          }

        }
      } else {

        for (i = 0; i < 6; i++) {
          let jsonData = {
            "jsonrpc": "2.0",
            "method": "set",
            "params": {
              "parameters": [{
                "id": "82.0@s",
                "type": "string",
                "name": "Name",
                "value": "CH1 TEST0000 XXX XXXXXX PRI/SEC R1",
                "value-length": 34
              }, {
                "id": "83.0@s",
                "type": "string",
                "name": "URL",
                "value": "https://localhost test",
                "value-length": 22
              }, {
                "id": "113.0@i",
                "name": "Auto Manage Audio Streams",
                "type": "integer",
                "value": 1,
                "value-length": 1
              }, {
                "id": "107.0@s",
                "type": "string",
                "value": 1,
                "value-length": 1
              }, {
                "id": "102.0@i",
                "type": "integer",
                "name": "Type",
                "value": 5,
                "value-length": 1
              }]
            },
            "id": 57,
            "username": "admin"
          }
          let description = this.channelData.title + " - SINGLE" + " - R" + (i + 1);
          /*                    let updateUrl = updateHost
              + descriptionFieldId + "." + (chanStartIdx + i)  + '@s=' + encodeURI(description) + ","
              + urlFieldId + "." + (chanStartIdx + i)  + '@s=' + encodeURI(this.channelData.hlsLink)
              + ";time=&" + time;*/
          jsonData["params"]["parameters"][0]["id"] = descriptionFieldId + "." + (chanStartIdx + i) + "@s";
          jsonData["params"]["parameters"][0]["value"] = description;
          jsonData["params"]["parameters"][0]["value-length"] = jsonData["params"]["parameters"][0]["value"].length;
          jsonData["params"]["parameters"][1]["id"] = urlFieldId + "." + (chanStartIdx + i) + "@s";
          jsonData["params"]["parameters"][1]["value"] = this.channelData.mediaLink;
          jsonData["params"]["parameters"][1]["value-length"] = jsonData["params"]["parameters"][1]["value"].length;
          jsonData["params"]["parameters"][2]["id"] = autoManageAudioStreamsFieldId + "." + (chanStartIdx + i) + "@i";
          jsonData["params"]["parameters"][2]["value"] = 1;
          jsonData["params"]["parameters"][2]["value-length"] = jsonData["params"]["parameters"][1]["value"].length;
          jsonData["params"]["parameters"][3]["id"] = programListFieldId + "." + (chanStartIdx + i) + "@s";
          jsonData["params"]["parameters"][3]["value"] = i.toString();
          jsonData["params"]["parameters"][3]["value-length"] = jsonData["params"]["parameters"][3]["value"].length;
          jsonData["params"]["parameters"][4]["id"] = typeFieldId + "." + (chanStartIdx + i) + "@i";
          jsonData["params"]["parameters"][4]["value"] = 5;
          jsonData["params"]["parameters"][4]["value-length"] = jsonData["params"]["parameters"][4]["value"].length;

          console.log(jsonData);
          fetch(updateHost, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Accept': 'application/json',
              //'Content-Type': 'application/json'
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              //'Cookie': 'PHPSESSID=v5vpc159mqeuj1dijlul0r05u7; webeasy-loggedin=true;',
              //'Authorization:': 'Session v5vpc159mqeuj1dijlul0r05u7',
              'Sec-Fetch-Mode': 'cors'
            },
            body: JSON.stringify(jsonData)
          }).then(function (response) {
            console.log(response);
          })
        }

      }

      //{"jsonrpc":"2.0","method":"set","params":{"parameters":[{"id":"82.0@s","type":"string","name":"Name","value":"CH1 TEST0000 XXX XXXXXX PRI/SEC R1","value-length":34}]},"id":57,"username":"admin"}
      //{"jsonrpc":"2.0","method":"set","params":{"parameters":[{"id":"82.0@s","type":"string","name":"Name","value":"CH1 0000 test XXX XXXXXX PRI/SEC R1","value-length":35},{"id":"83.0@s","type":"string","name":"URL","value":"https://localhost test","value-length":22}]},"id":31,"username":"admin"}:
      //{"jsonrpc":"2.0","method":"set","params":{"parameters":[{"id":"82.1@s","type":"string","name":"Name","value":"CH1 Test0000 XXX XXXXXX PRI/SEC R2","value-length":34},{"id":"83.0@s","type":"string","name":"URL","value":"https://localhost test","value-length":22}]},"id":63,"username":"admin"}
      //{"jsonrpc":"2.0","method":"set","params":{"parameters":[{"id":"82.2@s","type":"string","name":"Name","value":"CH1 test0000 XXX XXXXXX PRI/SEC R3","value-length":34}]},"id":69,"username":"admin"}:





    },
    extractHlsMultiaudio(res){
      let audioArrRaw = res.data.split("\n").filter(str => !str.indexOf("#EXT-X-MEDIA:TYPE=AUDIO"));
      if(audioArrRaw.length > 0) {
        let multiAudio2 = audioArrRaw.map(element => element.split(","));
        let multiAudio3 = multiAudio2.map(element2 => element2.filter(element3 => (element3.indexOf("URI") > -1 || element3.indexOf("LANGUAGE") > -1)));
        let returnArr = [];
        multiAudio3.forEach((element) => {
          let langIdUrl = {
            id: element[0].split("=")[1].replace(/"/g,""),
            url: element[1].split("=")[1].replace(/"/g,"")
          }
          this.languageStrArr.push(langIdUrl.id);
          returnArr.push(langIdUrl)
        });
        this.languageStr = " (" + this.languageStrArr.join(" ").toUpperCase() + ")";
        this.isLoading = false;
        if(this.selected !== null) {
          this.setChannelDataTitle(this.selected)
        }
        else {
          if(this.channelData.title === "") {
            this.channelData.title = "CH " + this.rowId + " -" + this.languageStr;
          }
        }

        return {data:returnArr};
      }
      else{
        this.isLoading = false;
        this.languageStrArr = [];
        return {error:"NO MULTIAUDIO DETECTED", data:[]};
      }
    },

    extractDashMultiaudio(res){
      let url = this.channelData.mediaLink;
      let numOfLangs = 0;
      let returnArr = [];

      parseString(res.data, {mergeAttrs: true},  function (err, result) {
        for(let i = 0; i < result['MPD']['Period'].length; i++){
          //this.languageStrArr.push(langIdUrl.id);
          for(const j in result['MPD']['Period'][i]['AdaptationSet']){
            let langIdUrl = {
              id: "",
              url: ""
            }
            for(const k in result['MPD']['Period'][i]['AdaptationSet'][j]){
              //console.log(`${k}: ${result['MPD']['Period'][i]['AdaptationSet'][j][k]}`)
              if(k === 'lang'){
                console.log("language found ------------------> " + result['MPD']['Period'][i]['AdaptationSet'][j][k])
                numOfLangs++;
                langIdUrl.id = result['MPD']['Period'][i]['AdaptationSet'][j][k];
              }
              if(k === 'SegmentTemplate'){
                for(const l in result['MPD']['Period'][i]['AdaptationSet'][j][k]){
                  //console.log(Object.getOwnPropertyNames(result['MPD']['Period'][i]['AdaptationSet'][j][k][l]));
                  for(const m in result['MPD']['Period'][i]['AdaptationSet'][j][k][l]){
                    if(m === 'media'){
                      //console.log(`${m}: ${result['MPD']['Period'][i]['AdaptationSet'][j][k][l][m]}`);
                      let medialink = url.replace('master.mpd', result['MPD']['Period'][i]['AdaptationSet'][j][k][l][m]);
                      console.log("medialink template: " + medialink);
                      langIdUrl.url = medialink;
                      returnArr.push(langIdUrl);
                    }
                  }
                }
              }
            }
          }
        }
      });
      if(numOfLangs < 2){
        this.isLoading = false;
        this.languageStrArr = [];
        return {error:"NO MULTIAUDIO DETECTED", data:[]};
      }
      this.languageStr = " (" + this.languageStrArr.join(" ").toUpperCase() + ")";
      this.isLoading = false;
      if(this.selected !== null) {
        this.setChannelDataTitle(this.selected)
      }
      else {
        if(this.channelData.title === "") {
          this.channelData.title = "CH " + this.rowId + " -" + this.languageStr;
        }
      }
      return {data:returnArr};
    },

    checkMultiaudio() {
      if(this.channelData.mediaLink.endsWith('.m3u8')){
        this.isLoading = true;
        this.multiAudio = {data:[]};
        this.languageStrArr = [];
        let hlsLink = this.channelData.mediaLink;
        axios.get(hlsLink)
            .then((res) => {
              this.multiAudio = this.extractHlsMultiaudio(res)  // method call to method2
            } )
            .catch(
                err => { // noinspection CommaExpressionJS
                  this.multiAudio = {error:err, data:[]},  this.isLoading = false}
            )
      } else if(this.channelData.mediaLink.endsWith('.mpd')){
        this.isLoading = true;
        this.multiAudio = {data:[]};
        this.languageStrArr = [];
        let dashLink = this.channelData.mediaLink;
        axios.get(dashLink)
            .then((res) => {
              this.multiAudio = this.extractDashMultiaudio(res)
            })
            .catch(
                err => { // noinspection CommaExpressionJS
                  this.multiAudio = {error: err, data:[]}, this.isLoading = false}
            )
      }
    },
    clearChannel() {
      let descriptionFieldId = 82;
      let urlFieldId = 83;
      let typeFieldId = 102;
      let updateHost = "https://10.5.68.132/cgi-bin/cfgjsonrpc";
      let chanIdx = this.rowId;
      let chanStartIdx =  (chanIdx > 1) ? (chanIdx * 6) - 6 : 0;
      let i;
      for (i = 0; i < 6; i++) {
        let description =
            "CH " + chanIdx
            + " - 0000"
            + " - XXX"
            + " - XXXXXXXXXX"
            + " - OAP/ADs"
            + " - PRI/SEC"
            + " - R" + (i+1);
        let jsonData = {
          "jsonrpc": "2.0",
          "method": "set",
          "params": {
            "parameters": [{
              "id": "82.0@s",
              "type": "string",
              "name": "Name",
              "value": "CH1 TEST0000 XXX XXXXXX PRI/SEC R1",
              "value-length": 34
            },{
              "id": "82.0@s",
              "type": "string",
              "name": "Name",
              "value": "CH1 TEST0000 XXX XXXXXX PRI/SEC R1",
              "value-length": 34
            }, {
              "id": "102.0@i",
              "type": "integer",
              "name": "Type",
              "value": 5,
              "value-length": 1
            }]
          },
          "id": 57,
          "username": "admin"
        }
        jsonData["params"]["parameters"][0]["id"] = descriptionFieldId + "." + (chanStartIdx + i) + "@s";
        jsonData["params"]["parameters"][0]["value"] = description;
        jsonData["params"]["parameters"][0]["value-length"] = jsonData["params"]["parameters"][0]["value"].length;
        jsonData["params"]["parameters"][1]["id"] = urlFieldId + "." + (chanStartIdx + i) + "@s";
        jsonData["params"]["parameters"][1]["value"] = "";
        jsonData["params"]["parameters"][1]["value-length"] = jsonData["params"]["parameters"][1]["value"].length;
        jsonData["params"]["parameters"][2]["id"] = typeFieldId + "." + (chanStartIdx + i) + "@i";
        jsonData["params"]["parameters"][2]["value"] = 5;
        jsonData["params"]["parameters"][2]["value-length"] = jsonData["params"]["parameters"][2]["value"].length;
        fetch(updateHost, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(jsonData)
        }).then(function (response) {
          console.log(response);
        })
      }
      if(this.targetAudioChSelected !== null) {
        chanStartIdx = this.targetAudioChSelected;
        for (i = 0; i < 4; i++) {
          let jsonDataAudio = {
            "jsonrpc": "2.0",
            "method": "set",
            "params": {
              "parameters": [{
                "id": "",
                "type": "string",
                "name": "Name",
                "value": "",
                "value-length": 0
              }]
            },
            "id": 57,
            "username": "admin"
          }
          jsonDataAudio["params"]["parameters"][0]["id"] = urlFieldId + "." + (chanStartIdx + i) + "@s";
          jsonDataAudio["params"]["parameters"][0]["value"] = "";
          jsonDataAudio["params"]["parameters"][0]["value-length"] = jsonDataAudio["params"]["parameters"][0]["value"].length;

          fetch(updateHost, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonDataAudio)
          }).then(function (response) {
            console.log(response);
          })
        }
      }
    },
  },
  mounted() {
    //console.log("livePrograms i :" + this.targetAudioChOptions.find(opt => opt.initCh === this.livePrograms.i));
    this.targetAudioChSelected = (typeof this.targetAudioChOptions.find(opt => opt.initCh === this.rowId) !== "undefined") ?  this.targetAudioChOptions.find(x => x.initCh === this.rowId).value : null;
    //console.log("livePrograms:" + livePrograms)
    //this.importFromMultiviewer();
    this.setHlsSource();
  }
}
</script>

<style scoped>
</style>
