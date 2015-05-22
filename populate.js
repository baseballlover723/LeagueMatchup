"use strict";
// TODO check to make sure deaths are deaths and assists are assists, they may be swaped

// store query
//SELECT `Match_ID`, `Lane`, `Game_Rank`, `Champ_1`, SUM(`Kills_1`), AVG(`Assists_1`), `Deaths_1`, `Lane_Kills_1`, `Lane_Assists_1`, `Lane_Deaths_1`, `Tower_Kills_1`, `CS_1`, `Gold_1`, `Champ_2`, `Kills_2`, `Assists_2`, `Deaths_2`, `Lane_Kills_2`, `Lane_Assists_2`, `Lane_Deaths_2`, `Tower_Kills_2`, `CS_2`, `Gold_2` FROM `single_matchup` WHERE 1 GROUP BY Champ_1, Champ_2

// SELECT `Lane`, `Game_Rank`, `Champ_1`, `Champ_2`, COUNT(*) AS Numb_Of_Matchesups, SUM(Kills_1), SUM(Deaths_1), SUM(Assists_1)  FROM `single_matchup` WHERE 1 GROUP BY Champ_1, Champ_2, Lane

// good
// SELECT `Lane`, `Game_Rank`, `Champ_1`, `Champ_2`, COUNT(*) AS Numb_Of_Matchesups, AVG(Kills_1), AVG(Deaths_1), AVG(Assists_1), AVG(Lane_Kills_1), AVG(Lane_Deaths_1), AVG(Lane_Assists_1), AVG(Tower_Kills_1), AVG(CS_1), AVG(Gold_1), AVG(Kills_2), AVG(Deaths_2), AVG(Assists_2), AVG(Lane_Kills_2), AVG(Lane_Deaths_2), AVG(Lane_Assists_2), AVG(Tower_Kills_2), AVG(CS_2), AVG(Gold_2) FROM `single_matchup` WHERE 1 GROUP BY Champ_1, Champ_2, Lane

// put bot lane match ups in its own table not the matchups table
// mySummonerId = 60872099
//var KEYS = ["f5c821d7-fc96-47f3-914d-7026a8525eee"];//, "ba98468a-1964-4698-8079-27d719b3a885"];
var KEYS = ["f5c821d7-fc96-47f3-914d-7026a8525eee", "ba98468a-1964-4698-8079-27d719b3a885",
            "9b1bf08c-b751-48c9-be38-c89b83fbf433", "31be7c11-4657-4cad-a3b4-18bc3d497fcf",
            "d23853af-c9b7-4039-8ff2-472fd56f9663", "50509487-7c60-4590-8a3c-d27fe7abde87",
            "67f8945b-05c7-49b0-ac69-e4d6b30bb529"
];
var keyIndex = 0;

var CHAMP_REQUEST = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=image,tags&api_key=";
var CHAMP_IMG_URL = "http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/";

var ITEM_REQUEST = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/item?itemListData=from,image&api_key=";
var ITEM_IMG_URL = "http://ddragon.leagueoflegends.com/cdn/5.2.1/img/item/";

var MATCH_REQUEST_BASE = "https://na.api.pvp.net/api/lol/na/v2.2/match/";
var MATCH_REQUEST_OPTION = "?includeTimeline=true&api_key=";

var RANK_REQUEST_BASE = "https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/";
var RANK_REQUSET_OPTION = "/entry?api_key=";
var hits = 0;
var misses = 0;
var requests = 0;

var ABORT;
var AJAX_CONNECTIONS = 0;
var MARKSMEN_IDS;
// 2 digits
var VERSION;

var matchID;



getADCIds();
getVersion();
getLastMatchId();

function getADCIds() {
    console.log("geting adc ids");
    $.ajax({
        type: "GET",
        url: "getADCIds.php",
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("Error getting adc ids " + XMLHTTPRequest.responseText);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            MARKSMEN_IDS = ajax;
        }
    });
}

function getVersion() {
    $.ajax({
        type: "GET",
        url: "https://global.api.pvp.net/api/lol/static-data/na/v1.2/versions?api_key=f5c821d7-fc96-47f3-914d-7026a8525eee",
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("Error getting adc ids " + XMLHTTPRequest.responseText);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            var array = ajax[0].split(".");
            VERSION = array[0] + "." + array[1];
            console.log("Version = " + VERSION);
        }
    });
}

function getLastMatchId() {
    $.ajax({
        type: "GET",
        url: "getLastMatchId.php"   ,
        async: false,
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("error " + XMLHTTPRequest.responseText);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            matchID = parseInt(ajax) - 1;
            console.log("Starting at matchId = " + matchID);
        }
    });
}

function addChamps() {
    console.log("hit addChamps");
    $.ajax({
        type: "POST",
        url: "addChamp.php",
        async: false,
        data: "method=resetFile",
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("resetFile " + XMLHTTPRequest.responseText);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            console.log("Success, reset file ");
        }
    });

    $.ajax({
        type: "GET",
        url: CHAMP_REQUEST + KEYS[0],
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("error " + XMLHTTPRequest.responseText);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            for (var champ in ajax["data"]) {
                champ = ajax["data"][champ];
                addChampToDatabase(champ);
            }
        }
    });
}

function addChampToDatabase(champ) {
    var id = champ["id"];
    var name = champ["name"];
    var title = champ['title'];
    var primaryRole = champ["tags"][0];
    var secondaryRole = champ["tags"][1];
    //console.log(secondaryRole);
    if (!secondaryRole) {
        secondaryRole = "NULL";
    }

    var imageURL = champ["image"]["full"];

    var response = $.ajax({
        type: "POST",
        url: "addChamp.php",
        data: "id=" + id + "&name=" + name + "&title=" + title + "&primaryRole=" + primaryRole + "&secondaryRole=" + secondaryRole + "&imageURL=" + imageURL,
        async: false,
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("error " + XMLHTTPRequest.responseText);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            console.log("done with php script, returned *" + ajax + "*");
        }
    });

    //console.log("name = " + name + ", id = " + id + ", title = " + title + ", primary role = " + primaryRole + ",
    // secondary role = " + secondaryRole);
}

function addItems() {
    console.log("hit add items");
    $.ajax({
        type: "POST",
        url: "addItem.php",
        async: false,
        data: "method=resetFile",
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("resetFile " + XMLHTTPRequest.responseText);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            console.log("Success, reset file ");
        }
    });

    $.ajax({
        type: "GET",
        url: ITEM_REQUEST + KEYS[0],
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            fail(XMLHTTPRequest, textStatus, errorThrown, "names", "#loadingnames");
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            for (var item in ajax["data"]) {
                item = ajax["data"][item];
                addItemToDatabase(item);
                //console.log(item);
            }
        }
    });
}

function addItemToDatabase(item) {
    //CREATE PROCEDURE insertChildren @Parent_ID int, @Child_1_ID int, @Child_2_ID int = NULL, @Child_3_ID int = NULL
    //console.log(item);
    var id = item["id"];
    var name = item["name"];
    var description = item["description"];
    var imageURL = item["image"]["full"];
    var from0;
    var from1;
    var from2;
    var from3;
    var fromStr = "";
    if (item["from"]) {
        from0 = item["from"][0];
        fromStr += "&from0=" + from0;
        if (item["from"][1]) {
            from1 = item["from"][1];
            fromStr += "&from1=" + from1;
        }
        if (item["from"][2]) {
            from2 = item["from"][2];
            fromStr += "&from2=" + from2;
        }
        if (item["from"][3]) {
            from3 = item["from"][3];
            fromStr += "&from3=" + from3;
        }
    }

    $.ajax({
        type: "POST",
        url: "addItem.php",
        async: false,
        data: "id=" + id + "&name=" + name + "&description=" + description + "&imageURL=" + imageURL + fromStr,
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("error " + XMLHTTPRequest.responseText);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            console.log("done with php script, returned *" + ajax + "*");
        }
    });
}

function stopFindingMatches() {
    ABORT = true;
    console.log("aborting");
    console.log(AJAX_CONNECTIONS + " ajax connections");
    var button = $("#matchUpButton");
    //AJAX_CONNECTIONS = 0;
    button.text("waiting for " + AJAX_CONNECTIONS + " connections to finish");
    setTimeout(function () {
                button.text("combining files");
                $.ajax({
                    type: "GET",
                    url: "combineMatchupFiles.php",
                    error: function (XMLHTTPRequest, textStatus, errorThrown) {
                        console.log("error combining files: " + XMLHTTPRequest.responseText);
                    },
                    success: function (ajax, textStatus, XMLHTTPRequest) {
                        console.log("done with php script, returned *" + ajax + "*");
                        console.log("done");
                        button.attr("onclick", "addMatchups()");
                        button.text("Populate Matchup Database");
                    }
                });
    }, 5000);
    //var closer = setInterval(function () {AJAX_CONNECTIONS--}, 500);
    //var interval = setInterval(function () {
    //    console.log("waiting for " + AJAX_CONNECTIONS + " ajax connections");
    //    if (AJAX_CONNECTIONS <= 0) {
    //        clearInterval(interval);
    //        clearInterval(closer);
    //        console.log("waiting for " + AJAX_CONNECTIONS + " ajax connections");
    //
    //        button.text("combining files");
    //        $.ajax({
    //            type: "GET",
    //            url: "combineMatchupFiles.php",
    //            error: function (XMLHTTPRequest, textStatus, errorThrown) {
    //                console.log("error combineing files: " + XMLHTTPRequest.responseText);
    //            },
    //            success: function (ajax, textStatus, XMLHTTPRequest) {
    //                console.log("done with php script, returned *" + ajax + "*");
    //                console.log("done");
    //                button.attr("onclick", "addMatchups()");
    //                button.text("Populate Matchup Database");
    //            }
    //        });
    //
    //    }
    //}, 100);
    //while (AJAX_CONNECTIONS > 0) {
    //    console.log("waiting for " + AJAX_CONNECTIONS + " ajax connections");
    //    button.text("waiting for " + AJAX_CONNECTIONS + " connections to finish");
    //}


}

function addMatchups() {
    //var matchID = 1824243891;
    //matchID = 1829531523;// start here
    ABORT = false;
    var button = $("#matchUpButton");
    button.attr("onclick", "stopFindingMatches()");
    button.text("STOP!");

    hits = 0;

    misses = 0;
    requests = 0;

    //matchID--;
    //matchID--;
    //matchID--;
    //matchID--;
    //matchID--;
    //matchID--;
    //updateMiss("error 404<br /> more text");
    //updateMiss("Error 1");
    //var connectionInterval = setInterval(function() {
    //    console.log(AJAX_CONNECTIONS + " active ajax connections");
    //}, 10);

    var interval = setInterval(
        function () {
            //if (hits > 25 || requests > 50 || matchID < 1822223212 || ABORT) {
            if (ABORT) {
                console.log("DONE");
                console.log("finished at matchId = " + matchID);
                clearInterval(interval);
                //clearInterval(connectionInterval);
            }
            for (var key in KEYS) {
                key = KEYS[key];
                var url = MATCH_REQUEST_BASE + matchID + MATCH_REQUEST_OPTION + key;
                $.ajax({
                    type: "GET",
                    url: url,
                    key: key,
                    beforeSend: function () {
                        AJAX_CONNECTIONS += 3;
                    },
                    error: function (XMLHTTPRequest, textStatus, errorThrown) {
                        updateMiss(XMLHTTPRequest, this.key);
                        //console.log("error " + XMLHTTPRequest.responseText);
                    },
                    success: function (ajax, textStatus, XMLHTTPRequest) {
                        //console.log(url);
                        updateHit(ajax, this.key);
                        console.log("done");
                        //console.log("got data *");
                        //console.log(ajax);

                    }
                });
                matchID--;
            }
            //clearInterval(interval);
            //setTimeout(function () {
            //    clearInterval(connectionInterval);
            //}, 1000);
        }
        , 2400);
}

function updateMiss(error, key) {
    AJAX_CONNECTIONS -= 3;
    //console.log(error.status);
    if (error.status == 0) {
        error.status = 429;
        error.statusText = "Too many requests on key: " + key;
    }
    error = "Error " + error.status + " " + error.statusText;
    misses++;
    requests++;
    $("#requests").text(requests);
    $("#misses").text(misses);
    var length = $(".error").length;
    for (var index = 0; index < length; index++) {
        var errorText = $("#error-text-" + index);
        var errorNumb = $("#error-number-" + index);
        if ($('<p>').html(error).text() == errorText.text()) {
            errorNumb.text(parseInt(errorNumb.text()) + 1);
            return;
        }
    }
    // add new error
    var list = $("#error-list");
    var newError = $('<li>').attr("class", "error");
    var newNumb = $('<span>', {
        "id": "error-number-" + length,
        html: "1"
    });
    var newText = $('<span>', {
        "id": "error-text-" + length,
        html: error
    });
    newError.append(newNumb);
    newError.append($("<br />"));
    newError.append(newText);
    list.append(newError);


}


function updateHit(game, key) {
    if (!validGame(game)) {
        //console.log("not valid");
        var error = new Object();
        error.status = 400;
        if (game.nonMeta) {
            error.statusText = "Non meta game";
        } else if (game.errorText) {
            error.statusText = game.errorText;
        } else {
            error.statusText = game["queueType"];
        }
        updateMiss(error, 0);
        return;
    }
    console.log(game.matchId);
    hits++;
    requests++;
    $("#requests").text(requests);
    $("#hits").text(hits);
    parseMatch(game, key);

}

function validGame(game) {
    if (!game.matchVersion.startsWith(VERSION)) {
        stopFindingMatches();
        game.errorText = "Was version: " + game.matchVersion + ", and not version: " + VERSION;
        return false;
    }
    //console.log("valid version")
    var queueType = game["queueType"];
    return queueType == "RANKED_SOLO_5x5" || queueType == "NORMAL_5x5_BLIND" || queueType == "NORMAL_5x5_DRAFT" || queueType == "RANKED_TEAM_5x5";
}

function parseMatch(match, key) {
    //console.log("pasing data");
    console.log(match);
    var matchID = match["matchID"];
    var players = match["participants"];
    var timeline = match["timeline"]["frames"];
    for (var playerId in players) {
        var player = players[playerId];
        player.stats20 = [];

        player.stats20.items = [];
        if (player.championId == 112) {
            player.stats20.items.push(3200);
        }

        player.stats20.laneKills = 0;
        player.stats20.kills = 0;

        player.stats20.laneAssists = 0;
        player.stats20.assists = 0;

        player.stats20.laneDeaths = 0;
        player.stats20.deaths = 0;

        player.stats20.cs = 0;
        player.stats20.gold = 475;
        player.stats20.towerKills = 0;

        player.lane = player.timeline.lane;
        player.role = player.timeline.role;
        var parId = 1 + parseInt(playerId);
        //console.log(parId);
        player.stats20.cs = timeline[20]["participantFrames"][parseInt(playerId) + 1].minionsKilled;
        player.stats20.gold = timeline[20]["participantFrames"][parseInt(playerId) + 1].totalGold;
        //console.log(player);
    }
    for (var k = 0; k < 21 && k < timeline.length; k++) {
        var frames = timeline[k];
        for (var event in frames.events) {
            event = frames.events[event];
            //if (event.participantId == 8) {
            //console.log("full log");
            //console.log(event);
            //}
            if (event.eventType == "CHAMPION_KILL") {
                handleKill(event, players);
            } else if (event.eventType == "BUILDING_KILL") {
                handleTower(event, players);
            } else if (event.eventType == "ITEM_DESTROYED" || event.eventType == "ITEM_SOLD") {
                handleSellItem(event, players);
            } else if (event.eventType == "ITEM_UNDO") {
                //console.log("before");
                //console.log(timeline[k-1]);
                handleUndoItem(event, players, frames, k == 0 ? false : timeline[k - 1]);
                //console.log("after");
            } else if (event.eventType == "ITEM_PURCHASED") {
                handleBuyItem(event, players);
            }
        }
    }
    //for (var player in players) {
    //    console.log(players[player]);
    //}
    sendToDatabase(match, players, key);
}

function handleKill(kill, players) {
    var killVictimId = parseInt(kill.victimId) - 1;
    var victimLane = players[killVictimId].lane;
    var validLane = inLane(victimLane, players, parseInt(kill.killerId) - 1, kill.assistingParticipantIds);
    // handle kills
    if (kill.killerId > 0) { // not executed
        var killKillerId = parseInt(kill.killerId) - 1;
        var killLane = players[killKillerId].lane;
        if (validLane) {
            players[killKillerId].stats20.laneKills++;
        }
        players[killKillerId].stats20.kills++;
    } // execute has killerId == 0

    // handle deaths
    players[killVictimId].stats20.deaths++;
    if (validLane) {
        players[killVictimId].stats20.laneDeaths++;
    }

    // handle assits
    if (kill.assistingParticipantIds) {
        for (var assisterId in kill.assistingParticipantIds) {
            var assister = players[kill.assistingParticipantIds[assisterId] - 1];
            if (validLane) {
                assister.stats20.laneAssists++;
            }
            assister.stats20.assists++;
        }
    }
}

function inLane(lane, players, killerId, assistersIds) {
    //console.log("");
    if (killerId == -1) {
        //console.log("execute");
        // execute
        return false;
    }
    var killLane = players[killerId].lane;
    if (assistersIds) {
        // has assists
        var checkedLanes = [lane, killLane];
        for (var id in assistersIds) {
            id = assistersIds[id] - 1;
            //console.log("id = " + id);
            var assisterLane = players[id].lane;
            if (lane != assisterLane && assisterLane != "JUNGLE" && (checkedLanes.indexOf(assisterLane) == -1)) {
                //console.log("assister not in lane");
                return false;
            }
            checkedLanes.push(assisterLane);

        }
    }
    // check killer and victim
    //console.log("test killer and victim");
    return (lane == killLane || lane == "JUNGLE" || killLane == "JUNGLE");

}

function handleTower(towerKill, players) {
    //console.log(towerKill);
    var towerLane = towerKill.laneType;
    var killer = towerKill.killerId != 0 ? players[parseInt(towerKill.killerId) - 1] : false;
    var assistingIds = towerKill.assistingParticipantIds;
    if (killer) {
        if (killer.lane == "JUNGLE" || towerLane.substring(0, 3) == killer.lane.substring(0, 3)) {
            killer.stats20.towerKills++;
        }
    }
    for (var id in assistingIds) {
        var assisster = players[parseInt(assistingIds[id]) - 1];
        if (assisster.lane == "JUNGLE" || towerLane.substring(0, 3) == assisster.lane.substring(0, 3)) {
            assisster.stats20.towerKills++;
        }
    }
}

function handleSellItem(item, players) {
    if (notConsumableItem(item.itemId)) {
        var playerId = parseInt(item.participantId) - 1;
        //console.log(playerId);

        if (playerId >= 0) {
            var player = players[playerId];
            //console.log(player);
            var index = player.stats20.items.indexOf(item.itemId);
            //console.log(index);
            if (index < 0) {
                console.log("couldn't find");
                console.log(item);
                console.log(player.stats20.items);
                console.log(index);
                hits--;
                requests--;
                updateMiss({status: 500, statusText: "Internal Server Error, tried to sell an item you didn't have"}, null);
                return;
            }
            player.stats20.items.splice(index, 1);
            //if (parseInt(item.participantId) - 1 == 2) {
            //    console.log("\nsold item " + item.itemId);
            //    console.log(item);
            //    console.log(players[parseInt(item.participantId) - 1].stats20.items);
            //}
        }
    }
}

function handleBuyItem(item, players) {
    if (notConsumableItem(item.itemId)) {
        players[parseInt(item.participantId) - 1].stats20.items.push(item.itemId);
        //if (parseInt(item.participantId) - 1 == 2) {
        //    console.log("\nbought item " + item.itemId);
        //    console.log(item);
        //    console.log(players[parseInt(item.participantId) - 1].stats20.items);
        //}
    }
}

function handleUndoItem(item, players, frames, previousFrames) {
    if (!previousFrames) {
        previousFrames = {events: []};
    }
    if (!previousFrames.events) {
        previousFrames.events = [];
    }
    var player = players[parseInt(item.participantId) - 1];
    if (item.itemBefore == 0) {
        // undo sell
        if (notConsumableItem(item.itemAfter)) {
            player.stats20.items.push(item.itemAfter);
        }
    } else {
        // undo buy
        if (notConsumableItem(item.itemBefore)) {
            var events = previousFrames.events.concat(frames.events);
            //if (parseInt(item.participantId) - 1 == 2) {
            //    console.log("\nUNDO item " + item.itemBefore);
            //    console.log(item);
            //    console.log(players[parseInt(item.participantId) - 1].stats20.items);
            //}
            var innerUndoitemId = false;
            var index = events.indexOf(item) - 1;
            while (index > -1) {
                var event = events[index];
                if (event.eventType == "ITEM_UNDO" && event.participantId == item.participantId && !innerUndoitemId) {
                    // found a inner undo while not in another inner undo
                    if (event.itemBefore != 0) {
                        innerUndoitemId = event.itemBefore;
                    } else {
                        innerUndoitemId = event.itemAfter;
                    }
                    //console.log("dont revert stuff until I find item " + innerUndoitemId);
                }
                //if (parseInt(item.participantId) - 1 == 2) {
                //    if (event.participantId == item.participantId && !innerUndoitemId) {
                //        console.log("revert ");
                //    }
                //    console.log(event);
                //}
                if (event.participantId == item.participantId && !innerUndoitemId) {
                    revertEvent(event, players);
                }
                if (innerUndoitemId && event.participantId == item.participantId && event.itemId == innerUndoitemId) {
                    innerUndoitemId = false;
                    //console.log("out of inner loop now");
                }

                if (event.participantId == item.participantId && event.itemId == item.itemBefore) {
                    //console.log("found the end of the undo");
                    // assuming the reveted op is at the beggining of the time frame
                    break;
                }
                index--;
            }
            //if (parseInt(item.participantId) - 1 == 2) {
            //    console.log("END UNDO");
            //}
        }
    }
}

function revertEvent(event, players) {
    if (event.eventType == "ITEM_PURCHASED") {
        handleSellItem(event, players);
    } else if (event.eventType == "ITEM_DESTROYED" || event.eventType == "ITEM_SOLD") {
        handleBuyItem(event, players);
    } else {
        //console.log("not buy or sell");
    }
}

function notConsumableItem(itemId) {
    // biscut rejuvenation, mana pot, health pot, biscut, kalista, red elixir, iron elixir, mage elixir, health elixir
    var consumables = [2009, 2004, 2003, 2010, 3599, 2140, 2138, 2139, 2137];
    // up yellow, up pink, up blue, up red, blue, red, yellow, dominion trinket, poro snack, explorer, poro snack, orcales extract, golden transcendence,
    // green, pink
    var wards = [3361, 3362, 3363, 3364, 3342, 3341, 3340, 3345, 2054, 2050, 2052, 2047, 3460, 2044, 2043];
    return consumables.indexOf(itemId) == -1 && wards.indexOf(itemId) == -1;
}

function calculateAverageRank(match, key) {
    var ids = [];
    //console.log(match);
    for (var player in match.participantIdentities) {
        player = match.participantIdentities[player];
        //console.log(player);
        ids.push(player.player.summonerId);
    }
    //console.log("ranks *********");
    //console.log("ids = " + ids);
    var ranks = getRanks(ids, key);
    //console.log(ranks);
    var sum = 0;
    for (var rank in ranks) {
        rank = ranks[rank];
        sum += rank;
    }
    //console.log(sum);
    return sum / 10;
}

function getRanks(ids, key) {
    var url = RANK_REQUEST_BASE + ids + RANK_REQUSET_OPTION + key;
    var ranks = [];
    var response = $.ajax({
        type: "GET",
        url: url,
        key: key,
        async: false,
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("error " + XMLHTTPRequest.responseText);
            exit(-1);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            //ranks = new Array();
            //console.log("ranks ajax = ");
            //console.log(ajax);
            for (var rank in ajax) {
                rank = ajax[rank]["0"];
                var score;
                if (rank == "UNRANKED") {
                    score = 4;
                } else {
                    score = convertRankToNumber(rank.tier);
                    score += convertDivisionAndLPToNumber(rank.entries["0"].division, rank.entries["0"].leaguePoints);
                }
                ranks.push(score);
            }
        }
    });
    return ranks;
}

function convertRankToNumber(tier) {
    //console.log("tier = " + tier);
    var values = new Array();
    values['BRONZE'] = 0;
    values['SILVER'] = 5;
    values['GOLD'] = 10;
    values['PLATINUM'] = 15;
    values['DIAMOND'] = 20;
    values['MASTER'] = 25;
    values['CHALLENGER'] = 30;
    return values[tier];
}

function convertDivisionAndLPToNumber(division, lp) {
    //console.log(division + ", " + lp);
    var divisions = new Array();
    divisions['I'] = 4;
    divisions['II'] = 3;
    divisions['III'] = 2;
    divisions['IV'] = 1;
    divisions['V'] = 0;

    return divisions[division] + parseInt(lp) / 100;
}

function sendToDatabase(match, players, key) {
    var avgRank = -1;
    if (match["queueType"] == "RANKED_SOLO_5x5" || match["queueType"] == "RANKED_TEAM_5x5") {
        console.log(match["queueType"]);
        avgRank = calculateAverageRank(match, key);
    }
    //console.log(avgRank);
    var matchId = match.matchId;

    var player = getLaners(players, "MIDDLE");
    if (player) {
        sendMatchupToDatabase(matchId, avgRank, "MIDDLE", player.p1, player.p2, key);
    } else {
        console.log("non meta MIDDLE lane");
    }
    //console.log("MID");
    //console.log(player);

    player = getLaners(players, "TOP");
    if (player) {
        sendMatchupToDatabase(matchId, avgRank, "TOP", player.p1, player.p2, key);
    } else {
        console.log("non meta TOP lane");
    }
    //console.log("TOP");
    //console.log(player);

    player = getBotLaners(players);
    if (player) {
        sendBotMatchupToDatabase(matchId, avgRank, player.m1, player.s1, player.m2, player.s2, key);
    } else {
        console.log("non meta BOTTOM lane");
    }
    //console.log("BOTTOM");
    //console.log(player);
}

function getLaners(players, lane) {
    var obj = new Object();
    for (var index = 0; index < 5; index++) {
        var player = players[index];
        if (player.lane == lane) {
            if (obj.p1) {
                // to many laners
                return false;
            }
            obj.p1 = player;
        }
    }

    for (var index = 5; index < 10; index++) {
        var player = players[index];
        if (player.lane == lane) {
            if (obj.p2) {
                // to many laners
                return false;
            }
            obj.p2 = player;
        }
    }
    if (obj.p1 === undefined || obj.p2 === undefined) {
        // not enough laners
        return false;
    }
    if (obj.p1.championId > obj.p2.championId) {
        var temp = obj.p1;
        obj.p1 = obj.p2;
        obj.p2 = temp;
    }
    return obj;

}

function getBotLaners(players) {
    var obj = new Object();
    for (var index = 0; index < 5; index++) {
        var player = players[index];
        if (player.lane == "BOTTOM") {
            if (player.role == "DUO_SUPPORT" || player.spell1Id == 3 || player.spell2Id == 3) {
                obj.s1 = player;
            } else if (MARKSMEN_IDS.indexOf(player.championId) != -1) {
                if (obj.m1) {
                    // to many adc
                    return false;
                }
                obj.m1 = player;
            } else {
                if (obj.s1) {
                    // to many supports
                    return false;
                }
                obj.s1 = player;
            }
        }
    }

    for (var index = 5; index < 10; index++) {
        var player = players[index];
        if (player.lane == "BOTTOM") {
            if (player.role == "DUO_SUPPORT" || player.spell1Id == 3 || player.spell2Id == 3) {
                obj.s2 = player;
            } else if (MARKSMEN_IDS.indexOf(player.championId) != -1) {
                if (obj.m2) {
                    // to many adc
                    return false;
                }
                obj.m2 = player;
            } else {
                if (obj.s2) {
                    // to many supports
                    return false;
                }
                obj.s2 = player;
            }
        }
    }

    if (obj.m1 === undefined || obj.s1 === undefined || obj.m2 === undefined || obj.s2 === undefined) {
        // not enough people in the bot lane
        return false;
    }

    if (obj.m1.championId > obj.m2.championId) {
        var mtemp = obj.m1;
        var stemp = obj.s1;
        obj.m1 = obj.m2;
        obj.s1 = obj.s2;
        obj.m2 = mtemp;
        obj.s2 = stemp;
    }
    return obj;
}

function sendMatchupToDatabase(matchId, rank, lane, player1, player2, key) {
    var champId1 = player1.championId;
    var kills1 = player1.stats20.kills;
    var deaths1 = player1.stats20.deaths;
    var assists1 = player1.stats20.assists;
    var laneKills1 = player1.stats20.laneKills;
    var laneDeaths1 = player1.stats20.laneDeaths;
    var laneAssists1 = player1.stats20.laneAssists;
    var towerKills1 = player1.stats20.towerKills;
    var cs1 = player1.stats20.cs;
    var gold1 = player1.stats20.gold;

    var champId2 = player2.championId;
    var kills2 = player2.stats20.kills;
    var deaths2 = player2.stats20.deaths;
    var assists2 = player2.stats20.assists;
    var laneKills2 = player2.stats20.laneKills;
    var laneDeaths2 = player2.stats20.laneDeaths;
    var laneAssists2 = player2.stats20.laneAssists;
    var towerKills2 = player2.stats20.towerKills;
    var cs2 = player2.stats20.cs;
    var gold2 = player2.stats20.gold;

    var item00 = "NULL";
    var item01 = "NULL";
    var item02 = "NULL";
    var item03 = "NULL";
    var item04 = "NULL";
    var item05 = "NULL";
    var item10 = "NULL";
    var item11 = "NULL";
    var item12 = "NULL";
    var item13 = "NULL";
    var item14 = "NULL";
    var item15 = "NULL";

    if (player1.stats20.items[0]) {
        item00 = "'" + player1.stats20.items[0] + "'";
    }
    if (player1.stats20.items[1]) {
        item01 = "'" + player1.stats20.items[1] + "'";
    }
    if (player1.stats20.items[2]) {
        item02 = "'" + player1.stats20.items[2] + "'";
    }
    if (player1.stats20.items[3]) {
        item03 = "'" + player1.stats20.items[3] + "'";
    }
    if (player1.stats20.items[4]) {
        item04 = "'" + player1.stats20.items[4] + "'";
    }
    if (player1.stats20.items[5]) {
        item05 = "'" + player1.stats20.items[5] + "'";
    }

    if (player2.stats20.items[0]) {
        item10 = "'" + player2.stats20.items[0] + "'";
    }
    if (player2.stats20.items[1]) {
        item11 = "'" + player2.stats20.items[1] + "'";
    }
    if (player2.stats20.items[2]) {
        item12 = "'" + player2.stats20.items[2] + "'";
    }
    if (player2.stats20.items[3]) {
        item13 = "'" + player2.stats20.items[3] + "'";
    }
    if (player2.stats20.items[4]) {
        item14 = "'" + player2.stats20.items[4] + "'";
    }
    if (player2.stats20.items[5]) {
        item15 = "'" + player2.stats20.items[5] + "'";
    }

    //insertItemUsage @Champ_ID int, @Win int, @Item_1 int, @Item_2 int = NULL, @Item_3 int = NULL, @Item_4 int = NULL, @Item_5 int = NULL, @Item_6 int =
    // NULL
    var args = "matchId=" + matchId + "&lane=" + lane + "&rank=" + rank + "&champ1=" + champId1 + "&kills1=" + kills1 + "&deaths1=" + deaths1 + "&assists1=" + assists1 + "&laneKills1="
        + laneKills1 + "&laneDeaths1=" + laneDeaths1 + "&laneAssists1=" + laneAssists1 + "&towerKills1=" + towerKills1 + "&cs1=" + cs1 + "&gold1=" + gold1;
    args += "&champ2=" + champId2 + "&kills2=" + kills2 + "&deaths2=" + deaths2 + "&assists2=" + assists2 + "&laneKills2=" + laneKills2 + "&laneDeaths2="
    + laneDeaths2 + "&laneAssists2=" + laneAssists2 + "&towerKills2=" + towerKills2 + "&cs2=" + cs2 + "&gold2=" + gold2;
    args += "&item00=" + item00 + "&item01=" + item01 + "&item02=" + item02 + "&item03=" + item03 + "&item04=" + item04 + "&item05=" + item05
    + "&item10=" + item10 + "&item11=" + item11 + "&item12=" + item12 + "&item13=" + item13 + "&item14=" + item14 + "&item15=" + item15;
    args += "&fileNo=" + KEYS.indexOf(key);
    //console.log("start send matchup");
    //console.log(player1);
    //console.log(player2);
    //console.log(args);
    $.ajax({
        type: "POST",
        url: "addSoloMatchup.php",
        data: args,
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("error " + XMLHTTPRequest.responseText);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            AJAX_CONNECTIONS--;
            console.log("done with php script, returned *" + ajax + "*");
        }
    });
}

function sendBotMatchupToDatabase(matchId, rank, m1, s1, m2, s2, key) {
    var champIdM1 = m1.championId;
    var killsM1 = m1.stats20.kills;
    var deathsM1 = m1.stats20.deaths;
    var assistsM1 = m1.stats20.assists;
    var laneKillsM1 = m1.stats20.laneKills;
    var laneDeathsM1 = m1.stats20.laneDeaths;
    var laneAssistsM1 = m1.stats20.laneAssists;
    var towerKillsM1 = m1.stats20.towerKills;
    var csM1 = m1.stats20.cs;
    var goldM1 = m1.stats20.gold;

    var champIdS1 = s1.championId;
    var killsS1 = s1.stats20.kills;
    var deathsS1 = s1.stats20.deaths;
    var assistsS1 = s1.stats20.assists;
    var laneKillsS1 = s1.stats20.laneKills;
    var laneDeathsS1 = s1.stats20.laneDeaths;
    var laneAssistsS1 = s1.stats20.laneAssists;
    var towerKillsS1 = s1.stats20.towerKills;
    var csS1 = s1.stats20.cs;
    var goldS1 = s1.stats20.gold;

    var champIdM2 = m2.championId;
    var killsM2 = m2.stats20.kills;
    var deathsM2 = m2.stats20.deaths;
    var assistsM2 = m2.stats20.assists;
    var laneKillsM2 = m2.stats20.laneKills;
    var laneDeathsM2 = m2.stats20.laneDeaths;
    var laneAssistsM2 = m2.stats20.laneAssists;
    var towerKillsM2 = m2.stats20.towerKills;
    var csM2 = m2.stats20.cs;
    var goldM2 = m2.stats20.gold;

    var champIdS2 = s2.championId;
    var killsS2 = s2.stats20.kills;
    var deathsS2 = s2.stats20.deaths;
    var assistsS2 = s2.stats20.assists;
    var laneKillsS2 = s2.stats20.laneKills;
    var laneDeathsS2 = s2.stats20.laneDeaths;
    var laneAssistsS2 = s2.stats20.laneAssists;
    var towerKillsS2 = s2.stats20.towerKills;
    var csS2 = s2.stats20.cs;
    var goldS2 = s2.stats20.gold;

    var itemM10 = "NULL";
    var itemM11 = "NULL";
    var itemM12 = "NULL";
    var itemM13 = "NULL";
    var itemM14 = "NULL";
    var itemM15 = "NULL";
    var itemS10 = "NULL";
    var itemS11 = "NULL";
    var itemS12 = "NULL";
    var itemS13 = "NULL";
    var itemS14 = "NULL";
    var itemS15 = "NULL";

    var itemM20 = "NULL";
    var itemM21 = "NULL";
    var itemM22 = "NULL";
    var itemM23 = "NULL";
    var itemM24 = "NULL";
    var itemM25 = "NULL";
    var itemS20 = "NULL";
    var itemS21 = "NULL";
    var itemS22 = "NULL";
    var itemS23 = "NULL";
    var itemS24 = "NULL";
    var itemS25 = "NULL";

    if (m1.stats20.items[0]) {
        itemM10 = "'" + m1.stats20.items[0] + "'";
    }
    if (m1.stats20.items[1]) {
        itemM11 = "'" + m1.stats20.items[1] + "'";
    }
    if (m1.stats20.items[2]) {
        itemM12 = "'" + m1.stats20.items[2] + "'";
    }
    if (m1.stats20.items[3]) {
        itemM13 = "'" + m1.stats20.items[3] + "'";
    }
    if (m1.stats20.items[4]) {
        itemM14 = "'" + m1.stats20.items[4] + "'";
    }
    if (m1.stats20.items[5]) {
        itemM15 = "'" + m1.stats20.items[5] + "'";
    }

    if (s1.stats20.items[0]) {
        itemS10 = "'" + s1.stats20.items[0] + "'";
    }
    if (s1.stats20.items[1]) {
        itemS11 = "'" + s1.stats20.items[1] + "'";
    }
    if (s1.stats20.items[2]) {
        itemS12 = "'" + s1.stats20.items[2] + "'";
    }
    if (s1.stats20.items[3]) {
        itemS13 = "'" + s1.stats20.items[3] + "'";
    }
    if (s1.stats20.items[4]) {
        itemS14 = "'" + s1.stats20.items[4] + "'";
    }
    if (s1.stats20.items[5]) {
        itemS15 = "'" + s1.stats20.items[5] + "'";
    }


    if (m2.stats20.items[0]) {
        itemM20 = "'" + m2.stats20.items[0] + "'";
    }
    if (m2.stats20.items[1]) {
        itemM21 = "'" + m2.stats20.items[1] + "'";
    }
    if (m2.stats20.items[2]) {
        itemM22 = "'" + m2.stats20.items[2] + "'";
    }
    if (m2.stats20.items[3]) {
        itemM23 = "'" + m2.stats20.items[3] + "'";
    }
    if (m2.stats20.items[4]) {
        itemM24 = "'" + m2.stats20.items[4] + "'";
    }
    if (m2.stats20.items[5]) {
        itemM25 = "'" + m2.stats20.items[5] + "'";
    }

    if (s2.stats20.items[0]) {
        itemS20 = "'" + s2.stats20.items[0] + "'";
    }
    if (s2.stats20.items[1]) {
        itemS21 = "'" + s2.stats20.items[1] + "'";
    }
    if (s2.stats20.items[2]) {
        itemS22 = "'" + s2.stats20.items[2] + "'";
    }
    if (s2.stats20.items[3]) {
        itemS23 = "'" + s2.stats20.items[3] + "'";
    }
    if (s2.stats20.items[4]) {
        itemS24 = "'" + s2.stats20.items[4] + "'";
    }
    if (s2.stats20.items[5]) {
        itemS25 = "'" + s2.stats20.items[5] + "'";
    }


    var args = "matchId=" + matchId + "&rank=" + rank + "&champM1=" + champIdM1 + "&killsM1=" + killsM1 + "&deathsM1=" + deathsM1 + "&assistsM1=" + assistsM1 + "&laneKillsM1="
        + laneKillsM1 + "&laneDeathsM1=" + laneDeathsM1 + "&laneAssistsM1=" + laneAssistsM1 + "&towerKillsM1=" + towerKillsM1 + "&csM1=" + csM1 + "&goldM1=" + goldM1;
    args +=
        "&champS1=" + champIdS1 + "&killsS1=" + killsS1 + "&deathsS1=" + deathsS1 + "&assistsS1=" + assistsS1 + "&laneKillsS1=" + laneKillsS1 + "&laneDeathsS1="
        + laneDeathsS1 + "&laneAssistsS1=" + laneAssistsS1 + "&towerKillsS1=" + towerKillsS1 + "&csS1=" + csS1 + "&goldS1=" + goldS1;
    args +=
        "&champM2=" + champIdM2 + "&killsM2=" + killsM2 + "&deathsM2=" + deathsM2 + "&assistsM2=" + assistsM2 + "&laneKillsM2=" + laneKillsM2 + "&laneDeathsM2="
        + laneDeathsM2 + "&laneAssistsM2=" + laneAssistsM2 + "&towerKillsM2=" + towerKillsM2 + "&csM2=" + csM2 + "&goldM2=" + goldM2;
    args +=
        "&champS2=" + champIdS2 + "&killsS2=" + killsS2 + "&deathsS2=" + deathsS2 + "&assistsS2=" + assistsS2 + "&laneKillsS2=" + laneKillsS2 + "&laneDeathsS2="
        + laneDeathsS2 + "&laneAssistsS2=" + laneAssistsS2 + "&towerKillsS2=" + towerKillsS2 + "&csS2=" + csS2 + "&goldS2=" + goldS2;
    args +=
        "&itemM10=" + itemM10 + "&itemM11=" + itemM11 + "&itemM12=" + itemM12 + "&itemM13=" + itemM13 + "&itemM14=" + itemM14 + "&itemM15=" + itemM15 + "&itemS10="
        + itemS10 + "&itemS11=" + itemS11 + "&itemS12=" + itemS12 + "&itemS13=" + itemS13 + "&itemS14=" + itemS14 + "&itemS15=" + itemS15;
    args +=
        "&itemM20=" + itemM20 + "&itemM21=" + itemM21 + "&itemM22=" + itemM22 + "&itemM23=" + itemM23 + "&itemM24=" + itemM24 + "&itemM25=" + itemM25 + "&itemS20="
        + itemS20 + "&itemS21=" + itemS21 + "&itemS22=" + itemS22 + "&itemS23=" + itemS23 + "&itemS24=" + itemS24 + "&itemS25=" + itemS25;
    args += "&fileNo=" + KEYS.indexOf(key);
    //console.log(args);
    $.ajax({
        type: "POST",
        url: "addBotMatchup.php",
        data: args,
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("error " + XMLHTTPRequest.responseText);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            AJAX_CONNECTIONS--;
            console.log("done with php script, returned *" + ajax + "*");
        }
    });
}

function nextKey() {
    keyIndex++;
    if (keyIndex >= KEYS.length) {
        keyIndex = 0;
    }
    return KEYS[keyIndex];

}
