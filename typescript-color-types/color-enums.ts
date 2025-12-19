export enum COLOR_CODE_SYSTEM_NAME {
    HEX3 = "hex3",
    HEX6 = "hex6",
    HEX8 = "hex8",
    RGB = "rgb",
    HSL = "hsl",
    CMYK = "cmyk"
}

export enum COLOR_CODE_FORMAT_STRING {
    HEX3 = "#${r1}${g1}${b1}",
    HEX6 = "#${r1}${r2}${g1}${g2}${b1}${b2}",
    HEX8 = "#${r1}${r2}${g1}${g2}${b1}${b2}${a1}${a2}",
    RGB = "rgb(${R}, ${G}, ${B})",
    HSL = "hsl(${H}, ${S}%, ${L}%)",
    CMYK = "cmyk(${C}%, ${M}%, ${Y}%, ${K}%)"
}

export enum COLOR_FAMILY {
    RED = "Red Shades",
    ORANGE = "Orange Shades",
    YELLOW = "Yellow Shades",
    GREEN = "Green Shades",
    BLUE = "Blue Shades",
    PURPLE = "Purple Shades",
    PINK = "Pink Shades",
    BROWN = "Brown Shades",
    GREY = "Grey Shades",
    WHITE = "White Shades",
    BLACK = "Black Shades",
    OTHER = "Other"

}
