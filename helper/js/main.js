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
//                   if false return stations list
// mtacel vor miangamic stationneri anunner@ poxancenq???
function getStationsHoursOfBus(busNumber, hour) {
    var list = [];
    $.each(buses, function(index, value) {
        if (value.number === parseInt(busNumber, 10)) {
            if (hour) {
                list = value.bus_stations;
            } else {
                $.each(value.bus_stations, function(index, value) {
                    for ( id in value ) {
                        list.push(getStationNameById(id));
                    }
                });
            }
        return false;
        }
    });
    return list;
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
                    $.each(value[selectedStation], function(index, value) {
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
//                   if 2 there are both. 
function updateHoursTable(selected, state) {
    var hours;
        s1 = $("#bus_station_list");
        s2 = $("#bus_list");
    if (typeof selected !== "undefined") {
        if (state === 0) {
            hours = getStationsHoursOfBus(selected, true);
        } else if (state === 1 ) {
            hours = getBusesHoursOfStation(selected, true)
        }
    } else if (state === 2) {
        hours = getBothHoursList(s2, s1);
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
        selectMenu[0].selectedIndex = 0;
        selectMenu.selectmenu("refresh").parents("form").show();
    } else {
        selectMenu.parents("form").hide();   
    }
    if (!checkbox1[0].checked && !checkbox2.prop("checked")) {
        $("#hours-table").hide();
    }
}

function updateBusStationList() {
/*    busStationsList = "";
    if (typeof selectedBus !== "undefined") {
        $.each(buses, function(index, value) {
            if (value.number === parseInt(selectedBus, 10)) {
                $.each(value.bus_stations, function(index, value) {
                    for ( property in value ) {
                        $.each(busStations, function(index, value) {
                            if (value.id === parseInt(property,10)) {
                                busStationsList += "<option value='"+value.id+"'>"+value.name+"</option>";
                            }
                        });
                    }
                });
            }
        });
    }*/
}
function updateBusList() {
/*    busList = "";
    if (typeof selectedStation !== "undefined") {
        $.each(buses, function(index, busValue) {
            $.each(busValue.bus_stations, function(index, value) {
                if (value.hasOwnProperty(selectedStation)) {
                    busList += "<option>"+busValue.number+"</option>";
                }
            });
        });
    }*/
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
                busList += "<option>"+this.number+"</option>";
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
        updateHoursTable(selectedBus, 0);
        updateHoursTable(undefined, 2);
        //updateBusStationList()
    });
    $("#bus_station_list").on("change", function() {
        var selectedStation = this.value;
        updateHoursTable(selectedStation, 1);
        updateHoursTable(undefined, 2);
        //updateBusList();
    });
    $("#bus_checkbox").on("change", function() {
        toggleSelects($("#bus_list"), $("#bus_checkbox"), $("#station_checkbox"));
    });
    $("#station_checkbox").on("change", function() {
        toggleSelects($("#bus_station_list"), $("#station_checkbox"), $("#bus_checkbox"));
    });
})( jQuery );