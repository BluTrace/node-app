const ZONES = {
    'HOT'     : 2,
    'WARM'    : 1,
    'COOL'    : 0,
    'COLD'    : -1
}

function Beacon(macAddress,coord){
    this.macAddress = macAddress
    this.coord      = coord
    this.currentRSSI            = null
    this.rssiAtAssociationRange = null
    this.rssiAtPeriphery        = null
    this.zone                   = ZONES['COLD']
    this.name                   = "Beacon ("+ this.macAddress + ")"
}

Beacon.prototype.updateRSSI = function (rssi){
    console.log(this.name+" - updating RSSI");
    this.currentRSSI = rssi;
    if(this.rssiAtAssociationRange==null||this.rssiAtPeriphery==null) throw new Error(this.name+" is not calibrated!");
    if(this.currentRSSI<this.rssiAtAssociationRange){
        this.zone = ZONES['HOT'];
    } else if(this.currentRSSI>=this.rssiAtAssociationRange&&(this.currentRSSI<this.rssiAtPeriphery)) {
        this.zone = ZONES['WARM'];
    } else if(this.currentRSSI>=this.rssiAtPeriphery) {
        this.zone = ZONES['COOL'];
    }
}

Beacon.prototype.calibrate = function(zone,rssi){
    if(ZONES[zone]==undefined){
        throw new Error("invalid Zone!")
    }
    switch(zone){
        case 'HOT':
            this.rssiAtAssociationRange = rssi;
            break;
        case 'WARM':
            this.rssiAtPeriphery = rssi;
            break;
    }
}

module.exports = Beacon;
