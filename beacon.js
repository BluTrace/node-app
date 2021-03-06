var ZONES = {
    'HOT'     : 2,
    'WARM'    : 1,
    'COOL'    : 0,
    'COLD'    : -1
}

function Beacon(macAddress,name,x,y){
    this.signalHistory = [];
    this.macAddress = macAddress
    this.x          = x
    this.y          = y
    if(name){
        this.btName = name
    } else {
        this.btName = macAddress
    }
    this.currentRSSI            = null
    this.rssiAtAssociationRange = null
    this.rssiAtPeriphery        = null
    this.zone                   = ZONES['COLD']
    this.name                   = function() { return "Beacon ("+ this.macAddress + ") "+this.btName }
    this.normalizedRSSI         = function() { return parseInt(this.currentRSSI*100 / this.rssiAtAssociationRange) }
    this.influencing            = function() { return this.zone!=ZONES['COLD'] }
}

Beacon.prototype.updateRSSI = function (rssi){
    this.currentRSSI = rssi;
    this.signalHistory.push(rssi);
    //if(this.rssiAtAssociationRange==null||this.rssiAtPeriphery==null) throw new Error(this.name()+" is not calibrated!");
    if(this.currentRSSI>=this.rssiAtAssociationRange){
        this.zone = ZONES['HOT'];
    } else if(this.currentRSSI<this.rssiAtAssociationRange&&(this.currentRSSI>=this.rssiAtPeriphery)) {
        this.zone = ZONES['WARM'];
    } else if(this.currentRSSI<this.rssiAtPeriphery) {
        this.zone = ZONES['COOL'];
    }
}

Beacon.prototype.setName = function(n){
   this.btName = n;
}

Beacon.prototype.setXY = function(x,y){
  this.x = x;
  this.y = y;
}

Beacon.prototype.isHot = function(){
    return this.zone==ZONES['HOT'];
}

Beacon.prototype.selfCalibrate = function(){
    if(this.signalHistory.length>=2){
     this.rssiAtAssociationRange = Math.ceil(this.signalHistory
        .map(function(el){return parseInt(el);})
        .sort(function(a,b){return a<b;})
        .slice(0,2)
        .reduce(function(a,b){return a+b})/2);
     this.rssiAtPeriphery = this.rssiAtAssociationRange-20;
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
