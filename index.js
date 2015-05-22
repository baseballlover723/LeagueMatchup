"use strict";
// TODO implement player hints
// TODO display player hints
// TODO display overall counter score based on previous matches
var CHAMP_IMG_URL = "http://ddragon.leagueoflegends.com/cdn/5.9.1/img/champion/";
var ITEM_IMG_URL = "http://ddragon.leagueoflegends.com/cdn/5.9.1/img/item/";
var MATCH_MIN = 5;

function setUp() {
    $("#inputs").on('submit', function (event) {
        event.preventDefault();
        clickAnalyze();
    });
    $("#item-results-button").on("click", function () { hide("#item-results"); });
    $("#bad-item-results-button").on("click", function () { hide("#bad-item-results"); });
    initComboBox();
    changeLane();
}

function hide(domStr) {
    var button = $(domStr + "-button");
    button.on("click", function () { show(domStr) });
    button.text("Show");
    $(domStr).css("display", "none");
}
function show(domStr) {
    var button = $(domStr + "-button");
    button.on("click", function () { hide(domStr); });
    button.text("Hide");
    $(domStr).css("display", "block");
}

function initComboBox() {
    $.ajax({
        type: "GET",
        url: "getChampNamesAndIds.php",
        dataType: "json",
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("Error getting adc ids " + XMLHTTPRequest.responseText);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            console.log(ajax);
            var champions = [{text: "???", value: "-1"}];
            for (var name in ajax) {
                var id = ajax[name];
                champions.push({text: name, value: id + ""});
            }
            champions.sort(function (a, b) {
                return a.text.localeCompare(b.text);
            });

            $("#inputChampM1").kendoComboBox({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: champions,
                filter: "contains",
                suggest: true,
                index: 0,
                change: function () { changeChampImage("M1", this.text(), this.value());}
            });

            $("#inputChampS1").kendoComboBox({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: champions,
                filter: "contains",
                suggest: true,
                index: 0,
                change: function () { changeChampImage("S1", this.text(), this.value());}
            });
            $("#inputChampM2").kendoComboBox({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: champions,
                filter: "contains",
                suggest: true,
                index: 0,
                change: function () { changeChampImage("M2", this.text(), this.value());}
            });

            $("#inputChampS2").kendoComboBox({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: champions,
                filter: "contains",
                suggest: true,
                index: 0,
                change: function () { changeChampImage("S2", this.text(), this.value());}
            });


            $("#inputChamp1").kendoComboBox({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: champions,
                filter: "contains",
                suggest: true,
                index: 0,
                change: function () { changeChampImage("P1", this.text(), this.value());}

            });

            $("#inputChamp2").kendoComboBox({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: champions,
                filter: "contains",
                suggest: true,
                index: 0,
                change: function () { changeChampImage("P2", this.text(), this.value());}
            });
        }
    });
}

function changeLane() {
    // clear not enough error messages
    $("#analyzeError").text("");

    // clear out any stats
    for (var k = 0; k < 5; k++) {
        var statLine = $("#champ" + k + "StatsLine");
        statLine.empty();
    }
    var itemTable = $("#item-results-table");
    itemTable.empty();

    var row = $("<tr></tr>");
    var data = $("<td></td>");
    data.text("Item");
    row.append(data);

    data = $("<td></td>");
    data.text("Description");
    row.append(data);

    data = $("<td></td>");
    data.text("% Played");
    row.append(data);

    data = $("<td></td>");
    data.text("Score differential");
    row.append(data);

    itemTable.append(row);

    itemTable = $("#bad-item-results-table");
    itemTable.empty();

    var row = $("<tr></tr>");
    var data = $("<td></td>");
    data.text("Item");
    row.append(data);

    data = $("<td></td>");
    data.text("Description");
    row.append(data);

    data = $("<td></td>");
    data.text("% Played");
    row.append(data);

    data = $("<td></td>");
    data.text("Score differential");
    row.append(data);

    itemTable.append(row);

    $("#numbOfMatches").text("");

    var selector = $("#lane-selector");
    console.log("switched lane to " + selector.val());

    // changes stat lines
    if (selector.val() == "bot") {
        $("#bot-inputs").css("display", "block");
        $("#solo-inputs").css("display", "none");

        $(".bot-table").css("display", "block");

        $("#champ1Label").text("Your Marksman Stats:");
        $("#champ2Label").text("Your Support Stats:");
        $("#champ3Label").text("Opponent's Marksman Stats:");
        $("#champ4Label").text("Opponent's Support Stats:");
    } else {
        $("#bot-inputs").css("display", "none");
        $(".bot-table").css("display", "none");

        $("#solo-inputs").css("display", "block");

        $("#champ1Label").text("Your Champs Stats:");
        $("#champ2Label").text("Your Opponent's Stats:");
    }
}

function changeChampImage(id, name, champId) {
    var img = $("#img" + id);
    if (champId == -1) {
        img.attr("src", "http://upload.wikimedia.org/wikipedia/commons/2/25/Icon-round-Question_mark.jpg");
    }
    $.ajax({
        type: "GET",
        url: "getChampImage.php",
        data: "id=" + champId,
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("Error getting champion image " + XMLHTTPRequest.responseText);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            img.attr("src", CHAMP_IMG_URL + ajax);
        }
    });
}

function clickAnalyze() {
    changeLane();
    if ($("#lane-selector").val() == "bot") {
        getBotStats();
    } else {
        getSoloStats();
    }
}

function getSoloStats() {
    var champId1 = parseInt($("#inputChamp1").val());
    var champId2 = parseInt($("#inputChamp2").val());
    var lane = $("#lane-selector").val();

    if (champId1 == "-1" && champId2 == "-1") {
        $("#analyzeError").text("Please enter at least 1 champion");
        return;
    }
    if (champId1 == champId2) {
        $("#analyzeError").text("Cannot compute mirror matchups accurately");
        return;
    }
    if (champId1 == "-1") {
        getSoloCounters(champId2);
        return;
    }
    console.log(champId1);
    console.log(champId2);
    console.log(lane);
    var swap = false;
    if (champId2 < champId1) {
        console.log("swap");
        var temp = champId1;
        champId1 = champId2;
        champId2 = temp;
        swap = true;
    }
    $.ajax({
        type: "GET",
        url: "getSoloStats.php",
        dataType: "json",
        data: "champId1=" + champId1 + "&champId2=" + champId2 + "&lane=" + lane.toUpperCase(),
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("Error getting solo stats " + XMLHTTPRequest.responseText);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            displayStatsLine(ajax, swap, false);
        }
    });
    $.ajax({
        type: "GET",
        url: "getBestItems.php",
        dataType: "json",
        data: "champId1=" + champId1 + "&champId2=" + champId2 + "&lane=" + lane + "&swap=" + swap,
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("Error getting solo stats items " + XMLHTTPRequest.responseText);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            console.log(ajax);
            displayItemResults(ajax[1], parseFloat(ajax[0]));
        }
    });
}

function getBotStats() {
    var champIdM1 = parseInt($("#inputChampM1").val());
    var champIdS1 = parseInt($("#inputChampS1").val());
    var champIdM2 = parseInt($("#inputChampM2").val());
    var champIdS2 = parseInt($("#inputChampS2").val());
    console.log(champIdM1);
    console.log(champIdS1);
    console.log("");
    console.log(champIdM2);
    console.log(champIdS2);

    var isADC = $('input[name="isADC"]:checked').val();
    if (isADC === undefined) {
        $("#analyzeError").text("Please select if you are the Marksman or the Support");
        return;
    }
    isADC = isADC == "true";
    if (champIdM1 == champIdM2) {
        $("#analyzeError").text("Cannot compute mirror marksmen accurately");
        return;
    }

    var swap = false;
    if (champIdM2 < champIdM1) {
        console.log("swap");
        var tempM = champIdM1;
        var tempS = champIdS1;

        champIdM1 = champIdM2;
        champIdS1 = champIdS2;

        champIdM2 = tempM;
        champIdS2 = tempS;
        swap = true;
    }
    $.ajax({
        type: "GET",
        url: "getBotStats.php",
        dataType: "json",
        data: "champIdM1=" + champIdM1 + "&champIdS1=" + champIdS1 + "&champIdM2=" + champIdM2 + "&champIdS2=" + champIdS2,
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("Error getting bot stats " + XMLHTTPRequest.responseText);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            displayStatsLine(ajax, swap, true);
        }
    });
    var champ1 = (isADC?champIdM1:champIdS1);
    var champ2 = (isADC?champIdM2:champIdS2);
    $.ajax({
        type: "GET",
        url: "getBestItems.php",
        dataType: "json",
        data: "champId1=" + champ1 + "&champId2=" + champ2 + "&lane=BOT&swap=" + swap+"&isADC="+isADC,
        error: function (XMLHTTPRequest, textStatus, errorThrown) {
            console.log("Error getting bot stats items " + XMLHTTPRequest.responseText);
        },
        success: function (ajax, textStatus, XMLHTTPRequest) {
            console.log(ajax);
            displayItemResults(ajax[1], parseFloat(ajax[0]));
        }
    });

}

function displayItemResults(rows, lanerAvgScore) {
    console.log(lanerAvgScore);
    var table = $("#item-results-table");
    var badTable = $("#bad-item-results-table");
    badTable.empty();
    var headerRow = badTable
    for (var row in rows) {
        row = rows[row];
        var item = row[0];
        var numb = row[1];
        var score = parseFloat(row[2]) - lanerAvgScore;
        if (numb < 0.05) {
            continue;
        }
        if (score < 0) {
            console.log("negitive");
            row = $("<tr></tr>");

            var data = $("<td></td>");
            data.css("text-align", "center");
            data.text(item[0]);
            var wrapper = $("<div></div>");
            wrapper.css("width", "100%");
            var img = $("<img/>");
            img.attr("src", ITEM_IMG_URL + item[2]);
            wrapper.append(img);
            data.append(wrapper);
            row.append(data);

            var description = $("<td></td>");
            description.append($(item[1]));
            row.append(description);
            //row.append($(item[1]).css("max-height", "130px"));

            data = $("<td></td>");
            data.text(numb);
            row.append(data);

            data = $("<td></td>");
            data.text(score);
            row.append(data);

            badTable.prepend(row);
            while (description.height() > 150) {
                description.css("font-size", parseFloat(description.css("font-size")) - 0.5);
            }
        } else {
            row = $("<tr></tr>");

            var data = $("<td></td>");
            data.css("text-align", "center");
            data.text(item[0]);
            var wrapper = $("<div></div>");
            wrapper.css("width", "100%");
            var img = $("<img/>");
            img.attr("src", ITEM_IMG_URL + item[2]);
            wrapper.append(img);
            data.append(wrapper);
            row.append(data);

            var description = $("<td></td>");
            description.append($(item[1]));
            row.append(description);
            //row.append($(item[1]).css("max-height", "130px"));

            data = $("<td></td>");
            data.text(numb);
            row.append(data);

            data = $("<td></td>");
            data.text(score);
            row.append(data);

            table.append(row);
            while (description.height() > 150) {
                description.css("font-size", parseFloat(description.css("font-size")) - 0.5);
            }
        }
    }
    var itemTable = $("#bad-item-results-table");

    var row = $("<tr></tr>");
    var data = $("<td></td>");
    data.text("Item");
    row.append(data);

    data = $("<td></td>");
    data.text("Description");
    row.append(data);

    data = $("<td></td>");
    data.text("% Played");
    row.append(data);

    data = $("<td></td>");
    data.text("Score differential");
    row.append(data);

    itemTable.prepend(row);
}


function displayStatsLine(stats, swap, bot) {
    if (parseInt(stats[0]) < MATCH_MIN) {
        $("#analyzeError").text("Not enough matches in the database to accurately compute (" + stats[0] + " matches)");
        return;
    }

    var first = swap ? (bot ? "3" : "2") : "1";
    var second = swap ? (bot ? "4" : "1") : "2";

    var third = swap ? "1" : "3";
    var fourth = swap ? "2" : "4";

    $("#numbOfMatches").text(" (" + stats[0] + " matches)");

    if (bot) {
        $("#champ1Label").text($("#inputChampM1").data("kendoComboBox").text() + " stats:");
        $("#champ2Label").text($("#inputChampS1").data("kendoComboBox").text() + " stats:");
        $("#champ3Label").text($("#inputChampM2").data("kendoComboBox").text() + " stats:");
        $("#champ4Label").text($("#inputChampS2").data("kendoComboBox").text() + " stats:");
    } else {
        $("#champ1Label").text($("#inputChamp1").data("kendoComboBox").text() + " stats:");
        $("#champ2Label").text($("#inputChamp2").data("kendoComboBox").text() + " stats:");
    }
    var statLine = $("#champ" + first + "StatsLine");
    statLine.empty();
    //console.log(stats);
    for (var index = 1; index < 10; index++) {
        var data = $("<td></td>");
        data.text(stats[index]);
        statLine.append(data);
    }
    //$("#champ1Label").text()

    statLine = $("#champ" + second + "StatsLine");
    statLine.empty();
    for (var index = 10; index < 19; index++) {
        var data = $("<td></td>");
        data.text(stats[index]);
        statLine.append(data);
    }

    if (bot) {
        statLine = $("#champ" + third + "StatsLine");
        statLine.empty();
        for (var index = 19; index < 28; index++) {
            var data = $("<td></td>");
            data.text(stats[index]);
            statLine.append(data);
        }
        //$("#champ1Label").text()

        statLine = $("#champ" + fourth + "StatsLine");
        statLine.empty();
        for (var index = 28; index < 37; index++) {
            var data = $("<td></td>");
            data.text(stats[index]);
            statLine.append(data);
        }
    }
}

window.onload = setUp;
