function BytesToFloat32(bytes, littleEndian = false) {
    var combinedBytes = 0;
    if (littleEndian) {
        bytes = bytes.slice().reverse();
    }
    for (var i = 0; i < 4; i++) {
        combinedBytes |= bytes[i] << (8 * i);
    }

    var sign = (combinedBytes & 0x80000000) ? -1 : 1;
    var exponent = ((combinedBytes >> 23) & 0xFF) - 127;
    var significand = (combinedBytes & 0x7FFFFF) | 0x800000; // Add back the hidden bit

    if (exponent === 128) {
        return sign * ((significand) ? Number.NaN : Number.POSITIVE_INFINITY);
    }

    if (exponent === -127) {
        if (significand === 0) return sign * 0.0;
        exponent = -126;
        significand /= (1 << 22);
    } else {
        significand /= (1 << 23);
    }

    return sign * significand * Math.pow(2, exponent);
}

function Decoder(bytes, port) {
    var voltage_l1 = BytesToFloat32(bytes.slice(3, 7), true);
    var voltage_l1 = voltage_l1.toFixed(1);
    var voltage_l2 = BytesToFloat32(bytes.slice(7, 11), true);
    var voltage_l2 = voltage_l2.toFixed(1);
    var voltage_l3 = BytesToFloat32(bytes.slice(11, 15), true);
    var voltage_l3 = voltage_l3.toFixed(1);
    var current_l1 = BytesToFloat32(bytes.slice(15, 19), true);
    var current_l1 = current_l1.toFixed(2);
    var current_l2 = BytesToFloat32(bytes.slice(19, 23), true);
    var current_l2 = current_l2.toFixed(2);
    var current_l3 = BytesToFloat32(bytes.slice(23, 27), true);
    var current_l3 = current_l3.toFixed(2);
    var total_kW = BytesToFloat32(bytes.slice(27, 31), true);
    var total_kW = total_kW.toFixed(2);
    var L1_kW = BytesToFloat32(bytes.slice(31, 35), true);
    var L1_kW = L1_kW.toFixed(2);
    var L2_kW = BytesToFloat32(bytes.slice(35, 39), true);
    var L2_kW = L2_kW.toFixed(2);
    var L3_kW = BytesToFloat32(bytes.slice(39, 43), true);
    var L3_kW = L3_kW.toFixed(2);
    var Grid_Frequency = BytesToFloat32(bytes.slice(43, 47), true);
    var Grid_Frequency = Grid_Frequency.toFixed(2);
    
    var decodedPayload = {
        Voltage_L1: voltage_l1,
        Voltage_L2: voltage_l2,
        Voltage_L3: voltage_l3,
        Current_L1: current_l1,
        Current_L2: current_l2,
        Current_L3: current_l3,
        Total_use_kW: total_kW,
        L1_kW: L1_kW,
        L2_kW: L2_kW,
        L3_kW: L3_kW,
        Grid_Frequency: Grid_Frequency,
    };
    return decodedPayload;
}
