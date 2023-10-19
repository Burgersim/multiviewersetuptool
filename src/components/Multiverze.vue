<template>
  <div class="container">
    <div class="box">
      <div class="columns is-centered" style="text-align: center;">
        <div class="control" style="margin: 0 auto;">
          <b-button type="is-danger" style="margin: 0 5px" v-on:click="clearAllChannels()">CLEAR All CHANNELS</b-button>
          <b-button type="is-success" style="margin: 0 5px" v-on:click="resetMultiviewer()">RESET MULTIVIEWER</b-button>
          <b-button type="is-info" style="margin: 0 5px" v-on:click="moFriMonitoring()">FULL LINEAR MONITORING</b-button>
          <b-button type="is-dark" style="margin: 0 5px" v-on:click="setRow7_8()">SET ROW 7 & 8 TO LINEAR</b-button>
        </div>
      </div >
    </div>
    <div class="box" v-for="n in 8" v-bind:key="n">
      <MultiverzeSingleChannel v-bind:mvrzSingleChannelData="{i:n, allLivePrograms}"/>
    </div>
  </div>
</template>
<script>
import MultiverzeSingleChannel from "./MultiverzeSingleChannel";

async function getRenditionCount(manifestLink) {
  switch(manifestLink){
    case "https://stv-live.akamaized.net/hls/live/2031011/lingeoSTVATwebPri/master.m3u8":
      return 4
    case "https://stv-live.akamaized.net/hls/live/2031021/lingeoSTVATwebBU/master.m3u8":
      return 4
    case "https://stv-live.akamaized.net/hls/live/2031012/lingeoSTVDEwebPri/master.m3u8":
      return 4
    case "https://stv-live.akamaized.net/hls/live/2031020/lingeoSTVDEwebBU/master.m3u8":
      return 4
    case "https://rbmn-live.akamaized.net/hls/live/665268/Wetterpanorama/master.m3u8":
      return 3
    case "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8":
      return 6
    case "https://rbmn-live.akamaized.net/hls/live/622817/BoRB-Int-BU/master.m3u8":
      return 6
    case "https://rbmn-live.akamaized.net/dash/live/731322/BoRB/master.mpd":
      return 6
    case "https://rbmn-live.akamaized.net/hls/live/2004294/BoRB-USPri/master.m3u8":
      return 6
    case "https://rbmn-live.akamaized.net/hls/live/724475/BoRB-USBU/master.m3u8":
      return 6
    case "https://rbmn-live.akamaized.net/dash/live/2043532/BoRBUS/master.mpd":
      return 6
    case "https://rbmn-live.akamaized.net/hls/live/2004294/RBTVDACHPri/master.m3u8":
      return 4
    case "https://rbmn-live.akamaized.net/hls/live/709027/RBTVDACHBU/master.m3u8":
      return 4
  }
}

export default {
  name: "Multiverze",
  components: {
    MultiverzeSingleChannel
  },
  props: ["allLivePrograms"],
  methods: {

    clearAllChannels() {
      let descriptionFieldId = 82;
      let urlFieldId = 83;
      let typeFieldId = 102;
      let updateHost = "https://10.5.68.132/cgi-bin/cfgjsonrpc";
      let i;
      for (i = 0; i < 64; i++) {
        let description =
            "CH " + i
            + " - 0000"
            + " - XXX"
            + " - XXXXXXXXXX"
            + " - OAP/ADs"
            + " - PRI/SEC"
            + " - R" + (i + 1);
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
        jsonData["params"]["parameters"][0]["id"] = descriptionFieldId + "." + i + "@s";
        jsonData["params"]["parameters"][0]["value"] = description;
        jsonData["params"]["parameters"][0]["value-length"] = jsonData["params"]["parameters"][0]["value"].length;
        jsonData["params"]["parameters"][1]["id"] = urlFieldId + "." + i + "@s";
        jsonData["params"]["parameters"][1]["value"] = "";
        jsonData["params"]["parameters"][1]["value-length"] = jsonData["params"]["parameters"][1]["value"].length;
        jsonData["params"]["parameters"][2]["id"] = typeFieldId + "." + i + "@i";
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
    },

    resetMultiviewer() {
      let stvAtMain = "https://stv-live.akamaized.net/hls/live/2031011/lingeoSTVATwebPri/master.m3u8";
      let stvAtBu = "https://stv-live.akamaized.net/hls/live/2031021/lingeoSTVATwebBU/master.m3u8";
      let stvDeMain = "https://stv-live.akamaized.net/hls/live/2031012/lingeoSTVDEwebPri/master.m3u8";
      let stvDeBu = "https://stv-live.akamaized.net/hls/live/2031020/lingeoSTVDEwebBU/master.m3u8";
      let stvWetterpanorama = "https://rbmn-live.akamaized.net/hls/live/665268/Wetterpanorama/master.m3u8";

      let worbIntPri = "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8"
      let worbIntSec = "https://rbmn-live.akamaized.net/hls/live/622817/BoRB-Int-BU/master.m3u8"
      let worbIntDash = "https://rbmn-live.akamaized.net/dash/live/731322/BoRB/master.mpd"
      let worbUsPri = "https://rbmn-live.akamaized.net/hls/live/2004294/BoRB-USPri/master.m3u8"
      let worbUsSec = "https://rbmn-live.akamaized.net/hls/live/724475/BoRB-USBU/master.m3u8"
      //let worbUsDash = "https://rbmn-live.akamaized.net/dash/live/2043532/BoRBUS/master.mpd"
      let worbDachPri = "https://rbmn-live.akamaized.net/hls/live/2004294/RBTVDACHPri/master.m3u8"
      let worbDachSec = "https://rbmn-live.akamaized.net/hls/live/709027/RBTVDACHBU/master.m3u8"

      let descriptionFieldId = 82;
      let urlFieldId = 83;
      let typeFieldId = 102;
      //let programListFieldId = 107;
      let requestedProgramFieldId = 88;
      let requestedProgramModeFieldId = 106;
      let updateHost = "https://10.5.68.132/cgi-bin/cfgjsonrpc";
      let i;
      for (i = 0; i < 64; i++) {
        let description =
            "CH " + i
            + " - 0000"
            + " - XXX"
            + " - XXXXXXXXXX"
            + " - OAP/ADs"
            + " - PRI/SEC"
            + " - R" + (i + 1);
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
            }, {
              "id": "88.0@s",
              "type": "string",
              "name": "Requested Program ID",
              "value": 5,
              "value-length": 1
            }, {
              "id": "106.0@i",
              "type": "integer",
              "name": "Requested Program Mode",
              "value": 1,
              "value-length": 1
            }]
          },
          "id": 57,
          "username": "admin"
        }


        //if channel is lower than 43, clear all (default description, no link)
        if(i < 36 || i > 47){
          jsonData["params"]["parameters"][0]["value"] = description;
          jsonData["params"]["parameters"][1]["value"] = "";
        } //otherwise fill channel with corresponding Linear Stream
        else if (i === 36){
          jsonData["params"]["parameters"][0]["value"] = "STV AT MAIN";
          jsonData["params"]["parameters"][1]["value"] = stvAtMain;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(stvAtMain);
        } else if (i === 37){
          jsonData["params"]["parameters"][0]["value"] = "STV AT BU";
          jsonData["params"]["parameters"][1]["value"] = stvAtBu;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(stvAtBu);
        } else if (i === 38){
          jsonData["params"]["parameters"][0]["value"] = "STV DE MAIN";
          jsonData["params"]["parameters"][1]["value"] = stvDeMain;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(stvDeMain);
        } else if (i === 39){
          jsonData["params"]["parameters"][0]["value"] = "STV DE BU";
          jsonData["params"]["parameters"][1]["value"] = stvDeBu;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(stvDeBu);
        } else if (i === 40){
          jsonData["params"]["parameters"][0]["value"] = "STV Wetterpanorama";
          jsonData["params"]["parameters"][1]["value"] = stvWetterpanorama;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(stvWetterpanorama);
        } else if (i === 41){
          jsonData["params"]["parameters"][0]["value"] = "WoRB INT DASH";
          jsonData["params"]["parameters"][1]["value"] = worbIntDash;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(worbIntDash);
        } else if (i === 42){
          jsonData["params"]["parameters"][0]["value"] = "WoRB INT PRI";
          jsonData["params"]["parameters"][1]["value"] = worbIntPri;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(worbIntPri);
        } else if (i === 43){
          jsonData["params"]["parameters"][0]["value"] = "WoRB INT SEC";
          jsonData["params"]["parameters"][1]["value"] = worbIntSec;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(worbIntSec);
        } else if (i === 44){
          jsonData["params"]["parameters"][0]["value"] = "WoRB US PRI";
          jsonData["params"]["parameters"][1]["value"] = worbUsPri;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(worbUsPri);
        } else if (i === 45){
          jsonData["params"]["parameters"][0]["value"] = "WoRB US SEC";
          jsonData["params"]["parameters"][1]["value"] = worbUsSec;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(worbUsSec);
        } else if (i === 46){
          jsonData["params"]["parameters"][0]["value"] = "WoRB DACH PRI";
          jsonData["params"]["parameters"][1]["value"] = worbDachPri;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(worbDachPri);
        } else if (i === 47){
          jsonData["params"]["parameters"][0]["value"] = "WoRB DACH SEC";
          jsonData["params"]["parameters"][1]["value"] = worbDachSec;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(worbDachSec);
        }

        jsonData["params"]["parameters"][0]["id"] = descriptionFieldId + "." + i + "@s";
        jsonData["params"]["parameters"][0]["value-length"] = jsonData["params"]["parameters"][0]["value"].length;
        jsonData["params"]["parameters"][1]["id"] = urlFieldId + "." + i + "@s";
        jsonData["params"]["parameters"][1]["value-length"] = jsonData["params"]["parameters"][1]["value"].length;
        jsonData["params"]["parameters"][2]["id"] = typeFieldId + "." + i + "@i";
        jsonData["params"]["parameters"][2]["value"] = 5;
        jsonData["params"]["parameters"][2]["value-length"] = jsonData["params"]["parameters"][3]["value"].length;
        jsonData["params"]["parameters"][3]["id"] = requestedProgramFieldId + "." + i + "@s";
        jsonData["params"]["parameters"][3]["value-length"] = jsonData["params"]["parameters"][2]["value"].length;
        jsonData["params"]["parameters"][4]["id"] = requestedProgramModeFieldId + "." + i + "@i";
        jsonData["params"]["parameters"][4]["value-length"] = jsonData["params"]["parameters"][2]["value"].length;



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
    },

    moFriMonitoring(){
      let descriptionFieldId = 82;
      let urlFieldId = 83;
      let typeFieldId = 102;
      let autoManageAudioStreamsFieldId = 113;
      let programListFieldId = 107;
      let requestedProgramFieldId = 88;
      let requestedProgramModeFieldId = 106;
      let channelAmount = 3;
      let updateHost = "https://10.5.68.132/cgi-bin/cfgjsonrpc";

      let stvAtMain = "https://stv-live.akamaized.net/hls/live/2031011/lingeoSTVATwebPri/master.m3u8";
      let stvAtBu = "https://stv-live.akamaized.net/hls/live/2031021/lingeoSTVATwebBU/master.m3u8";
      let stvDeMain = "https://stv-live.akamaized.net/hls/live/2031012/lingeoSTVDEwebPri/master.m3u8";
      let stvDeBu = "https://stv-live.akamaized.net/hls/live/2031020/lingeoSTVDEwebBU/master.m3u8";
      let stvWetterpanorama = "https://rbmn-live.akamaized.net/hls/live/665268/Wetterpanorama/master.m3u8";

      let worbIntPri = "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8"
      let worbIntSec = "https://rbmn-live.akamaized.net/hls/live/622817/BoRB-Int-BU/master.m3u8"
      let worbIntDash = "https://rbmn-live.akamaized.net/dash/live/731322/BoRB/master.mpd"
      let worbUsPri = "https://rbmn-live.akamaized.net/hls/live/2004294/BoRB-USPri/master.m3u8"
      let worbUsSec = "https://rbmn-live.akamaized.net/hls/live/724475/BoRB-USBU/master.m3u8"
      //let worbUsDash = "https://rbmn-live.akamaized.net/dash/live/2043532/BoRBUS/master.mpd"
      let worbDachPri = "https://rbmn-live.akamaized.net/hls/live/2004294/RBTVDACHPri/master.m3u8"
      let worbDachSec = "https://rbmn-live.akamaized.net/hls/live/709027/RBTVDACHBU/master.m3u8"

      let UrlArray = [stvAtMain, stvAtBu, stvDeMain, stvDeBu, stvWetterpanorama , worbIntDash, worbIntPri, worbIntSec, worbUsPri, worbUsSec, worbDachPri, worbDachSec];
      console.log("Array Length: " + UrlArray.length);
      let renditionCountArray = []

      for(let i = 0; i < UrlArray.length; i++){
        renditionCountArray.push(getRenditionCount(UrlArray[i]))
      }

      for(let k = 0; k < UrlArray.length; k++){
        for (let i = 0 ; i < channelAmount; i++) {
          console.log("k: " + k);
          console.log("i: " + i);
          console.log("k*6 + i: " + ((k*channelAmount)+i));
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
                "name": "Name",
                "value": "CH1 TEST0000 XXX XXXXXX PRI/SEC R1",
                "value-length": 34
              }, {
                "id": "102.0@i",
                "type": "integer",
                "name": "Type",
                "value": 5,
                "value-length": 1
              }, {
                "id": "88.0@s",
                "type": "string",
                "name": "Requested Program ID",
                "value": 5,
                "value-length": 1
              }, {
                "id": "106.0@i",
                "type": "integer",
                "name": "Requested Program Mode",
                "value": 1,
                "value-length": 1
              }]
            },
            "id": 57,
            "username": "admin"
          }

          let description = "";

          switch (k){
            case 0:
              description = "STV AT MAIN";
              break;
            case 2:
              description = "STV DE MAIN";
              break;
            case 4:
              description = "STV Wetterpanorama";
              break;
            case 6:
              description = "WORB INT PRI";
              break;
            case 8:
              description = "WORB US PRI";
              break;
            case 10:
              description = "WORB DACH PRI";
              break;
            case 1:
              description = "STV AT BU";
              break;
            case 3:
              description = "STV DE BU";
              break;
            case 5:
              description = "WORB INT DASH";
              break;
            case 7:
              description = "WORB INT SEC";
              break;
            case 9:
              description = "WORB US SEC";
              break;
            case 11:
              description = "WORB DACH SEC";
              break;
          }


          /*                    let updateUrl = updateHost
              + descriptionFieldId + "." + (chanStartIdx + i)  + '@s=' + encodeURI(description) + ","
              + urlFieldId + "." + (chanStartIdx + i)  + '@s=' + encodeURI(this.channelData.hlsLink)
              + ";time=&" + time;*/
          jsonData["params"]["parameters"][0]["id"] = descriptionFieldId + "." + ((k*channelAmount) + i) + "@s";
          jsonData["params"]["parameters"][0]["value"] = description;
          jsonData["params"]["parameters"][0]["value-length"] = jsonData["params"]["parameters"][0]["value"].length;
          jsonData["params"]["parameters"][1]["id"] = urlFieldId + "." + ((k*channelAmount) + i) + "@s";
          jsonData["params"]["parameters"][1]["value"] = UrlArray[k];
          jsonData["params"]["parameters"][1]["value-length"] = jsonData["params"]["parameters"][1]["value"].length;
          jsonData["params"]["parameters"][2]["id"] = autoManageAudioStreamsFieldId + "." + ((k*channelAmount) + i) + "@i";
          jsonData["params"]["parameters"][2]["value"] = 1;
          jsonData["params"]["parameters"][2]["value-length"] = jsonData["params"]["parameters"][2]["value"].length;
          jsonData["params"]["parameters"][3]["id"] = programListFieldId + "." + ((k*channelAmount) + i) + "@s";
          jsonData["params"]["parameters"][3]["value"] = i.toString();
          jsonData["params"]["parameters"][3]["value-length"] = jsonData["params"]["parameters"][3]["value"].length;
          jsonData["params"]["parameters"][4]["id"] = typeFieldId + "." + ((k*channelAmount) + i) + "@i";
          jsonData["params"]["parameters"][4]["value"] = 5;
          jsonData["params"]["parameters"][4]["value-length"] = jsonData["params"]["parameters"][4]["value"].length;
          jsonData["params"]["parameters"][5]["id"] = requestedProgramFieldId + "." + ((k*channelAmount) + i) + "@s";
          jsonData["params"]["parameters"][5]["value"] = renditionCountArray[k]+(i-2);
          jsonData["params"]["parameters"][5]["value-length"] = jsonData["params"]["parameters"][4]["value"].length;
          jsonData["params"]["parameters"][6]["id"] = requestedProgramModeFieldId + "." + ((k*channelAmount) + i) + "@i";
          jsonData["params"]["parameters"][6]["value"] = 1;
          jsonData["params"]["parameters"][6]["value-length"] = jsonData["params"]["parameters"][4]["value"].length;

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

    },

    setRow7_8() {
      let stvAtMain = "https://stv-live.akamaized.net/hls/live/2031011/lingeoSTVATwebPri/master.m3u8";
      let stvAtBu = "https://stv-live.akamaized.net/hls/live/2031021/lingeoSTVATwebBU/master.m3u8";
      let stvDeMain = "https://stv-live.akamaized.net/hls/live/2031012/lingeoSTVDEwebPri/master.m3u8";
      let stvDeBu = "https://stv-live.akamaized.net/hls/live/2031020/lingeoSTVDEwebBU/master.m3u8";
      let stvWetterpanorama = "https://rbmn-live.akamaized.net/hls/live/665268/Wetterpanorama/master.m3u8";

      let worbIntPri = "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8"
      let worbIntSec = "https://rbmn-live.akamaized.net/hls/live/622817/BoRB-Int-BU/master.m3u8"
      let worbIntDash = "https://rbmn-live.akamaized.net/dash/live/731322/BoRB/master.mpd"
      let worbUsPri = "https://rbmn-live.akamaized.net/hls/live/2004294/BoRB-USPri/master.m3u8"
      let worbUsSec = "https://rbmn-live.akamaized.net/hls/live/724475/BoRB-USBU/master.m3u8"
      //let worbUsDash = "https://rbmn-live.akamaized.net/dash/live/2043532/BoRBUS/master.mpd"
      let worbDachPri = "https://rbmn-live.akamaized.net/hls/live/2004294/RBTVDACHPri/master.m3u8"
      let worbDachSec = "https://rbmn-live.akamaized.net/hls/live/709027/RBTVDACHBU/master.m3u8"

      let descriptionFieldId = 82;
      let urlFieldId = 83;
      let typeFieldId = 102;
      let requestedProgramFieldId = 88;
      let requestedProgramModeFieldId = 106;
      let updateHost = "https://10.5.68.132/cgi-bin/cfgjsonrpc";
      let i;
      for (i = 36; i < 48; i++) {
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
            }, {
              "id": "88.0@s",
              "type": "string",
              "name": "Requested Program ID",
              "value": 5,
              "value-length": 1
            }, {
              "id": "106.0@i",
              "type": "integer",
              "name": "Requested Program Mode",
              "value": 1,
              "value-length": 1
            }]
          },
          "id": 57,
          "username": "admin"
        }


        if (i === 36){
          jsonData["params"]["parameters"][0]["value"] = "STV AT MAIN";
          jsonData["params"]["parameters"][1]["value"] = stvAtMain;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(stvAtMain);
        } else if (i === 37){
          jsonData["params"]["parameters"][0]["value"] = "STV AT BU";
          jsonData["params"]["parameters"][1]["value"] = stvAtBu;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(stvAtBu);
        } else if (i === 38){
          jsonData["params"]["parameters"][0]["value"] = "STV DE MAIN";
          jsonData["params"]["parameters"][1]["value"] = stvDeMain;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(stvDeMain);
        } else if (i === 39){
          jsonData["params"]["parameters"][0]["value"] = "STV DE BU";
          jsonData["params"]["parameters"][1]["value"] = stvDeBu;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(stvDeBu);
        } else if (i === 40){
          jsonData["params"]["parameters"][0]["value"] = "STV Wetterpanorama";
          jsonData["params"]["parameters"][1]["value"] = stvWetterpanorama;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(stvWetterpanorama);
        } else if (i === 41){
          jsonData["params"]["parameters"][0]["value"] = "WoRB INT DASH";
          jsonData["params"]["parameters"][1]["value"] = worbIntDash;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(worbIntDash);
        } else if (i === 42){
          jsonData["params"]["parameters"][0]["value"] = "WORB INT PRI";
          jsonData["params"]["parameters"][1]["value"] = worbIntPri;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(worbIntPri);
        } else if (i === 43){
          jsonData["params"]["parameters"][0]["value"] = "WORB INT SEC";
          jsonData["params"]["parameters"][1]["value"] = worbIntSec;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(worbIntSec);
        } else if (i === 44){
          jsonData["params"]["parameters"][0]["value"] = "WORB US PRI";
          jsonData["params"]["parameters"][1]["value"] = worbUsPri;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(worbUsPri);
        } else if (i === 45){
          jsonData["params"]["parameters"][0]["value"] = "WORDB US SEC";
          jsonData["params"]["parameters"][1]["value"] = worbUsSec;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(worbUsSec);
        } else if (i === 46){
          jsonData["params"]["parameters"][0]["value"] = "WORB DACH PRI";
          jsonData["params"]["parameters"][1]["value"] = worbDachPri;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(worbDachPri);
        } else if (i === 47){
          jsonData["params"]["parameters"][0]["value"] = "WORB DACH SEC";
          jsonData["params"]["parameters"][1]["value"] = worbDachSec;
          jsonData["params"]["parameters"][3]["value"] = getRenditionCount(worbDachSec);
        }

        jsonData["params"]["parameters"][0]["id"] = descriptionFieldId + "." + i + "@s";
        jsonData["params"]["parameters"][0]["value-length"] = jsonData["params"]["parameters"][0]["value"].length;
        jsonData["params"]["parameters"][1]["id"] = urlFieldId + "." + i + "@s";
        jsonData["params"]["parameters"][1]["value-length"] = jsonData["params"]["parameters"][1]["value"].length;
        jsonData["params"]["parameters"][2]["id"] = typeFieldId + "." + i + "@i";
        jsonData["params"]["parameters"][2]["value-length"] = jsonData["params"]["parameters"][2]["value"].length;
        jsonData["params"]["parameters"][3]["id"] = requestedProgramFieldId + "." + i + "@s";
        jsonData["params"]["parameters"][3]["value-length"] = jsonData["params"]["parameters"][2]["value"].length;
        jsonData["params"]["parameters"][4]["id"] = requestedProgramModeFieldId + "." + i + "@i";
        jsonData["params"]["parameters"][4]["value-length"] = jsonData["params"]["parameters"][2]["value"].length;



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
    }

  }
}



</script>

<style scoped>

</style>
