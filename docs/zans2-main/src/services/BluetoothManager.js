import { Container } from "unstated"

import BluetoothSerial from "react-native-bluetooth-serial"

const DIFF_FACTOR = 1

const POLL_SPEED = 200

const DEVICE1 = "00:18:E4:35:FE:DE"
const DEVICE2 = "00:21:13:00:9E:8D"
const DEVICE3 = "A4:CF:12:75:AD:92"

class BluetoothManager extends Container {
    constructor(props) {
        super(props)
        this.state = {
            deviceConnected: false,
            diffFactor: 1
        }
        this.intervalId = null
    }

    connect = async deviceAddress => {
        this.bindEvents()
        try {
            let device = await BluetoothSerial.connect(deviceAddress);


            this.setState({ deviceConnected: true })
            return device
        } catch (err) {
            return null
        }
    }

    disconnect = async () => {
        BluetoothSerial.disconnect()
    }

    pollForData = shotCb => {
        this.intervalId = setInterval(() => {
            BluetoothSerial.readFromDevice().then(data => {
                this.parse(JSON.stringify(data), shotCb)
            })
        }, POLL_SPEED)
    }

    readData = shotCb => {
        BluetoothSerial.readFromDevice().then(data => {
            this.parse(JSON.stringify(data), shotCb)
        })
    }

    stopPoll = () => {
        clearInterval(this.intervalId)
    }

    setDifficulty = (factor) => {
        this.setState({ diffFactor: factor })
    }

    parse = (data, shotCb) => {
        const split = data.split("|")
        let shots = []
        let gyr = {}
        let acc = {}
        split.forEach((item, index) => {
            if (item.includes("shot")) {
                if (item.includes("Tmp")) {
                    shots.push(item)
                    //1
                    let acX = split[index].split('AcX')[1] ? split[index].split('AcX')[1].split('=')[1] : 0
                    let acY = split[index + 1] ? split[index + 1].split('=')[1] : 0
                    let acZ = split[index + 2] ? split[index + 2].split('=')[1] : 0
                    //2
                    let acX1 = acX ? acX.replace(/[^\d.-]/g, '') : 0
                    let acY2 = acY ? acY.replace(/[^\d.-]/g, '') : 0
                    let acZ3 = acZ ? acZ.replace(/[^\d.-]/g, '') : 0

                    let hasNumber = /\d/;

                    acc = {
                        x: hasNumber.test(acX1) ? parseFloat(acX1) : 0,
                        y: hasNumber.test(acY2) ? parseFloat(acY2) : 0,
                        z: hasNumber.test(acZ3) ? parseFloat(acZ3) : 0
                    }

                    //1
                    let gyrZ = split[index - 1] ? split[index - 1].split('=')[1] : 0
                    let gyrY = split[index - 2] ? split[index - 2].split('=')[1] : 0
                    let gyrX = split[index - 3] ? split[index - 3].split('=')[1] : 0
                    //2
                    let gyrZ1 = gyrZ ? gyrZ.replace(/[^\d.-]/g, '') : 0
                    let gyrY2 = gyrY ? gyrY.replace(/[^\d.-]/g, '') : 0
                    let gyrX3 = gyrX ? gyrX.replace(/[^\d.-]/g, '') : 0

                    gyr = {
                        x: hasNumber.test(gyrZ1) ? parseFloat(gyrZ1) : 0,
                        y: hasNumber.test(gyrY2) ? parseFloat(gyrY2) : 0,
                        z: hasNumber.test(gyrX3) ? parseFloat(gyrX3) : 0
                    }
                }
            }
        })
        if (shots.length === 1) {
            let item = shots[0]
            let sanitized = item.split("\\")
            if (sanitized[2]) {
                let isolated = sanitized[2].split("n")[1]
                let scondSplit = isolated.split(",")
                if (scondSplit) {
                    let calcX = (scondSplit[0] - 508) * this.state.diffFactor
                    let calcY = (scondSplit[1] - 380) * this.state.diffFactor

                    shotCb({
                        x: calcX,
                        y: calcY,
                        accuracy: this.getAccuracy({ x: calcX, y: calcY }),
                        time: new Date().getTime(),
                        gyr,
                        acc
                    })
                }
            }
        }
    }

    getAccuracy = coordinates => {
        let percX = 100 - (Math.abs(coordinates.x) / 300) * 100
        let percY = 100 - (Math.abs(coordinates.y) / 300) * 100
        let percs = [percX, percY]
        let avg = Math.min(...percs)
        return Math.round(avg * 100) / 100
    }

    bindEvents = () => {
        BluetoothSerial.on("connectionSuccess", () => {
            console.log("Successfully connected")
        })
        BluetoothSerial.on("bluetoothEnabled", () => {
            console.log("Bluetooth is enabled")
        })
        BluetoothSerial.on("bluetoothDisabled", () => {
            console.log("Bluetooth is disabled")
        })
        BluetoothSerial.on("connectionLost", () => {
            console.log("Connection to device has been lost")

            this.setState({ deviceConnected: false })
        })
    }
}

export default new BluetoothManager()
