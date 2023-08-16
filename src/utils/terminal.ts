
type ColorType = 'ERROR' | 'SUCCESS' | 'WARNING' | 'INFO' 

const colorize = (msg: string | number | boolean, type: ColorType) => `[${type}]${msg}[/${type}]`

export default {
    colorize
}