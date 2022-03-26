import moment from 'moment'

export default {
    random: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    },
    datetimeNow: () => {
        return moment().locale('fr').format('LTS')
    },
    sleep: (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    },
}
