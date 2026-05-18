export function getPage1() {
    return '#~0~1~P01~0020~2~0~~2~2~```````````W E L C O M E~1~0~~2~0~~2~2~```````````````T O~2~0~~2~0~~2~2~````I`I`T````K H A R A G P U R~2~0~~1~0~~1~0~~1~0~~';
}

export function getPage2(
    temp: number | null = 0,
    humid: number | null = 0,
    so2: number | null = 0,
    no2: number | null = 0,
    co2: number | null = 0
) {
    return `#~1~1~P02~0005~2~1~~2~1~PARAMETERS\`\`VALUE\`STD\`UNIT~2~0~  ~2~1~TEMPERATURE \`\`${temp}\`\`\`\`\`\`*c~2~0~  ~2~1~HUMIDITY\`\`\`\`\` ${humid}\`\`\`\`\`\`%~2~0~  ~2~1~\`\`SOX\`\`\`\`\`\`${so2}\`\` 80\`\` PPM~2~0~  ~2~1~\`\`NOX\`\`\`\`\`\`${no2}\`\` 80\`\` PPM~2~0~  ~2~0~\`\`CO\`\`\`\`\`\`${co2}\`\` 80\`\`PPM~`;
}

export function getPage3(
    pm25: number | null = 0,
    pm10: number | null = 0,
    aqi: number | null = 0,
    longitude: number | null = 0
) {
    return `#~1~1~P03~0005~2~1~~2~1~PARAMETERS\`\`VALUE\`STD\`UNIT~2~0~  ~2~1~\`\`PM2.5\`\`\`\`\`${pm25} \`\`\` 60\`ug/m3~2~0~  ~2~1~\`\`PM10\`\`\`\`\` ${pm10} \`\`\`100\`ug/m3~2~0~  ~2~1~\`AQI\`\`\`\`${aqi}\`\`\`*N~2~0~  ~2~1~\`LONGITUDE\`\`\`${longitude}\`\`\` *E~2~0~  ~2~0~  ~`;
}

export function getPage4(
    line1: string = '',
    line2: string = '',
    line3: string = '',
    footer1: string = '',
    footer2: string = ''
) {
    return `#~0~0~P04~0005~2~1~${line1}~2~2~${line2} ~2~2~${line3} ~1~1~${footer1}~1~2~${footer2}~1~0~~2~0~~1~0~~1~0~~1~0~~1~0~~1~0~~`;
}

export function getPage5() {
    return `#~0~0~P05~0090~1~1~0123456789 123456789 123456789 123456789 123456789 ABC~1~1~0123456789 123456789 123456789 123456789 123456789 ABC~1~1~0123456789 123456789 123456789 123456789 123456789 ABC~1~1~0123456789 123456789 123456789 123456789 123456789 ABC~1~1~0123456789 123456789 123456789 123456789 123456789 ABC~1~1~0123456789 123456789 123456789 123456789 123456789 ABC~1~1~0123456789 123456789 123456789 123456789 123456789 ABC~1~1~0123456789 123456789 123456789 123456789 123456789 ABC~1~1~0123456789 123456789 123456789 123456789 123456789 ABC~1~1~0123456789 123456789 123456789 123456789 123456789 ABC~2~1~0123456789 123456789 123456789 123456789 123456789 ABC~1~1~0123456789 123456789 123456789 123456789 123456789 ABC~`;
}

export function getPage6() {
    return `#~0~0~P06~0006~1~1~Welcome to IIT Kharagpur~2~1~ghg~1~1~LINE3~1~1~LINE4~1~1~LINE5~1~1~LINE6~1~1~LINE7~1~1~LINE8~1~1~LINE9~1~1~LINE10~2~1~LINE11~1~1~Line12~`;
}

export function getPage7() {
    return `#~0~0~P07~0007~1~1~hhhhola~1~0~~1~0~~1~0~~1~0~~1~0~~1~0~~1~0~~1~0~~1~0~~1~0~~1~0~~`;
}

export function getPage8() {
    return `#~0~0~P08~0008~2~1~THIS IS PAGE 05~1~1~LINE2~1~2~ghi~1~1~LINE4~1~1~LINE5~1~1~LINE6~~1~LINE7~1~1~LINE8~~1~LINE9~~1~LINE10~~1~LINE11~~1~LINE12~`;
}

export function getPage9() {
    return `#~0~0~P09~0009~1~1~THIS IS LINE1 PAGE 6~~0~~~0~~~0~~~0~~~0~~~0~~~0~~~0~~~0~~~0~~~0~~`;
}

export function getPage10() {
    return `#~0~0~P10~0005~2~1~THIS IS PAGE 07~2~0~~1~0~~1~0~~1~0~~1~0~~1~0~~1~0~~1~0~~1~0~~1~0~~1~0~~`;
}

export function getPage11() {
    return `#~0~0~P11~0005~1~1~THIS IS PAGE 08~2~0~~~1~LINE3~1~1~LINE4~1~1~LINE5~~1~LINE6~1~1~LINE7~1~1~LINE8~~1~LINE9~~1~LINE10~~1~LINE11~1~1~LINE12~`;
}

export function getPage12() {
    return `#~0~0~P12~0006~2~1~THIS IS PAGE 09~1~1~ghg~~1~LINE3~1~1~LINE4~1~1~LINE5~~1~LINE6~1~1~LINE7~1~1~LINE8~~1~LINE9~~1~LINE10~~1~LINE11~~1~LINE12~`;
}

export function getPage13() {
    return `#~0~0~P13~0005~2~1~THIS IS PAGE 10~1~1~THIS IS LINE 10, SCROLL HAS BEEN UPDATED~1~1~LINE3~1~1~LINE4~1~1~LINE5~1~1~LINE6~1~1~LINE7~1~1~LINE8~1~1~LINE9~1~1~LINE10~2~1~LINE11~1~1~LINE12~`;
}

export function getPage14() {
    return `#~0~1~P14~28~2~1~Welcome to IIT Kharagpur ~`;
}