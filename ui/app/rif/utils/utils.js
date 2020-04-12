//Constant names, if you want to add a new token (icon), just go to constant.js and add one to the array, then add it to getNameTokenForIcon
import { cryptos } from '../constants'

var getIconForToken = function(tokenName) {
    let cryto = cryptos[tokenName]
    return cryto ? cryto : cryptos.default
}

export {
    getIconForToken,
}