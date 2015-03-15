( function( $ ) {

var buses,
    busStations;

function pageIsSelectmenuDialog( page ) {
    var isDialog = false,
        id = page && page.attr( "id" );
    $( ".filterable-select" ).each( function() {
        if ( $( this ).attr( "id" ) + "-dialog" === id ) {
            isDialog = true;
            return false;
        }
    });
    return isDialog;
}
// id - string/integer - id of bus station
function getStationNameById(id) {
    var stationName;
    $.each(busStations, function(index, value) {
        if (value.id === parseInt(id, 10)){
            stationName = value.name;
            return false;
        }
    });
    return stationName;
}
// busNumber - string/integer - bus number
// hour - boolean - if true return bus stations with hours,
//                   if false return stations list with ids
function getStationsHoursOfBus(busNumber, hour) {
    var list = [],
        stationId = [];
    $.each(buses, function(index, value) {
        if (value.number === parseInt(busNumber, 10)) {
            if (hour) {
                list = value.bus_stations;
            } else {
                $.each(value.bus_stations, function(index, value) {
                    for ( id in value ) {
                        list.push(getStationNameById(id));
                        stationId.push(id);
                    }
                });
            }
        return false;
        }
    });
    if (hour) {
        return list;
    } else {
        return [stationId,list];        
    }
}
// stationId - string/integer - id of station
// hour - boolean - if true return buses with hours,
//                  if false return buses list
function getBusesHoursOfStation(stationId, hour) {
    var busesList = []
        hours = [];
    $.each(buses, function(index, busValue) {
        $.each(busValue.bus_stations, function(index, value) {
            if (value.hasOwnProperty(stationId)) {
                busesList.push(busValue.number);
                if (hour) {
                    hours.push(value[stationId])
                }
            }
        });
    });
    if (hour) {
        return [busesList, hours];
    } else {
        return busesList;
    }
}
// bus - string/integer - bus id
// station - integer/string - station id
function getBothHoursList(bus, station) {
    var hours=[];
    $.each(buses, function(index, value) {
        if (value.number === parseInt(bus, 10)) {
            $.each(value.bus_stations, function(index, value) {
                if (value.hasOwnProperty(station)) {
                    $.each(value[station], function(index, value) {
                        hours.push(value);
                    });
                    return false;
                }
            });
            return false;
        }
    });
    return hours;
}
// selected - string/integer - id of bus/station
// state - integer - if 0 this is bus,
//                   if 1 this is station,
function updateHoursTable(selected, state) {
    var hours;
    if (typeof selected !== "undefined") {
        if (state === 0) {
            hours = getStationsHoursOfBus(selected, true);
        } else if (state === 1 ) {
            hours = getBusesHoursOfStation(selected, true);
        }
    }
    drawTableOfHours(hours, state);
}
// hours - array - the list of hours
// state - integer - if 0 this is bus,
//                   if 1 this is station,
//                   if 2 there are both. 
function drawTableOfHours(hours, state) {
    var htmlString = "",
        i,
        j;
    if (state === 0) {
        $.each(hours, function(index, value) {
            for ( id in value ) {
                htmlString += "<tr>";
                htmlString += "<td>"+getStationNameById(id)+"</td>";
                $.each(value[id], function(index, value) {
                    htmlString += "<td>"+value+"</td>";
                });
                htmlString += "</tr>";
            }
        });
    } else if (state === 1 && hours[0].length === hours[1].length) {
        for (i = 0; i < hours[0].length; i++) {
            htmlString += "<tr>";
            htmlString += "<td>"+hours[0][i]+"</td>";
            for (j = 0; j < hours[1][i].length; j++) {
                htmlString += "<td>"+hours[1][i][j]+"</td>";
            }
            htmlString += "</tr>";
        }
    } else if (state === 2) {
        htmlString += "<tr>";
        $.each(hours, function(index, value) {
            htmlString += "<td>"+value+"</td>";
        });
        htmlString += "</tr>";
    }
    $("tbody").empty().append(htmlString);
    $("#hours-table").show();
}
// selectMenu - object - selectmenu element
// checkbox1 - object - bus checkbox/ station checkbox
// checkbox2 - object - bus checkbox/ station checkbox
function toggleSelects(selectMenu, checkbox1, checkbox2) {
    if (checkbox1[0].checked) {
        selectMenu.parents("form").show();
    } else {
        selectMenu[0].selectedIndex = 0;
        selectMenu.selectmenu("refresh").parents("form").hide();
    }
    if (!checkbox1[0].checked && !checkbox2.prop("checked")) {
        $("#hours-table").hide();
    }
}
function updateBusStationList(selectedBus) {
    var stations = getStationsHoursOfBus(selectedBus, false),
        selectedText = $("#bus_station_list option:selected").text(),
        stationsList = "",
        length = stations[0].length,
        index,
        i;
        for (i = 0; i < length; i++){
            stationsList += "<option value="+stations[0][i]+">"+stations[1][i]+"</option>";
        }
        updateSelectMenu(true, selectedText, stationsList, stations);
}
function updateBusList(selectedStation) {
    var buses = getBusesHoursOfStation(selectedStation, false),
        selectedText = $("#bus_list option:selected").text(),
        busList = "",
        index;
    $.each(buses, function(index, value) {
        busList += "<option value="+value+">"+value+"</option>";
    });
    updateSelectMenu(false, selectedText, busList, buses);
}
// mardavari sarqel, kamel toxnel demo-ic heto
function updateSelectMenu(condition, selectedText, list, array) {
    if (condition) {
        if (array.indexOf(selectedText) === -1 && selectedText === "Select bus station...") {
            $("#bus_station_list option:not(:first)").remove();
            $("#bus_station_list").append(list);
        } else {
            $("#bus_station_list option:not(:first)").remove();
            $("#bus_station_list").append(list);
            index = indexMatchingText($("#bus_station_list option"), selectedText);
            $("#bus_station_list")[0].selectedIndex = index;
            $("#bus_station_list").selectmenu("refresh");
        }
    } else {
        if (array.indexOf(selectedText) === -1 && selectedText === "Select bus...") {
            $("#bus_list option:not(:first)").remove();
            $("#bus_list").append(list);
        } else {
            $("#bus_list option:not(:first)").remove();
            $("#bus_list").append(list);
            index = indexMatchingText($("#bus_list option"), selectedText);
            $("#bus_list")[0].selectedIndex = index;
            $("#bus_list").selectmenu("refresh");
        }
    }
}
function indexMatchingText(ele, text) {
    var i;
    for (i = 0; i < ele.length; i++) {
        if (ele[i].childNodes[0].nodeValue === text){
            return i;
        }
    }
    return undefined;
}
$.mobile.document
    // Upon creation of the select menu, we want to make use of the fact that the ID of the
    // listview it generates starts with the ID of the select menu itself, plus the suffix "-menu".
    // We retrieve the listview and insert a search input before it.
    .on( "selectmenucreate", ".filterable-select", function( event ) {
        var input,
            selectmenu = $( event.target ),
            list = $( "#" + selectmenu.attr( "id" ) + "-menu" ),
            form = list.jqmData( "filter-form" );
        // We store the generated form in a variable attached to the popup so we avoid creating a
        // second form/input field when the listview is destroyed/rebuilt during a refresh.
        if ( !form ) {
            input = $( "<input data-type='search'></input>" );
            form = $( "<form></form>" ).append( input );
            input.textinput();
            list
                .before( form )
                .jqmData( "filter-form", form ) ;
            form.jqmData( "listview", list );
        }
        // Instantiate a filterable widget on the newly created selectmenu widget and indicate that
        // the generated input form element is to be used for the filtering.
        selectmenu
            .filterable({
                input: input,
                children: "> option[value]"
            })
            // Rebuild the custom select menu's list items to reflect the results of the filtering
            // done on the select menu.
            .on( "filterablefilter", function() {
                selectmenu.selectmenu( "refresh" );
            });
    })

    // The custom select list may show up as either a popup or a dialog, depending on how much
    // vertical room there is on the screen. If it shows up as a dialog, then the form containing
    // the filter input field must be transferred to the dialog so that the user can continue to
    // use it for filtering list items.
    .on( "pagecontainerbeforeshow", function( event, data ) {
        var listview,
            form,
            busList = "",
            busStationsList = "";
            $("#bus_list").parents("form").hide();
            $("#bus_station_list").parents("form").hide();
        $.getJSON("./helper/data/data.json", function(json){
            buses = json[0].buses;
            busStations = json[0].bus_stations;
            $.each(buses, function(index, value){
                busList += "<option value='"+this.number+"'>"+this.number+"</option>";
            });
            $.each(busStations, function(index, value){
                busStationsList += "<option value='"+this.id+"'>"+this.name+"</option>";
            });
            $("#bus_list").append(busList).selectmenu( "refresh" );
            $("#bus_station_list").append(busStationsList).selectmenu( "refresh" );
        });
        // We only handle the appearance of a dialog generated by a filterable selectmenu
        if ( !pageIsSelectmenuDialog( data.toPage ) ) {
            return;
        }
        listview = data.toPage.find( "ul" );
        form = listview.jqmData( "filter-form" );
        // Attach a reference to the listview as a data item to the dialog, because during the
        // pagecontainerhide handler below the selectmenu widget will already have returned the
        // listview to the popup, so we won't be able to find it inside the dialog with a selector.
        data.toPage.jqmData( "listview", listview );
        // Place the form before the listview in the dialog.
        listview.before( form );
    })
    // After the dialog is closed, the form containing the filter input is returned to the popup.
    .on( "pagecontainerhide", function( event, data ) {
        var listview, form;
        // We only handle the disappearance of a dialog generated by a filterable selectmenu
        if ( !pageIsSelectmenuDialog( data.toPage ) ) {
            return;
        }
        listview = data.prevPage.jqmData( "listview" ),
        form = listview.jqmData( "filter-form" );
        // Put the form back in the popup. It goes ahead of the listview.
        listview.before( form );
    });

    $("#bus_list").on("change", function() {
        var selectedBus = this.value;
            selectedStation = $("#bus_station_list")[0].value;
        if (selectedStation !== "Select bus station..." && selectedBus !== "Select bus...") {
            drawTableOfHours(getBothHoursList(selectedBus, selectedStation), 2);
        } else {
            updateHoursTable(selectedBus, 0);
        }
        updateBusStationList(selectedBus);
    });
    $("#bus_station_list").on("change", function() {
        var selectedStation = this.value;
            selectedBus = $("#bus_list")[0].value;
        if (selectedStation !== "Select bus station..." && selectedBus !== "Select bus...") {
            drawTableOfHours(getBothHoursList(selectedBus, selectedStation), 2);
        } else {
            updateHoursTable(selectedStation, 1);
        }
        updateBusList(selectedStation);
    });
    $("#bus_checkbox").on("change", function() {
        toggleSelects($("#bus_list"), $("#bus_checkbox"), $("#station_checkbox"));
    });
    $("#station_checkbox").on("change", function() {
        toggleSelects($("#bus_station_list"), $("#station_checkbox"), $("#bus_checkbox"));
    });
    $("#show_map").on("change", function() {
        if (this.checked) {
            $("#bus_station_list")[0].selectedIndex = 0;
            $("#bus_station_list").selectmenu("refresh").parents("form").hide();
            $("#bus_list")[0].selectedIndex = 0;
            $("#bus_list").selectmenu("refresh").parents("form").hide();
            $("#hours-table").hide();
            $("#map").show();
        } else {
            toggleSelects($("#bus_list"), $("#bus_checkbox"), $("#station_checkbox"), $("#show_map"));
            toggleSelects($("#bus_station_list"), $("#station_checkbox"), $("#bus_checkbox"), $("#show_map"));
            $("#map").hide();
        }
    });
})( jQuery );