//import icons for each token
import { faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons'
import { faCoins, faCheckCircle, faBolt, faArchive } from '@fortawesome/free-solid-svg-icons'
/**
 * Add the icon to the array with this structure
 *   name: icon,
*/
export const cryptos = {
    bitcoin: {
        name: 'Bitcoin',
        color: '#FFA500',
        icon: faBitcoin,
    },
    ethereum: {
        name: 'Ethereum',
        color: '#065535',
        icon: faEthereum,
    },
    rsk: {
        name: 'RSK',
        color: '#003366',
        icon: faCoins,
    },
}

export const domainIconProps = {
    color: '#000080',
    icon: faCheckCircle,
}

export const luminoNodeIconProps = {
    color: '#508871',
    icon: faBolt,
}

export const rifStorageIconProps = {
    color: '#AD3232',
    icon: faArchive,
}